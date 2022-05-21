import { KinvoCredential, KinvoCredentialResponse, Portfolios, PortfolioSummary } from "shared/type/backend.types"

/* eslint-disable class-methods-use-this */
const { ipcRenderer } = window.electron

const InvokeError = Error;

class BackendService {

  private parseErrorMessage(ex): string {
    const myRegexp = /^Error invoking remote method '[a-zA-Z0-9]+': Error: (.*)/g;
    const match = myRegexp.exec(ex.message);
    return match[1]
  }

  async getPortfolios(): Promise<Portfolios> {
    try {
      return await ipcRenderer.invoke<Portfolios>('getPortfolios')
    } catch (ex) {
      throw new InvokeError(this.parseErrorMessage(ex))
    }
  }

  async getPortfolioSummary(portfolioId: number): Promise<PortfolioSummary> {
    try {
      return await ipcRenderer.invoke<PortfolioSummary>('getPortfolioSummary', portfolioId)
    } catch (ex) {
      throw new InvokeError(this.parseErrorMessage(ex))
    }
  }

  async getCredential(): Promise<KinvoCredentialResponse> {
    try {
      return await ipcRenderer.invoke<KinvoCredentialResponse>('getCredential')
    } catch (ex) {
      throw new InvokeError(this.parseErrorMessage(ex))
    }
  }

  async login(credential: KinvoCredential, store = false): Promise<boolean> {
    try {
      return await ipcRenderer.invoke<boolean>('login', credential, store)
    } catch (ex) {
      throw new InvokeError(this.parseErrorMessage(ex))
    }
  }

  async logout() {
    return ipcRenderer.invoke<void>('logout')
  }

  async openLog() {
    return ipcRenderer.sendMessage('openLog')
  }
}

const backendService = new BackendService();
export default backendService
