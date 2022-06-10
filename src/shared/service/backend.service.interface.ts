import { KinvoCredential, KinvoCredentialResponse, Portfolios, PortfolioSummary } from "shared/type/backend.types";
import { PreferenceData } from "shared/type/preference.type";

export default interface BackendServiceInterface {
  getPortfolios(): Promise<Portfolios>

  getPortfolioSummary(portfolioId: number, referenceMonth: Date): Promise<PortfolioSummary>

  login(credential: KinvoCredential, store: boolean): Promise<boolean>

  getCredential(): Promise<KinvoCredentialResponse>

  logout(): void

  getPreference<Key extends keyof PreferenceData>(key: Key): Promise<Required<PreferenceData>[Key]>

  setPreference<Key extends keyof PreferenceData>(key: Key, value?: PreferenceData[Key]): Promise<void>
}
