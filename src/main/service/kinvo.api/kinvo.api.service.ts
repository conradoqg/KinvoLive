import axios, { Axios } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { Component, Initialize, Inject } from 'tsdi';
import { semaphore } from 'ts-async-decorators';
import CredentialStore from '../../store/credential.store';
import { KinvoCredential } from '../../../shared/type/backend.types';
import LoggerService from '../logger.service';
import { Convert, PortfolioConsolidateRequest, PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest } from './kinvo.api.type';

type OAuthData = {
  accessToken: string | null;
  refreshToken: string | null;
  expiration: Dayjs | null;
}

const Mutex = () => semaphore({ limit: 1 });

@Component()
export default class KinvoAPIService {
  private readonly STORE_KEY = 'kinvo';

  private BASE_URL = 'https://kinvo2c-api2.kinvo.com.br';

  private oAuthData: OAuthData | null;

  public credential: KinvoCredential;

  private axiosClient: Axios;

  @Inject()
  private credentialStore: CredentialStore

  @Inject()
  private loggerService: LoggerService

  constructor() {
    this.axiosClient = axios.create();
  }

  @Initialize()
  public init() {
    this.credential = this.credentialStore.getCredential<KinvoCredential>(this.STORE_KEY)
  }

  async login(credential: KinvoCredential, store = false) {
    this.loggerService.debug('Logging')

    const loginResponse = await this.axiosClient.post(
      `${this.BASE_URL}/v2/auth/login`,
      {
        email: credential.email,
        password: credential.password
      }
    );

    if (loginResponse.data.success === true) {
      this.loggerService.debug('Logging success')
      this.setOAuthData({
        accessToken: loginResponse.data.data.accessToken,
        refreshToken: loginResponse.data.data.refreshToken,
      });
      this.setLogged(credential, store)
    } else {
      this.loggerService.debug('Logging failed')
      throw new Error(loginResponse.data.error);
    }
  }

  private setLogged(credential: KinvoCredential, store) {
    this.credential = credential
    if (store) this.credentialStore.setCredential(this.STORE_KEY, credential)
  }

  public logout() {
    return this.setLogout()
  }

  private setLogout() {
    this.credential = null
    this.credentialStore.setCredential(this.STORE_KEY, null)
  }

  private async refresh() {
    this.loggerService.debug('Refreshing oAuth')
    const refreshResponse = await this.axiosClient.post(
      `${this.BASE_URL}/auth/sessions/refresh-token`,
      {
        refreshToken: this.oAuthData.refreshToken,
      },
      {
        headers: {
          authorization: `Bearer ${this.oAuthData.accessToken}`,
        }
      }
    );
    if (refreshResponse.data.success === true) {
      this.loggerService.debug('Refreshing success')
      this.setOAuthData({
        accessToken: refreshResponse.data.data.accessToken,
        refreshToken: refreshResponse.data.data.refreshToken
      });
    } else {
      this.loggerService.debug('Refresh failed')
      throw new Error(refreshResponse.data.error);
    }
  }

  @Mutex()
  private async hydrateOAuthData() {
    this.loggerService.debug('Hydrating oAuth')
    try {
      if (!this.oAuthData || this.oAuthData.accessToken == null) {
        this.loggerService.debug('Getting a new token');
        await this.login(this.credential)
      } else if (this.oAuthData.expiration.isBefore(dayjs())) {
        this.loggerService.debug('Refreshing existing token');
        await this.refresh()
      } else {
        this.loggerService.debug('Hydrate not necessary')
      }
    } catch (ex: any) {
      throw new Error(ex.message)
    }
  }

  private async setOAuthData(token: {
    accessToken: string;
    refreshToken: string;
  }) {
    this.loggerService.debug('Setting oAuth data')
    const { accessToken } = token;
    const { refreshToken } = token;
    const base64Url = accessToken.split('.')[1];
    const decodedValue = JSON.parse(Buffer.from(base64Url, 'base64').toString());
    this.oAuthData = {
      expiration: dayjs.unix(decodedValue.exp),
      accessToken,
      refreshToken
    }
  }

  private async doGetRequest<T extends { success: boolean, error: string }>(converter: (json: string) => T, path: string, trie = 1): Promise<T> {
    this.loggerService.debug(`Has credential? ${this.credential != null}`)
    if (this.credential) {
      this.loggerService.debug(`Request: POST to ${path}`)
      await this.hydrateOAuthData();
      try {
        const getResponse = await this.axiosClient.get(`${this.BASE_URL}${path}`, {
          headers: {
            authorization: `Bearer ${this.oAuthData.accessToken}`,
            'api-version': '6.0',
            'platform-type': 'web',
          },
        });

        const getResponseData = converter(getResponse.data)
        if (getResponseData.success) {
          return getResponseData as T;
        }
        throw new Error(getResponseData.error);
      } catch (ex: any) {
        if (ex.response && ex.response.status === 401 && trie === 1) {
          this.loggerService.debug('Received 401, trying again')
          return this.doGetRequest(converter, path, 2);
        }
        throw new Error(ex.message)
      }
    } else {
      throw new Error('Missing credentials')
    }
  }

  private async doPostRequest<T extends { success: boolean, error: string }, P>(requestConverter: (object: P) => string, responseConverter: (json: string) => T, payload: P, path: string, trie = 1): Promise<T> {
    this.loggerService.debug(`Has credential? ${this.credential != null}`)
    if (this.credential) {
      this.loggerService.debug(`Request: POST to ${path}`)
      await this.hydrateOAuthData();
      try {
        const postResponse = await this.axiosClient.post(`${this.BASE_URL}${path}`, requestConverter(payload), {
          headers: {
            authorization: `Bearer ${this.oAuthData.accessToken}`,
            'api-version': '6.0',
            'platform-type': 'web'
          }
        });

        const postResponseData = responseConverter(postResponse.data)
        if (postResponseData.success) {
          return postResponseData as T;
        }
        throw new Error(postResponseData.error);
      } catch (ex: any) {
        if (ex.response && ex.response.status === 401 && trie === 1) {
          this.loggerService.debug('Received 401, trying again')
          return this.doPostRequest(requestConverter, responseConverter, payload, path, 2);
        }
        throw new Error(ex.message)
      }
    } else {
      throw new Error('Missing credentials')
    }
  }

  async getPortfolioCommandPortfolioGetPortfolios() {
    return (
      await this.doGetRequest(
        Convert.toPortfolioCommandPortfolioGetPortfoliosResponse,
        `/portfolio-command/portfolio/getPortfolios`
      )
    ).data;
  }

  async getPortfolioQueryPortfolioConsolidationGetPortfolio(portfolioId: number) {
    return (
      await this.doGetRequest(
        Convert.toPortfolioQueryPortfolioConsolidationGetPortfolioResponse,
        `/portfolio-query/PortfolioConsolidation/GetPortfolio/${portfolioId}`
      )
    ).data;
  }

  async postPortfolioQueryProductAnalysisGetProductProftabilityByDateRange(payload: PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest) {
    return (
      await this.doPostRequest(
        Convert.portfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequestToJson,
        Convert.toPortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse,
        payload,
        `/portfolio-query/ProductAnalysis/GetProductProftabilityByDateRange/`
      )
    ).data;
  }

  async postPortfolioQueryPortfolioStatisticsGetStatisticsByDate(payload: PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest) {
    return (
      await this.doPostRequest(
        Convert.portfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequestToJson,
        Convert.toPortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse,
        payload,
        `/portfolio-query/PortfolioStatistics/GetStatisticsByDate/`
      )
    ).data;
  }

  async getCapitalGainByPortfolioResponse(initialDate: Date, finalDate: Date) {
    return (
      await this.doGetRequest(
        Convert.toCapitalGainByPortfolioResponse,
        `/capital-gain/by-portfolio/24037/?initialDate=${initialDate.toISOString()}&finalDate=${finalDate.toISOString()}`
      )
    ).data;
  }

  async getPortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitability(portfolioId: number) {
    return (
      await this.doGetRequest(
        Convert.toPortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse,
        `/portfolio-query/PortfolioAnalysis/GetPeriodicPortfolioProfitability/${portfolioId}/1`
      )
    ).data;
  }

  async postPortfolioConsolidate(payload: PortfolioConsolidateRequest) {
    return (
      await this.doPostRequest(
        Convert.portfolioConsolidateRequestToJson,
        Convert.toPortfolioConsolidateResponse,
        payload,
        `/portfolio/consolidate/`
      )
    ).data;
  }

  async getPortfolioQueryProductConsolidationGetProducts(portfolioId: number) {
    return (
      await this.doGetRequest(
        Convert.toPortfolioQueryProductConsolidationGetProductsResponse,
        `/portfolio-query/ProductConsolidation/getProducts/${portfolioId}`
      )
    ).data;
  }
}
