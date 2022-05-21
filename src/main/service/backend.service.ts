import { Component, Inject } from "tsdi";
import { v5 as uuidv5 } from 'uuid';
import dayjs, { Dayjs } from "dayjs";
import { shell } from "electron";
import BackendServiceInterface from "shared/service/backend.service.interface";
import { randomFloatFromInterval } from "../../shared/helpers/math";
import { delay } from "../../shared/helpers/promise";
import Config from "./config.service";
import { IPCController, IPCEvent, IPCInvoke } from "../controller/ipc.decorator";
import KinvoAPIService from "./kinvo.api/kinvo.api.service";
import { PortfolioConsolidateResponseData } from "./kinvo.api/kinvo.api.type";
import Logger from "./logger.service";
import { KinvoCredential, KinvoCredentialResponse, Portfolios, PortfolioSummary, ProductTypeId } from "../../shared/type/backend.types";
import App from "../interface/app";
import { humanize } from "../../shared/helpers/dayjs";

@Component()
@IPCController()
export default class BackendService implements BackendServiceInterface {
  @Inject()
  private logger: Logger

  @Inject()
  private config: Config

  @Inject()
  private kinvoAPI: KinvoAPIService

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
    if (this.config.mockData) {
      return Promise.resolve({
        consolidationRoute: 'QUEUED'
      } as PortfolioConsolidateResponseData)
    }
    return this.kinvoAPI.postPortfolioConsolidate({
      ignoreCache: false,
      portfolioId
    })
  }

  @IPCInvoke()
  getPortfolios(): Promise<Portfolios> {
    if (this.config.mockData) {
      return Promise.resolve([{
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
      return this.kinvoAPI.getPortfolioCommandPortfolioGetPortfolios() as Promise<Portfolios>;
    } catch (ex) {
      throw new Error(ex.response ? ex.response.data.error.message : ex.message)
    }
  }

  @IPCInvoke()
  async getPortfolioSummary(portfolioId: number): Promise<PortfolioSummary> {
    if (this.config.mockData) {
      return Promise.resolve({
        portfolio: {
          profitabilityThisMonth: randomFloatFromInterval(-5, 5, 2),
          profitabilityLast12Months: randomFloatFromInterval(-5, 5, 2)
        },
        products: [
          {
            productId: 1,
            productName: 'Exemplo produto 1',
            productTypeId: randomFloatFromInterval(1, 12, 0),
            profitabilityThisMonth: randomFloatFromInterval(-5, 5, 2),
            profitabilityLast12Months: randomFloatFromInterval(-5, 5, 2)
          }
        ]
      } as PortfolioSummary)
    }

    try {

      // TODO: Refatorar
      if (!this.lastConsolidation || dayjs().diff(this.lastConsolidation, 'minutes') > 120) {
        this.logger.silly('Requesting consolidation...')
        await this.consolidate(portfolioId)
        this.lastConsolidation = dayjs()
        this.logger.silly('Requesting consolidation done.')
      } else {
        this.logger.silly(`Not consolidating, last was ${humanize(dayjs.duration(dayjs().diff(this.lastConsolidation, 'milliseconds')))} ago`)
      }

      let portfolio = null
      const tries = 10
      let trie = 1
      while (trie <= tries) {
        portfolio = await this.kinvoAPI.getPortfolioQueryPortfolioConsolidationGetPortfolio(portfolioId)
        if (portfolio.lastUpdateDate.toISOString() === '0001-01-01T03:00:00.000Z') {
          this.logger.silly('Waiting for consolidation...')
          await delay(1000)
        } else {
          break;
        }
        trie += 1
      }

      const [portfolioProducts, portfolioProfitability, productsStatistic] = await Promise.all([
        this.kinvoAPI.getPortfolioQueryProductConsolidationGetProducts(portfolioId),
        this.kinvoAPI.getPortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitability(portfolioId),
        this.kinvoAPI.postPortfolioQueryProductAnalysisGetProductProftabilityByDateRange({
          initialDate: portfolio.firstApplicationDate,
          finalDate: portfolio.lastUpdateDate,
          portfolioId
        })
      ])

      const now = dayjs()
      const portfolioStateHash = uuidv5(JSON.stringify(portfolio), '76bc8e81-b0ee-4df5-93ec-a1f282821e71')
      const newValuesCandidate = {
        hash: portfolioStateHash,
        newValuesAt: now
      }
      if (!this.portfoliosNewValuesData[portfolioId]) {
        this.portfoliosNewValuesData[portfolioId] = newValuesCandidate
      }
      if (this.portfoliosNewValuesData[portfolioId] && this.portfoliosNewValuesData[portfolioId].hash !== portfolioStateHash) {
        this.portfoliosNewValuesData[portfolioId] = newValuesCandidate
        this.logger.info('Novo valor')
        this.app.notify()
      }

      const smallest = <T>(array: T[], getField: (data: T) => number) => array.map(item => getField(item)).reduce((acc, field) => Math.min(acc, field), Number.MAX_VALUE)
      const largest = <T>(array: T[], getField: (data: T) => number) => array.map(item => getField(item)).reduce((acc, field) => Math.max(acc, field), Number.MIN_VALUE)

      const result: PortfolioSummary = {
        portfolio: {
          newValuesAt: this.portfoliosNewValuesData[portfolioId].newValuesAt.toDate(),
          profitabilityThisMonth: portfolioProfitability.summaryByDateRange.inTheMonth.portfolioProfitability,
          profitabilityLast12Months: portfolioProfitability.summaryByDateRange.in12Months.portfolioProfitability,
          smallestThisMonthProfitability: smallest(productsStatistic, (product) => product.inTheMonth.portfolioProfitability),
          largestThisMonthProfitability: largest(productsStatistic, (product) => product.inTheMonth.portfolioProfitability),
          smallestLast12Profitability: smallest(productsStatistic, (product) => product.inTwelveMonths.portfolioProfitability),
          largestLast12Profitability: largest(productsStatistic, (product) => product.inTwelveMonths.portfolioProfitability),
          smallestPortfolioPercentage: smallest(portfolioProducts, (product) => product.portfolioPercentage),
          largestPortfolioPercentage: largest(portfolioProducts, (product) => product.portfolioPercentage),
          smallestRelativeProfitabilityThisMonth: 0,
          largestRelativeProfitabilityThisMonth: 0,
          smallestRelativeProfitabilityLast12Months: 0,
          largestRelativeProfitabilityLast12Months: 0
        },
        products: productsStatistic.map(productProfitability => {
          const foundPortfolioProduct = portfolioProducts.find(portfolioProduct => portfolioProduct.portfolioProductId === productProfitability.portfolioProductId)
          return {
            productId: productProfitability.portfolioProductId,
            productName: productProfitability.productName,
            productTypeId: productProfitability.productTypeId as ProductTypeId,
            productFinantialInstitutionId: foundPortfolioProduct && foundPortfolioProduct.financialInstitutionId,
            productFinantialInstitutionName: foundPortfolioProduct && foundPortfolioProduct.financialInstitutionName,
            portfolioPercentage: foundPortfolioProduct.portfolioPercentage,
            profitabilityThisMonth: productProfitability.inTheMonth.portfolioProfitability,
            profitabilityLast12Months: productProfitability.inTwelveMonths.portfolioProfitability,
            relativeProfitabilityThisMonth: (productProfitability.inTheMonth.portfolioProfitability / 100) * foundPortfolioProduct.portfolioPercentage,
            relativeProfitabilityLast12Months: (productProfitability.inTwelveMonths.portfolioProfitability / 100) * foundPortfolioProduct.portfolioPercentage
          }
        })
      }

      result.portfolio.smallestRelativeProfitabilityThisMonth = smallest(result.products, (product) => product.relativeProfitabilityThisMonth)
      result.portfolio.largestRelativeProfitabilityThisMonth = largest(result.products, (product) => product.relativeProfitabilityThisMonth)
      result.portfolio.smallestRelativeProfitabilityLast12Months = smallest(result.products, (product) => product.relativeProfitabilityLast12Months)
      result.portfolio.largestRelativeProfitabilityLast12Months = largest(result.products, (product) => product.relativeProfitabilityLast12Months)

      return result
    } catch (ex) {
      throw new Error(ex.response ? ex.response.data.error.message : ex.message)
    }
  }

  @IPCInvoke()
  async login(credential: KinvoCredential, store = false): Promise<boolean> {
    try {
      this.logger.silly('Logining in')
      await this.kinvoAPI.login(credential, store)
      this.logger.silly('Logged')
      return true
    } catch (ex) {
      this.logger.warn('Logging failed')
      throw new Error(ex.response ? ex.response.data.error.message : ex.message)
    }
  }

  @IPCInvoke()
  getCredential(): Promise<KinvoCredentialResponse> {
    return Promise.resolve(this.kinvoAPI.credential as KinvoCredentialResponse)
  }

  @IPCInvoke()
  async logout() {
    this.kinvoAPI.logout()
  }

  @IPCEvent()
  log(type: string, ...args: unknown[]): void {
    this.logger[type](...args)
  }

  @IPCEvent()
  openLog() {
    shell.openExternal(this.logger.LOG_PATH);
  }
}
