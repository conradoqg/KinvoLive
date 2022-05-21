import { KinvoCredential, KinvoCredentialResponse, Portfolios, PortfolioSummary } from "shared/type/backend.types";

export default interface BackendServiceInterface {
  getPortfolios(): Promise<Portfolios>

  getPortfolioSummary(portfolioId: number): Promise<PortfolioSummary>

  login(credential: KinvoCredential, store: boolean): Promise<boolean>

  getCredential(): Promise<KinvoCredentialResponse>

  logout(): void
}
