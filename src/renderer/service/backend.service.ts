/* eslint-disable class-methods-use-this */
import BackendServiceInterface from "shared/service/backend.service.interface";
import { KinvoCredential, KinvoCredentialResponse, Portfolios, PortfolioSummary } from "shared/type/backend.types"

const { ipcRenderer } = window.electron

const InvokeError = Error;

class BackendService implements BackendServiceInterface {
  private static parseErrorMessage(ex): string {
    const myRegexp = /^Error invoking remote method '[a-zA-Z0-9]+': Error: (.*)/g;
    const match = myRegexp.exec(ex.message);
    return match[1]
  }

  async getPortfolios(): Promise<Portfolios> {
    try {
      return await ipcRenderer.invoke<Portfolios>('BackendService:getPortfolios')
    } catch (ex) {
      throw new InvokeError(BackendService.parseErrorMessage(ex))
    }
  }

  async getPortfolioSummary(portfolioId: number): Promise<PortfolioSummary> {
    try {
      return await ipcRenderer.invoke<PortfolioSummary>('BackendService:getPortfolioSummary', portfolioId)
    } catch (ex) {
      throw new InvokeError(BackendService.parseErrorMessage(ex))
    }
  }

  async getCredential(): Promise<KinvoCredentialResponse> {
    try {
      return await ipcRenderer.invoke<KinvoCredentialResponse>('BackendService:getCredential')
    } catch (ex) {
      throw new InvokeError(BackendService.parseErrorMessage(ex))
    }
  }

  async login(credential: KinvoCredential, store = false): Promise<boolean> {
    try {
      return await ipcRenderer.invoke<boolean>('BackendService:login', credential, store)
    } catch (ex) {
      throw new InvokeError(BackendService.parseErrorMessage(ex))
    }
  }

  async logout() {
    return ipcRenderer.invoke<void>('BackendService:logout')
  }
}

const backendService = new BackendService();
export default backendService
