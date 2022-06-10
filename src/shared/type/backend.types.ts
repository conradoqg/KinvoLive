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

export type PortfolioSummaryRanges = { byName: string, byMonths: number }[]

export const ranges = [{
  id: 'inTheMonth',
  name: 'no mês',
  shortName: 'M'
}, {
  id: 'inThreeMonths',
  name: 'em três meses',
  shortName: '3M'
}, {
  id: 'inSixMonths',
  name: 'em seis meses',
  shortName: '6M'
}, {
  id: 'inTwelveMonths',
  name: 'em doze meses',
  shortName: '12M'
}, {
  id: 'inTwentyfourMonths',
  name: 'em vinte e quatro meses',
  shortName: '24M'
}, {
  id: 'inTheYear',
  name: 'no ano',
  shortName: 'A'
}, {
  id: 'fromBeginning',
  name: 'do começo',
  shortName: 'C'
}]

export type PortfolioSummaryProducts = PortfolioSummaryProduct[]

export type PortfolioSummary = {
  portfolioId: number;
  newValuesAt: Date;
  monthReference: Date;
  firstApplicationDate: Date,
  lastUpdateDate: Date,
  products: PortfolioSummaryProducts;
} & PortfolioSummaryDynamicValues & PortfolioSummaryRangedValues

export type PortfolioSummaryProduct = {
  productId: number;
  productName: string;
  productTypeId: ProductTypeId;
  productFinantialInstitution: {
    id: number;
    name: string;
  },
  productStrategy: {
    id: number;
    name: string;
  }
} & PortfolioSummaryDynamicValues & PortfolioSummaryRangedValues

type TimeRanges = 'inTheMonth' | 'inThreeMonths' | 'inSixMonths' | 'inTwelveMonths' | 'inTwentyfourMonths' | 'inTheYear' | 'fromBeginning'

type RangedValues = 'AbsoluteProfitability' | 'RelativeProfitability' | 'AverageProfitability'

export type PortfolioSummaryRangedValue = {
  current: number;
  smallest: number;
  largest: number;
}

export type PortfolioSummaryRangedValues = {
  portfolioPercentage: PortfolioSummaryRangedValue
}

export type PortfolioSummaryDynamicValues = {
  [key in `${TimeRanges}${RangedValues}`]?: PortfolioSummaryRangedValue;
}

export type KinvoCredential = {
  email: string;
  password: string
}

export type KinvoCredentialResponse = {
  email: string;
}
