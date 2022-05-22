import { Component, Inject } from "tsdi";
import { v5 as uuidv5 } from 'uuid';
import dayjs, { Dayjs } from "dayjs";
import BackendServiceInterface from "shared/service/backend.service.interface";
import { largest, randomFloatFromInterval, smallest } from "../../shared/helpers/math";
import { delay } from "../../shared/helpers/promise";
import ConfigService from "./config.service";
import { IPCController, IPCInvoke } from "../controller/ipc.decorator";
import KinvoAPIService from "./kinvo.api/kinvo.api.service";
import { PortfolioConsolidateResponseData, PortfolioQueryPortfolioConsolidationGetPortfolioResponseData } from "./kinvo.api/kinvo.api.type";
import LoggerService from "./logger.service";
import { KinvoCredential, KinvoCredentialResponse, Portfolios, PortfolioSummary, ProductTypeId } from "../../shared/type/backend.types";
import App from "../interface/app";
import { humanize } from "../../shared/helpers/dayjs";

@Component()
@IPCController()
export default class BackendService implements BackendServiceInterface {
  @Inject()
  private loggerService: LoggerService

  @Inject()
  private configService: ConfigService

  @Inject()
  private kinvoAPIService: KinvoAPIService

  @Inject()
  private app: App

  private lastConsolidation: Dayjs = null

  private portfoliosNewValuesData: {
    [portfolioId: number]: {
      hash: string;
      newValuesAt: Dayjs;
    }
  } = {}

  private consolidate(portfolioId: number) {
    if (!this.lastConsolidation || dayjs().diff(this.lastConsolidation, 'minutes') > 120) {
      this.loggerService.debug('Requesting consolidation...')
      if (this.configService.mockData) {
        return Promise.resolve({
          consolidationRoute: 'QUEUED'
        } as PortfolioConsolidateResponseData)
      }
      this.lastConsolidation = dayjs()
      this.loggerService.debug('Requesting consolidation done.')
    } else {
      this.loggerService.debug(`Not consolidating, last was ${humanize(dayjs.duration(dayjs().diff(this.lastConsolidation, 'milliseconds')))} ago`)
    }

    return this.kinvoAPIService.postPortfolioConsolidate({
      ignoreCache: false,
      portfolioId
    })
  }

  @IPCInvoke()
  getPortfolios(): Promise<Portfolios> {
    if (this.configService.mockData) {
      return Promise.resolve<Portfolios>([{
        id: 1,
        title: 'Carteira 1',
        isPrincipal: false,
        currencySymbol: 'BRL'
      },
      {
        id: 2,
        title: 'Carteira 2',
        isPrincipal: true,
        currencySymbol: 'BRL'
      }] as Portfolios)
    }

    try {
      return this.kinvoAPIService.getPortfolioCommandPortfolioGetPortfolios() as Promise<Portfolios>;
    } catch (ex) {
      throw new Error(ex.response ? ex.response.data.error.message : ex.message)
    }
  }

  @IPCInvoke()
  async getPortfolioSummary(portfolioId: number): Promise<PortfolioSummary> {
    if (this.configService.mockData) {
      return Promise.resolve<PortfolioSummary>({
        portfolio: {
          newValuesAt: dayjs().toDate(),
          profitabilityThisMonth: randomFloatFromInterval(-5, 5, 2),
          profitabilityLast12Months: randomFloatFromInterval(-5, 5, 2),
          smallestThisMonthProfitability: randomFloatFromInterval(-5, 5, 2),
          largestThisMonthProfitability: randomFloatFromInterval(-5, 5, 2),
          smallestLast12Profitability: randomFloatFromInterval(-5, 5, 2),
          largestLast12Profitability: randomFloatFromInterval(-5, 5, 2),
          smallestPortfolioPercentage: randomFloatFromInterval(-5, 5, 2),
          largestPortfolioPercentage: randomFloatFromInterval(-5, 5, 2),
          smallestRelativeProfitabilityThisMonth: randomFloatFromInterval(-5, 5, 2),
          largestRelativeProfitabilityThisMonth: randomFloatFromInterval(-5, 5, 2),
          largestRelativeProfitabilityLast12Months: randomFloatFromInterval(-5, 5, 2),
          smallestRelativeProfitabilityLast12Months: randomFloatFromInterval(-5, 5, 2),
        },
        products: [{
          productId: 1,
          productName: 'Exemplo produto 1',
          productTypeId: ProductTypeId.BDR,
          productFinantialInstitutionId: randomFloatFromInterval(-5, 5, 2),
          productFinantialInstitutionName: 'Instituição 1',
          portfolioPercentage: randomFloatFromInterval(-5, 5, 2),
          profitabilityThisMonth: randomFloatFromInterval(-5, 5, 2),
          profitabilityLast12Months: randomFloatFromInterval(-5, 5, 2),
          relativeProfitabilityThisMonth: randomFloatFromInterval(-5, 5, 2),
          relativeProfitabilityLast12Months: randomFloatFromInterval(-5, 5, 2)
        }]
      })
    }

    try {
      await this.consolidate(portfolioId)

      let portfolio: PortfolioQueryPortfolioConsolidationGetPortfolioResponseData = null
      const tries = 10
      let trie = 1
      while (trie <= tries) {
        portfolio = await this.kinvoAPIService.getPortfolioQueryPortfolioConsolidationGetPortfolio(portfolioId)
        if (portfolio.lastUpdateDate.toISOString() === '0001-01-01T03:00:00.000Z') {
          this.loggerService.debug('Waiting for consolidation...')
          await delay(1000)
        } else {
          break;
        }
        trie += 1
      }

      const referenceMonth = dayjs(portfolio.lastUpdateDate).utc(true)

      const [portfolioStatistics, productsStatistics] = await Promise.all([
        this.kinvoAPIService.postPortfolioQueryPortfolioStatisticsGetStatisticsByDate({
          initialDate: portfolio.firstApplicationDate,
          finalDate: referenceMonth.toDate(),
          portfolioId
        }),
        this.kinvoAPIService.postPortfolioQueryProductAnalysisGetProductProftabilityByDateRange({
          initialDate: portfolio.firstApplicationDate,
          finalDate: referenceMonth.toDate(),
          portfolioId
        })
      ])

      this.hydrateNewValuesData(portfolio, portfolioId);

      const totalEquity = productsStatistics.reduce((acc, productStatistic) => acc + productStatistic.equity, 0)

      const parseEpoch = (epoch: number): Dayjs => dayjs(epoch * 1000).utc().tz('America/Sao_Paulo', true)

      const monthlyProfitability = portfolioStatistics.portfolioProfitability.monthlyProfitability.flatMap(item => item.months).sort((a, b) => a.epochMonthlyReferenceDate - b.epochMonthlyReferenceDate)
      const monthlyProfitabilityBeforeReferenceDate = monthlyProfitability.filter(monthProfitability => parseEpoch(monthProfitability.epochMonthlyReferenceDate).isSameOrBefore(referenceMonth, 'month'))

      const thisMonth = monthlyProfitabilityBeforeReferenceDate.slice(-1)
      const last12Months = monthlyProfitabilityBeforeReferenceDate.slice(-12)

      const thisMonthProfitability = (thisMonth.reduce((acc, month) => acc * (1 + (month.profitability / 100)), 1) - 1) * 100
      const last12MonthsProfitability = (last12Months.reduce((acc, month) => acc * (1 + (month.profitability / 100)), 1) - 1) * 100

      const result: PortfolioSummary = {
        portfolio: {
          newValuesAt: this.portfoliosNewValuesData[portfolioId].newValuesAt.toDate(),
          profitabilityThisMonth: thisMonthProfitability,
          profitabilityLast12Months: last12MonthsProfitability,
          smallestThisMonthProfitability: smallest(productsStatistics, (product) => product.inTheMonth.portfolioProfitability),
          largestThisMonthProfitability: largest(productsStatistics, (product) => product.inTheMonth.portfolioProfitability),
          smallestLast12Profitability: smallest(productsStatistics, (product) => product.inTwelveMonths.portfolioProfitability),
          largestLast12Profitability: largest(productsStatistics, (product) => product.inTwelveMonths.portfolioProfitability),
          smallestPortfolioPercentage: 0,
          largestPortfolioPercentage: 0,
          smallestRelativeProfitabilityThisMonth: 0,
          largestRelativeProfitabilityThisMonth: 0,
          smallestRelativeProfitabilityLast12Months: 0,
          largestRelativeProfitabilityLast12Months: 0
        },
        products: productsStatistics.map(productProfitability => {
          const portfolioPercentage = (productProfitability.equity / totalEquity) * 100
          return {
            productId: productProfitability.portfolioProductId,
            productName: productProfitability.productName,
            productTypeId: productProfitability.productTypeId as ProductTypeId,
            productFinantialInstitutionId: productProfitability.financialInstitutionId,
            productFinantialInstitutionName: productProfitability.financialInstitutionName,
            portfolioPercentage,
            profitabilityThisMonth: productProfitability.inTheMonth.portfolioProfitability,
            profitabilityLast12Months: productProfitability.inTwelveMonths.portfolioProfitability,
            relativeProfitabilityThisMonth: (productProfitability.inTheMonth.portfolioProfitability / 100) * portfolioPercentage,
            relativeProfitabilityLast12Months: (productProfitability.inTwelveMonths.portfolioProfitability / 100) * portfolioPercentage
          }
        })
      }

      result.portfolio.smallestPortfolioPercentage = smallest(result.products, (product) => product.portfolioPercentage)
      result.portfolio.largestPortfolioPercentage = largest(result.products, (product) => product.portfolioPercentage)
      result.portfolio.smallestRelativeProfitabilityThisMonth = smallest(result.products, (product) => product.relativeProfitabilityThisMonth)
      result.portfolio.largestRelativeProfitabilityThisMonth = largest(result.products, (product) => product.relativeProfitabilityThisMonth)
      result.portfolio.smallestRelativeProfitabilityLast12Months = smallest(result.products, (product) => product.relativeProfitabilityLast12Months)
      result.portfolio.largestRelativeProfitabilityLast12Months = largest(result.products, (product) => product.relativeProfitabilityLast12Months)

      return result
    } catch (ex) {
      throw new Error(ex.response ? ex.response.data.error.message : ex.message)
    }
  }

  private hydrateNewValuesData(portfolio: PortfolioQueryPortfolioConsolidationGetPortfolioResponseData, portfolioId: number) {
    const now = dayjs();
    const portfolioStateHash = uuidv5(JSON.stringify(portfolio), '76bc8e81-b0ee-4df5-93ec-a1f282821e71');
    const newValuesCandidate = {
      hash: portfolioStateHash,
      newValuesAt: now
    };
    if (!this.portfoliosNewValuesData[portfolioId]) {
      this.portfoliosNewValuesData[portfolioId] = newValuesCandidate;
    }
    if (this.portfoliosNewValuesData[portfolioId] && this.portfoliosNewValuesData[portfolioId].hash !== portfolioStateHash) {
      this.portfoliosNewValuesData[portfolioId] = newValuesCandidate;
      this.loggerService.debug('Novo valor');
      this.app.notify();
    }
  }

  @IPCInvoke()
  async login(credential: KinvoCredential, store = false): Promise<boolean> {
    try {
      this.loggerService.debug('Logining in')
      await this.kinvoAPIService.login(credential, store)
      this.loggerService.debug('Logged')
      return true
    } catch (ex) {
      this.loggerService.warn('Logging failed')
      throw new Error(ex.response ? ex.response.data.error.message : ex.message)
    }
  }

  @IPCInvoke()
  getCredential(): Promise<KinvoCredentialResponse> {
    return Promise.resolve<KinvoCredentialResponse>({ email: this.kinvoAPIService.credential.email })
  }

  @IPCInvoke()
  async logout() {
    this.kinvoAPIService.logout()
  }
}
