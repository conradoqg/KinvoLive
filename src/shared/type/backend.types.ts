export enum ProductTypeId {
  FUNDS = 1,
  PENSION = 2,
  POST_FIXED_INCOME = 3,
  TREASURY_DIRECT = 4,
  SAVINGS = 5,
  PRE_FIXED_INCOME = 6,
  CRYPTOCURRENCY = 7,
  STOCK = 8,
  DEBENTURES = 9,
  CURRENCY = 10,
  FII = 11,
  BDR = 12,
  CHECKING_ACCOUNT = 14,
  COE = 15,
  CUSTOM_FIXED_INCOME = 98,
  CUSTOM = 99
}

export type Portfolios = {
  id: number,
  title: string,
  isPrincipal: boolean,
  currencySymbol: string
}[]

export type PortfolioSummary = {
  portfolio: {
    newValuesAt: Date;
    profitabilityThisMonth: number;
    profitabilityLast12Months: number;
    smallestThisMonthProfitability: number;
    largestThisMonthProfitability: number;
    smallestLast12Profitability: number;
    largestLast12Profitability: number;
    smallestPortfolioPercentage: number;
    largestPortfolioPercentage: number;
    smallestRelativeProfitabilityThisMonth: number;
    largestRelativeProfitabilityThisMonth: number;
    largestRelativeProfitabilityLast12Months: number;
    smallestRelativeProfitabilityLast12Months: number;
  };
  products: {
    productId: number;
    productName: string;
    productTypeId: ProductTypeId;
    productFinantialInstitutionId: number;
    productFinantialInstitutionName: string;
    portfolioPercentage: number;
    profitabilityThisMonth: number;
    profitabilityLast12Months: number;
    relativeProfitabilityThisMonth: number;
    relativeProfitabilityLast12Months: number;
  }[];
}

export type KinvoCredential = {
  email: string;
  password: string
}

export type KinvoCredentialResponse = {
  email: string;
}
