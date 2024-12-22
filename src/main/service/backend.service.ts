import { Component, Inject } from "tsdi";
import { v5 as uuidv5 } from 'uuid';
import dayjs, { Dayjs } from "dayjs";
import BackendServiceInterface from "shared/service/backend.service.interface";
import { faker } from '@faker-js/faker';
import { PreferenceData } from "shared/type/preference.type";
import PreferenceStore from "../store/preference.store";
import EnumHelpers from "../../shared/helpers/enum";
import { compoundConvertion, largest, smallest } from "../../shared/helpers/math";
import { delay } from "../../shared/helpers/promise";
import ConfigService from "./config.service";
import { IPCController, IPCInvoke } from "../controller/ipc.decorator";
import KinvoAPIService from "./kinvo.api/kinvo.api.service";
import { PortfolioConsolidateResponseData, PortfolioQueryPortfolioConsolidationGetPortfolioResponseData } from "./kinvo.api/kinvo.api.type";
import LoggerService from "./logger.service";
import { KinvoCredential, KinvoCredentialResponse, Portfolios, PortfolioSummary, PortfolioSummaryDynamicValues, PortfolioSummaryProduct, PortfolioSummaryProducts, PortfolioSummaryRangedValue, PortfolioSummaryRangedValues, PortfolioSummaryRanges, ProductTypeId } from "../../shared/type/backend.types";
import App from "../interface/app";
import { humanize } from "../../shared/helpers/dayjs";

class BackendServiceError extends Error {
  cause: Error

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = BackendServiceError.name;
    this.cause = cause
  }
}

@Component()
@IPCController({ name: 'BackendService' })
export default class BackendService implements BackendServiceInterface {
  @Inject()
  private loggerService: LoggerService

  @Inject()
  private configService: ConfigService

  @Inject()
  private kinvoAPIService: KinvoAPIService

  @Inject()
  private preferenceStore: PreferenceStore

  @Inject()
  private app: App

  private lastConsolidation: Dayjs = null

  private portfoliosNewValuesData: {
    [portfolioId: number]: {
      hash: string;
      newValuesAt: Dayjs;
    }
  } = {}


  @IPCInvoke()
  async getPortfolios(): Promise<Portfolios> {
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
      return (await this.kinvoAPIService.getPortfolioCommandPortfolioGetPortfolios()) as Portfolios;
    } catch (ex) {
      throw new BackendServiceError('Não foi possível recuperar a lista de portifólios', ex)
    }
  }

  @IPCInvoke()
  async getPortfolioSummary(portfolioId: number, month?: Date): Promise<PortfolioSummary> {
    if (this.configService.mockData) {
      const randomRange = (): PortfolioSummaryRangedValue => ({
        current: faker.datatype.number({ min: -0.5, max: 0.5, precision: 0.01 }),
        smallest: faker.datatype.number({ min: -1, max: -0.5, precision: 0.01 }),
        largest: faker.datatype.number({ min: 0.5, max: 1, precision: 0.01 })
      })

      const portfoliosRange = Array(3).fill(null)
      const productsRange = Array(30).fill(null)

      const fakeFinantialInstitution = [
        { id: 1, name: faker.company.companyName() },
        { id: 2, name: faker.company.companyName() },
        { id: 3, name: faker.company.companyName() },
        { id: 4, name: faker.company.companyName() },
        { id: 5, name: faker.company.companyName() },
        { id: 6, name: faker.company.companyName() }
      ]

      const fakeStrategy = [
        { id: 1, name: faker.company.catchPhraseAdjective() },
        { id: 2, name: faker.company.catchPhraseAdjective() },
        { id: 3, name: faker.company.catchPhraseAdjective() },
        { id: 4, name: faker.company.catchPhraseAdjective() },
        { id: 5, name: faker.company.catchPhraseAdjective() },
        { id: 6, name: faker.company.catchPhraseAdjective() }
      ]

      const fakePortfoliosData: PortfolioSummary[] = portfoliosRange.map<PortfolioSummary>((_portfolioRange, portfolioIndex) => ({
        portfolioId: portfolioIndex + 1,
        newValuesAt: dayjs().toDate(),
        monthReference: dayjs().toDate(),
        firstApplicationDate: dayjs().subtract(1, 'month').toDate(),
        lastUpdateDate: dayjs().subtract(2, 'days').toDate(),
        portfolioPercentage: randomRange(),
        inTheMonthAbsoluteProfitability: randomRange(),
        inTheMonthRelativeProfitability: randomRange(),
        inTheMonthAverageProfitability: randomRange(),
        inThreeMonthsAbsoluteProfitability: randomRange(),
        inThreeMonthsRelativeProfitability: randomRange(),
        inThreeMonthsAverageProfitability: randomRange(),
        inSixMonthsAbsoluteProfitability: randomRange(),
        inSixMonthsRelativeProfitability: randomRange(),
        inSixMonthsAverageProfitability: randomRange(),
        inTwelveMonthsAbsoluteProfitability: randomRange(),
        inTwelveMonthsRelativeProfitability: randomRange(),
        inTwelveMonthsAverageProfitability: randomRange(),
        inTwentyfourMonthsAbsoluteProfitability: randomRange(),
        inTwentyfourMonthsRelativeProfitability: randomRange(),
        inTwentyfourMonthsAverageProfitability: randomRange(),
        inTheYearAbsoluteProfitability: randomRange(),
        inTheYearRelativeProfitability: randomRange(),
        inTheYearAverageProfitability: randomRange(),
        fromBeginningAbsoluteProfitability: randomRange(),
        fromBeginningRelativeProfitability: randomRange(),
        fromBeginningAverageProfitability: randomRange(),
        products: productsRange.map<PortfolioSummaryProduct>((_productRange, productIndex) => ({
          productId: productIndex + 1,
          productName: `Exemplo produtoooooooooooooooo ${productIndex + 1}`,
          productTypeId: faker.helpers.arrayElement(EnumHelpers.getValues(ProductTypeId)),
          productFinantialInstitution: faker.helpers.arrayElement(fakeFinantialInstitution),
          productStrategy: faker.helpers.arrayElement(fakeStrategy),
          portfolioPercentage: randomRange(),
          inTheMonthAbsoluteProfitability: randomRange(),
          inTheMonthRelativeProfitability: randomRange(),
          inTheMonthAverageProfitability: randomRange(),
          inThreeMonthsAbsoluteProfitability: randomRange(),
          inThreeMonthsRelativeProfitability: randomRange(),
          inThreeMonthsAverageProfitability: randomRange(),
          inSixMonthsAbsoluteProfitability: randomRange(),
          inSixMonthsRelativeProfitability: randomRange(),
          inSixMonthsAverageProfitability: randomRange(),
          inTwelveMonthsAbsoluteProfitability: randomRange(),
          inTwelveMonthsRelativeProfitability: randomRange(),
          inTwelveMonthsAverageProfitability: randomRange(),
          inTwentyfourMonthsAbsoluteProfitability: randomRange(),
          inTwentyfourMonthsRelativeProfitability: randomRange(),
          inTwentyfourMonthsAverageProfitability: randomRange(),
          inTheYearAbsoluteProfitability: randomRange(),
          inTheYearRelativeProfitability: randomRange(),
          inTheYearAverageProfitability: randomRange(),
          fromBeginningAbsoluteProfitability: randomRange(),
          fromBeginningRelativeProfitability: randomRange(),
          fromBeginningAverageProfitability: randomRange()
        }))
      }))

      return Promise.resolve(fakePortfoliosData.find(fakePortfolioData => fakePortfolioData.portfolioId === portfolioId))
    }

    try {
      if (!this.configService.isDebug) {
        await this.consolidate(portfolioId)
      }

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

      let monthReference = dayjs(portfolio.lastUpdateDate)

      if (month) {
        monthReference = dayjs.min(dayjs(month).endOf('month').startOf('day'), monthReference)
      }

      const [portfolioProducts, portfolioStatistics, productsStatistics] = await Promise.all([
        this.kinvoAPIService.getPortfolioQueryProductConsolidationGetProducts(portfolioId),
        this.kinvoAPIService.postPortfolioQueryPortfolioStatisticsGetStatisticsByDate({
          initialDate: portfolio.firstApplicationDate,
          finalDate: monthReference.toDate(),
          portfolioId
        }),
        this.kinvoAPIService.postPortfolioQueryProductAnalysisGetProductProftabilityByDateRange({
          initialDate: portfolio.firstApplicationDate,
          finalDate: monthReference.toDate(),
          portfolioId
        })
      ])

      this.hydrateNewValuesData(portfolio, portfolioId);

      const parseEpoch = (epoch: number): Dayjs => dayjs.utc(epoch * 1000).tz('America/Sao_Paulo', true)

      const monthlyProfitability = portfolioStatistics.portfolioProfitability.monthlyProfitability.flatMap(item => item.months).sort((a, b) => a.epochMonthlyReferenceDate - b.epochMonthlyReferenceDate)
      const monthlyProfitabilityBeforeReferenceDate = monthlyProfitability.filter(monthProfitability => {
        const monthlyReferenceDate = parseEpoch(monthProfitability.epochMonthlyReferenceDate)
        return monthlyReferenceDate.isSameOrBefore(monthReference, 'month')
      })

      const totalEquity = productsStatistics.reduce((acc, productStatistic) => acc + productStatistic.equity, 0)

      // TODO: Fix
      const ranges: PortfolioSummaryRanges = [{
        byName: 'inTheMonth',
        byMonths: 1
      }, {
        byName: 'inThreeMonths',
        byMonths: 3
      }, {
        byName: 'inSixMonths',
        byMonths: 6
      }, {
        byName: 'inTwelveMonths',
        byMonths: 12
      }, {
        byName: 'inTwentyfourMonths',
        byMonths: 24
      }, {
        byName: 'inTheYear',
        byMonths: monthReference.month() + 1
      }, {
        byName: 'fromBeginning',
        byMonths: monthlyProfitabilityBeforeReferenceDate.length
      }]

      const values: PortfolioSummaryDynamicValues & PortfolioSummaryRangedValues = {
        portfolioPercentage: {
          smallest: 0,
          largest: 1,
          current: 1
        }
      }

      for (const range of ranges) {
        const lastXMonths = monthlyProfitabilityBeforeReferenceDate.slice(-range.byMonths)
        const lastXMonthsAbsoluteProfitability = (lastXMonths.reduce((acc, monthItem) => acc * (1 + (monthItem.profitability / 100)), 1) - 1)
        const lastXMonthsRelativeProfitability = lastXMonthsAbsoluteProfitability
        const lastXMonthsAverageProfitability = compoundConvertion(lastXMonthsAbsoluteProfitability, 1 / lastXMonths.length)

        values[`${range.byName}AbsoluteProfitability`] = {
          smallest: null,
          largest: null,
          current: lastXMonthsAbsoluteProfitability
        }

        values[`${range.byName}RelativeProfitability`] = {
          smallest: null,
          largest: null,
          current: lastXMonthsRelativeProfitability
        }

        values[`${range.byName}AverageProfitability`] = {
          smallest: null,
          largest: null,
          current: lastXMonthsAverageProfitability
        }
      }

      for (const range of ranges) {

        const lastXMonths = monthlyProfitabilityBeforeReferenceDate.slice(-range.byMonths)

        values[`${range.byName}AbsoluteProfitability`].smallest = smallest(lastXMonths, (monthItem) => monthItem.profitability / 100)
        values[`${range.byName}AbsoluteProfitability`].largest = largest(lastXMonths, (monthItem) => monthItem.profitability / 100)
        values[`${range.byName}RelativeProfitability`].smallest = smallest(lastXMonths, (monthItem) => monthItem.profitability / 100)
        values[`${range.byName}RelativeProfitability`].largest = largest(lastXMonths, (monthItem) => monthItem.profitability / 100)
        values[`${range.byName}AverageProfitability`].smallest = smallest(lastXMonths, () => compoundConvertion(smallest(lastXMonths, (monthItem) => monthItem.profitability / 100), 1 / lastXMonths.length))
        values[`${range.byName}AverageProfitability`].largest = largest(lastXMonths, () => compoundConvertion(largest(lastXMonths, (monthItem) => monthItem.profitability / 100), 1 / lastXMonths.length))
      }

      const products: PortfolioSummaryProducts = []

      for (const productStatistic of productsStatistics) {

        const portfolioProduct = portfolioProducts.find(product => product.portfolioProductId === productStatistic.portfolioProductId)

        if (portfolioProduct == null || portfolioProduct?.hasBalance === false) {
          // eslint-disable-next-line no-continue
          continue
        }

        const productRangedValues: PortfolioSummaryRangedValues = {
          portfolioPercentage: {
            smallest: null,
            largest: null,
            current: (productStatistic.equity / totalEquity)
          }
        }

        const productDynamicRangedValues: PortfolioSummaryDynamicValues = {

        }

        for (const range of ranges) {

          const lastXMonthsAbsoluteProfitability = productStatistic[range.byName] && productStatistic[range.byName].portfolioProfitability / 100
          const lastXMonthsRelativeProfitability = productStatistic[range.byName] && ((productStatistic[range.byName].portfolioProfitability / 100) * productRangedValues.portfolioPercentage.current)
          const lastXMonthsAverageProfitability = compoundConvertion(lastXMonthsAbsoluteProfitability, 1 / range.byMonths)

          productRangedValues[`${range.byName}AbsoluteProfitability`] = {
            smallest: null,
            largest: null,
            current: lastXMonthsAbsoluteProfitability
          }
          productRangedValues[`${range.byName}RelativeProfitability`] = {
            smallest: null,
            largest: null,
            current: lastXMonthsRelativeProfitability
          }
          productRangedValues[`${range.byName}AverageProfitability`] = {
            smallest: null,
            largest: null,
            current: lastXMonthsAverageProfitability
          }
        }

        products.push({
          productId: productStatistic.portfolioProductId,
          productName: productStatistic.productName,
          productTypeId: productStatistic.productTypeId as ProductTypeId,
          productFinantialInstitution: {
            id: productStatistic.financialInstitutionId,
            name: productStatistic.financialInstitutionName
          },
          productStrategy: {
            id: productStatistic.strategyOfDiversificationId,
            name: productStatistic.strategyOfDiversificationDescription
          },
          ...productRangedValues,
          ...productDynamicRangedValues
        })
      }

      for (const product of products) {

        product.portfolioPercentage.smallest = smallest(products, (productItem) => productItem.portfolioPercentage.current)
        product.portfolioPercentage.largest = largest(products, (productItem) => productItem.portfolioPercentage.current)

        for (const range of ranges) {
          product[`${range.byName}AbsoluteProfitability`].smallest = smallest(products, (productItem) => productItem[`${range.byName}AbsoluteProfitability`].current)
          product[`${range.byName}AbsoluteProfitability`].largest = largest(products, (productItem) => productItem[`${range.byName}AbsoluteProfitability`].current)
          product[`${range.byName}RelativeProfitability`].smallest = smallest(products, (productItem) => productItem[`${range.byName}RelativeProfitability`].current)
          product[`${range.byName}RelativeProfitability`].largest = largest(products, (productItem) => productItem[`${range.byName}RelativeProfitability`].current)
          product[`${range.byName}AverageProfitability`].smallest = smallest(products, (productItem) => productItem[`${range.byName}AverageProfitability`].current)
          product[`${range.byName}AverageProfitability`].largest = largest(products, (productItem) => productItem[`${range.byName}AverageProfitability`].current)
        }
      }

      const result: PortfolioSummary = {
        portfolioId,
        newValuesAt: this.portfoliosNewValuesData[portfolioId].newValuesAt.toDate(),
        monthReference: monthReference.toDate(),
        firstApplicationDate: dayjs(portfolio.firstApplicationDate).utc(true).toDate(),
        lastUpdateDate: dayjs(portfolio.lastUpdateDate).utc(true).toDate(),
        ...values,
        products
      }

      return result
    } catch (ex) {
      throw new BackendServiceError('Não foi possível obter os produtos do portifólio', ex)
    }
  }

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
  getCredential(): Promise<KinvoCredentialResponse> {
    try {
      const { credential } = this.kinvoAPIService

      if (credential) {
        return Promise.resolve<KinvoCredentialResponse>({
          email: credential.email
        })
      }

      return null
    } catch (ex) {
      throw new BackendServiceError('Não foi possível recuperar a credencial armazenada', ex)
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
      throw new BackendServiceError(ex.response ? ex.response.data.error.message : 'Não foi possível se autenticar', ex)
    }
  }

  @IPCInvoke()
  async logout() {
    try {
      this.kinvoAPIService.logout()
    } catch (ex) {
      throw new BackendServiceError('Não foi possível desconectar')
    }
  }

  @IPCInvoke()
  getPreference<Key extends keyof PreferenceData>(key: Key): Promise<Required<PreferenceData>[Key]> {
    return Promise.resolve(this.preferenceStore.get(key))
  }

  @IPCInvoke()
  setPreference<Key extends keyof PreferenceData>(key: Key, value?: PreferenceData[Key]): Promise<void> {
    return Promise.resolve(this.preferenceStore.set(key, value))
  }
}
