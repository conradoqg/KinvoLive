/* eslint-disable */
// To parse this data:
//
//   import { Convert, CapitalGainByPortfolioResponse, PortfolioCommandPortfolioGetPortfoliosResponse, PortfolioConsolidateRequest, PortfolioConsolidateResponse, PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse, PortfolioQueryPortfolioConsolidationGetPortfolioResponse, PortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest, PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse, PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest, PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse, PortfolioQueryProductConsolidationGetProductsResponse } from "./file";
//
//   const capitalGainByPortfolioResponse = Convert.toCapitalGainByPortfolioResponse(json);
//   const portfolioCommandPortfolioGetPortfoliosResponse = Convert.toPortfolioCommandPortfolioGetPortfoliosResponse(json);
//   const portfolioConsolidateRequest = Convert.toPortfolioConsolidateRequest(json);
//   const portfolioConsolidateResponse = Convert.toPortfolioConsolidateResponse(json);
//   const portfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse = Convert.toPortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse(json);
//   const portfolioQueryPortfolioConsolidationGetPortfolioResponse = Convert.toPortfolioQueryPortfolioConsolidationGetPortfolioResponse(json);
//   const portfolioQueryPortfolioStatisticsGetStatisticsByDateRequest = Convert.toPortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest(json);
//   const portfolioQueryPortfolioStatisticsGetStatisticsByDateResponse = Convert.toPortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse(json);
//   const portfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest = Convert.toPortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest(json);
//   const portfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse = Convert.toPortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse(json);
//   const portfolioQueryProductConsolidationGetProductsResponse = Convert.toPortfolioQueryProductConsolidationGetProductsResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CapitalGainByPortfolioResponse {
    data:    CapitalGainByPortfolioResponseData;
    error:   null;
    success: boolean;
}

export interface CapitalGainByPortfolioResponseData {
    bigNumbers:                     PurpleBigNumbers;
    capitalGainByProductInTheMonth: CapitalGainByProductInTheMonth[];
}

export interface PurpleBigNumbers {
    applications:     number;
    capitalGain:      number;
    percentageResult: number;
    previousEquity:   number;
    redemptions:      number;
}

export interface CapitalGainByProductInTheMonth {
    applications:         number;
    capitalGain:          number;
    finalEquity:          number;
    initialDate:          Date;
    initialEquity:        number;
    monthlyReferenceDate: Date;
    net:                  number;
    portfolioProductId:   number;
    proceeds:             number;
    productName:          string;
    productTypeId:        number;
    redemptions:          number;
    returns:              number;
    valueApplied:         number;
}

export interface PortfolioCommandPortfolioGetPortfoliosResponse {
    data:    PortfolioCommandPortfolioGetPortfoliosResponseDatum[];
    error:   null;
    success: boolean;
}

export interface PortfolioCommandPortfolioGetPortfoliosResponseDatum {
    currencySymbol: string;
    id:             number;
    isPrincipal:    boolean;
    title:          string;
}

export interface PortfolioConsolidateRequest {
    ignoreCache: boolean;
    portfolioId: number;
}

export interface PortfolioConsolidateResponse {
    data:    PortfolioConsolidateResponseData;
    error:   null;
    success: boolean;
}

export interface PortfolioConsolidateResponseData {
    consolidationRoute: string;
}

export interface PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse {
    data:    PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData;
    error:   null;
    success: boolean;
}

export interface PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData {
    annualProfitabilityToChart:  AnnualProfitabilityToChart;
    dailyProfitabilityToChart:   LyProfitabilityToChart;
    monthlyProfitabilityToChart: LyProfitabilityToChart;
    realRateOfReturn:            RealRateOfReturn;
    summaryByDateRange:          SummaryByDateRange;
}

export interface AnnualProfitabilityToChart {
    categories: number[];
    series:     Series[];
}

export interface Series {
    data:     number[];
    name:     string;
    visible?: boolean;
}

export interface LyProfitabilityToChart {
    categories: string[];
    series:     Series[];
}

export interface RealRateOfReturn {
    portfolioRateOfReturn: number;
    rateOverCDI:           number;
    realRateOfReturn:      number;
}

export interface SummaryByDateRange {
    fromBegin:  FromBegin;
    in12Months: FromBegin;
    in24Months: FromBegin;
    in36Months: FromBegin;
    inTheMonth: FromBegin;
    inTheYear:  FromBegin;
    lastDay:    FromBegin;
}

export interface FromBegin {
    fifthSerieProfitability:  number;
    firstSerieProfitability:  number;
    fourthSerieProfitability: number;
    portfolioProfitability:   number;
    secondSerieProfitability: number;
    thirdSerieProfitability:  number;
}

export interface PortfolioQueryPortfolioConsolidationGetPortfolioResponse {
    data:    PortfolioQueryPortfolioConsolidationGetPortfolioResponseData;
    error:   null;
    success: boolean;
}

export interface PortfolioQueryPortfolioConsolidationGetPortfolioResponseData {
    equity:               number;
    firstApplicationDate: Date;
    lastUpdateDate:       Date;
    profitability:        number;
    valueApplied:         number;
}

export interface PortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest {
    finalDate:   Date;
    initialDate: Date;
    portfolioId: number;
}

export interface PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse {
    data:    PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData;
    error:   null;
    success: boolean;
}

export interface PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData {
    bigNumbers:             FluffyBigNumbers;
    portfolioProfitability: PortfolioProfitability;
    reportLogoUrl:          null;
}

export interface FluffyBigNumbers {
    equity:               number;
    equityProfit:         number;
    firstApplicationDate: Date;
    profitability:        number;
    valueApplied:         number;
}

export interface PortfolioProfitability {
    dailyProfitability:                        DailyProfitability[];
    dailyProfitabilityCumulativeByFirstSeries: DailyProfitabilityCumulativeByFirstSery[];
    dateRangeProfitability:                    Profitability;
    fromBeginningProfitability:                Profitability;
    in12MonthsProfitability:                   Profitability;
    in24MonthsProfitability:                   Profitability;
    inYearProfitability:                       Profitability;
    monthlyProfitability:                      MonthlyProfitability[];
    statisticsSummaryMonthly:                  StatisticsSummaryMonthly;
}

export interface DailyProfitability {
    dailyProfitability:       number;
    date:                     Date;
    equity:                   number;
    factor:                   number;
    fifthSerieFactor:         number;
    fifthSerieProfitability:  number;
    firstSerieFactor:         number;
    firstSerieProfitability:  number;
    fourthSerieFactor:        number;
    fourthSerieProfitability: number;
    secondSerieFactor:        number;
    secondSerieProfitability: number;
    thirdSerieFactor:         number;
    thirdSerieProfitability:  number;
    valueApplied:             number;
}

export interface DailyProfitabilityCumulativeByFirstSery {
    amountOfDays:                     number;
    profitabilityPercentageOverSerie: number;
}

export interface Profitability {
    fifthSerieProfitability:  number;
    firstSerieProfitability:  number;
    fourthSerieProfitability: number;
    portfolioProfitability:   number;
    secondSerieProfitability: number;
    thirdSerieProfitability:  number;
}

export interface MonthlyProfitability {
    fromBeginning: FromBeginningClass;
    inTheYear:     FromBeginningClass;
    months:        FromBeginningClass[];
    year:          number;
}

export interface FromBeginningClass {
    epochMonthlyReferenceDate?: number;
    indexer:                    number;
    profitability:              number;
    secondSerie:                number;
    thirdSerie:                 number;
}

export interface StatisticsSummaryMonthly {
    averageMonthlyReturn:  number;
    highestMonthlyReturn:  number;
    lowestMonthlyReturn:   number;
    monthsAboveFirstSerie: number;
    monthsBelowFirstSerie: number;
    negativeMonths:        number;
    positiveMonths:        number;
}

export interface PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest {
    finalDate:   Date;
    initialDate: Date;
    portfolioId: number;
}

export interface PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse {
    data:    PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum[];
    error:   null;
    success: boolean;
}

export interface PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum {
    equity:                               number;
    financialInstitutionId:               number;
    financialInstitutionName:             string;
    fromBeginning:                        FromBeginning | null;
    inSixMonths:                          FromBeginning | null;
    inTheMonth:                           FromBeginning | null;
    inThePeriod:                          FromBeginning | null;
    inTheYear:                            FromBeginning | null;
    inThreeMonths:                        FromBeginning | null;
    inTwelveMonths:                       FromBeginning | null;
    inTwentyfourMonths:                   FromBeginning | null;
    portfolioProductId:                   number;
    productName:                          string;
    productTypeId:                        number;
    strategyOfDiversificationDescription: string;
    strategyOfDiversificationId:          number;
}

export interface FromBeginning {
    firstSerieProfitability: number;
    portfolioProfitability:  number;
}

export interface PortfolioQueryProductConsolidationGetProductsResponse {
    data:    PortfolioQueryProductConsolidationGetProductsResponseDatum[];
    error:   null;
    success: boolean;
}

export interface PortfolioQueryProductConsolidationGetProductsResponseDatum {
    equity:                      number;
    financialInstitutionId:      number;
    financialInstitutionName:    string;
    firstApplicationDate:        string;
    hasBalance:                  number;
    hasMovementsWaitingForQuota: boolean;
    issuerId:                    number | null;
    issuerName:                  null | string;
    lastUpdate:                  string;
    partnerId:                   null;
    partnerUserAlias:            null;
    partnerUserId:               null;
    portfolioCurrencySymbol:     CurrencySymbol;
    portfolioPercentage:         number;
    portfolioProductId:          number;
    productCanBeEdited:          boolean;
    productCountryCode:          ProductCountryCode;
    productCurrencySymbol:       CurrencySymbol;
    productHasBeenImported:      boolean;
    productHasNotPricePublished: boolean;
    productHasPublishedPrice:    boolean;
    productHasQuotation:         number;
    productId:                   number;
    productName:                 string;
    productTypeId:               number;
    profitability:               number;
    tagDescription:              null;
    tagId:                       null;
    valueApplied:                number;
}

export enum CurrencySymbol {
    Brl = "BRL",
    Usd = "USD",
}

export enum ProductCountryCode {
    Br = "BR",
    Us = "US",
}

// Converts JSON types to/from your types
// and asserts the results at runtime
export class Convert {
    public static toCapitalGainByPortfolioResponse(json: any): CapitalGainByPortfolioResponse {
        return cast(json, r("CapitalGainByPortfolioResponse"));
    }

    public static capitalGainByPortfolioResponseToJson(value: CapitalGainByPortfolioResponse): any {
        return uncast(value, r("CapitalGainByPortfolioResponse"));
    }

    public static toCapitalGainByPortfolioResponseData(json: any): CapitalGainByPortfolioResponseData {
        return cast(json, r("CapitalGainByPortfolioResponseData"));
    }

    public static capitalGainByPortfolioResponseDataToJson(value: CapitalGainByPortfolioResponseData): any {
        return uncast(value, r("CapitalGainByPortfolioResponseData"));
    }

    public static toPurpleBigNumbers(json: any): PurpleBigNumbers {
        return cast(json, r("PurpleBigNumbers"));
    }

    public static purpleBigNumbersToJson(value: PurpleBigNumbers): any {
        return uncast(value, r("PurpleBigNumbers"));
    }

    public static toCapitalGainByProductInTheMonth(json: any): CapitalGainByProductInTheMonth {
        return cast(json, r("CapitalGainByProductInTheMonth"));
    }

    public static capitalGainByProductInTheMonthToJson(value: CapitalGainByProductInTheMonth): any {
        return uncast(value, r("CapitalGainByProductInTheMonth"));
    }

    public static toPortfolioCommandPortfolioGetPortfoliosResponse(json: any): PortfolioCommandPortfolioGetPortfoliosResponse {
        return cast(json, r("PortfolioCommandPortfolioGetPortfoliosResponse"));
    }

    public static portfolioCommandPortfolioGetPortfoliosResponseToJson(value: PortfolioCommandPortfolioGetPortfoliosResponse): any {
        return uncast(value, r("PortfolioCommandPortfolioGetPortfoliosResponse"));
    }

    public static toPortfolioCommandPortfolioGetPortfoliosResponseDatum(json: any): PortfolioCommandPortfolioGetPortfoliosResponseDatum {
        return cast(json, r("PortfolioCommandPortfolioGetPortfoliosResponseDatum"));
    }

    public static portfolioCommandPortfolioGetPortfoliosResponseDatumToJson(value: PortfolioCommandPortfolioGetPortfoliosResponseDatum): any {
        return uncast(value, r("PortfolioCommandPortfolioGetPortfoliosResponseDatum"));
    }

    public static toPortfolioConsolidateRequest(json: any): PortfolioConsolidateRequest {
        return cast(json, r("PortfolioConsolidateRequest"));
    }

    public static portfolioConsolidateRequestToJson(value: PortfolioConsolidateRequest): any {
        return uncast(value, r("PortfolioConsolidateRequest"));
    }

    public static toPortfolioConsolidateResponse(json: any): PortfolioConsolidateResponse {
        return cast(json, r("PortfolioConsolidateResponse"));
    }

    public static portfolioConsolidateResponseToJson(value: PortfolioConsolidateResponse): any {
        return uncast(value, r("PortfolioConsolidateResponse"));
    }

    public static toPortfolioConsolidateResponseData(json: any): PortfolioConsolidateResponseData {
        return cast(json, r("PortfolioConsolidateResponseData"));
    }

    public static portfolioConsolidateResponseDataToJson(value: PortfolioConsolidateResponseData): any {
        return uncast(value, r("PortfolioConsolidateResponseData"));
    }

    public static toPortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse(json: any): PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse {
        return cast(json, r("PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse"));
    }

    public static portfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseToJson(value: PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse): any {
        return uncast(value, r("PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse"));
    }

    public static toPortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData(json: any): PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData {
        return cast(json, r("PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData"));
    }

    public static portfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseDataToJson(value: PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData): any {
        return uncast(value, r("PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData"));
    }

    public static toAnnualProfitabilityToChart(json: any): AnnualProfitabilityToChart {
        return cast(json, r("AnnualProfitabilityToChart"));
    }

    public static annualProfitabilityToChartToJson(value: AnnualProfitabilityToChart): any {
        return uncast(value, r("AnnualProfitabilityToChart"));
    }

    public static toSeries(json: any): Series {
        return cast(json, r("Series"));
    }

    public static seriesToJson(value: Series): any {
        return uncast(value, r("Series"));
    }

    public static toLyProfitabilityToChart(json: any): LyProfitabilityToChart {
        return cast(json, r("LyProfitabilityToChart"));
    }

    public static lyProfitabilityToChartToJson(value: LyProfitabilityToChart): any {
        return uncast(value, r("LyProfitabilityToChart"));
    }

    public static toRealRateOfReturn(json: any): RealRateOfReturn {
        return cast(json, r("RealRateOfReturn"));
    }

    public static realRateOfReturnToJson(value: RealRateOfReturn): any {
        return uncast(value, r("RealRateOfReturn"));
    }

    public static toSummaryByDateRange(json: any): SummaryByDateRange {
        return cast(json, r("SummaryByDateRange"));
    }

    public static summaryByDateRangeToJson(value: SummaryByDateRange): any {
        return uncast(value, r("SummaryByDateRange"));
    }

    public static toFromBegin(json: any): FromBegin {
        return cast(json, r("FromBegin"));
    }

    public static fromBeginToJson(value: FromBegin): any {
        return uncast(value, r("FromBegin"));
    }

    public static toPortfolioQueryPortfolioConsolidationGetPortfolioResponse(json: any): PortfolioQueryPortfolioConsolidationGetPortfolioResponse {
        return cast(json, r("PortfolioQueryPortfolioConsolidationGetPortfolioResponse"));
    }

    public static portfolioQueryPortfolioConsolidationGetPortfolioResponseToJson(value: PortfolioQueryPortfolioConsolidationGetPortfolioResponse): any {
        return uncast(value, r("PortfolioQueryPortfolioConsolidationGetPortfolioResponse"));
    }

    public static toPortfolioQueryPortfolioConsolidationGetPortfolioResponseData(json: any): PortfolioQueryPortfolioConsolidationGetPortfolioResponseData {
        return cast(json, r("PortfolioQueryPortfolioConsolidationGetPortfolioResponseData"));
    }

    public static portfolioQueryPortfolioConsolidationGetPortfolioResponseDataToJson(value: PortfolioQueryPortfolioConsolidationGetPortfolioResponseData): any {
        return uncast(value, r("PortfolioQueryPortfolioConsolidationGetPortfolioResponseData"));
    }

    public static toPortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest(json: any): PortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest {
        return cast(json, r("PortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest"));
    }

    public static portfolioQueryPortfolioStatisticsGetStatisticsByDateRequestToJson(value: PortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest): any {
        return uncast(value, r("PortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest"));
    }

    public static toPortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse(json: any): PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse {
        return cast(json, r("PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse"));
    }

    public static portfolioQueryPortfolioStatisticsGetStatisticsByDateResponseToJson(value: PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse): any {
        return uncast(value, r("PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse"));
    }

    public static toPortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData(json: any): PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData {
        return cast(json, r("PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData"));
    }

    public static portfolioQueryPortfolioStatisticsGetStatisticsByDateResponseDataToJson(value: PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData): any {
        return uncast(value, r("PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData"));
    }

    public static toFluffyBigNumbers(json: any): FluffyBigNumbers {
        return cast(json, r("FluffyBigNumbers"));
    }

    public static fluffyBigNumbersToJson(value: FluffyBigNumbers): any {
        return uncast(value, r("FluffyBigNumbers"));
    }

    public static toPortfolioProfitability(json: any): PortfolioProfitability {
        return cast(json, r("PortfolioProfitability"));
    }

    public static portfolioProfitabilityToJson(value: PortfolioProfitability): any {
        return uncast(value, r("PortfolioProfitability"));
    }

    public static toDailyProfitability(json: any): DailyProfitability {
        return cast(json, r("DailyProfitability"));
    }

    public static dailyProfitabilityToJson(value: DailyProfitability): any {
        return uncast(value, r("DailyProfitability"));
    }

    public static toDailyProfitabilityCumulativeByFirstSery(json: any): DailyProfitabilityCumulativeByFirstSery {
        return cast(json, r("DailyProfitabilityCumulativeByFirstSery"));
    }

    public static dailyProfitabilityCumulativeByFirstSeryToJson(value: DailyProfitabilityCumulativeByFirstSery): any {
        return uncast(value, r("DailyProfitabilityCumulativeByFirstSery"));
    }

    public static toProfitability(json: any): Profitability {
        return cast(json, r("Profitability"));
    }

    public static profitabilityToJson(value: Profitability): any {
        return uncast(value, r("Profitability"));
    }

    public static toMonthlyProfitability(json: any): MonthlyProfitability {
        return cast(json, r("MonthlyProfitability"));
    }

    public static monthlyProfitabilityToJson(value: MonthlyProfitability): any {
        return uncast(value, r("MonthlyProfitability"));
    }

    public static toFromBeginningClass(json: any): FromBeginningClass {
        return cast(json, r("FromBeginningClass"));
    }

    public static fromBeginningClassToJson(value: FromBeginningClass): any {
        return uncast(value, r("FromBeginningClass"));
    }

    public static toStatisticsSummaryMonthly(json: any): StatisticsSummaryMonthly {
        return cast(json, r("StatisticsSummaryMonthly"));
    }

    public static statisticsSummaryMonthlyToJson(value: StatisticsSummaryMonthly): any {
        return uncast(value, r("StatisticsSummaryMonthly"));
    }

    public static toPortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest(json: any): PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest {
        return cast(json, r("PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest"));
    }

    public static portfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequestToJson(value: PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest): any {
        return uncast(value, r("PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest"));
    }

    public static toPortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse(json: any): PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse {
        return cast(json, r("PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse"));
    }

    public static portfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseToJson(value: PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse): any {
        return uncast(value, r("PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse"));
    }

    public static toPortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum(json: any): PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum {
        return cast(json, r("PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum"));
    }

    public static portfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatumToJson(value: PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum): any {
        return uncast(value, r("PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum"));
    }

    public static toFromBeginning(json: any): FromBeginning {
        return cast(json, r("FromBeginning"));
    }

    public static fromBeginningToJson(value: FromBeginning): any {
        return uncast(value, r("FromBeginning"));
    }

    public static toPortfolioQueryProductConsolidationGetProductsResponse(json: any): PortfolioQueryProductConsolidationGetProductsResponse {
        return cast(json, r("PortfolioQueryProductConsolidationGetProductsResponse"));
    }

    public static portfolioQueryProductConsolidationGetProductsResponseToJson(value: PortfolioQueryProductConsolidationGetProductsResponse): any {
        return uncast(value, r("PortfolioQueryProductConsolidationGetProductsResponse"));
    }

    public static toPortfolioQueryProductConsolidationGetProductsResponseDatum(json: any): PortfolioQueryProductConsolidationGetProductsResponseDatum {
        return cast(json, r("PortfolioQueryProductConsolidationGetProductsResponseDatum"));
    }

    public static portfolioQueryProductConsolidationGetProductsResponseDatumToJson(value: PortfolioQueryProductConsolidationGetProductsResponseDatum): any {
        return uncast(value, r("PortfolioQueryProductConsolidationGetProductsResponseDatum"));
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = val[key];
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CapitalGainByPortfolioResponse": o([
        { json: "data", js: "data", typ: r("CapitalGainByPortfolioResponseData") },
        { json: "error", js: "error", typ: null },
        { json: "success", js: "success", typ: true },
    ], false),
    "CapitalGainByPortfolioResponseData": o([
        { json: "bigNumbers", js: "bigNumbers", typ: r("PurpleBigNumbers") },
        { json: "capitalGainByProductInTheMonth", js: "capitalGainByProductInTheMonth", typ: a(r("CapitalGainByProductInTheMonth")) },
    ], false),
    "PurpleBigNumbers": o([
        { json: "applications", js: "applications", typ: 3.14 },
        { json: "capitalGain", js: "capitalGain", typ: 3.14 },
        { json: "percentageResult", js: "percentageResult", typ: 3.14 },
        { json: "previousEquity", js: "previousEquity", typ: 3.14 },
        { json: "redemptions", js: "redemptions", typ: 3.14 },
    ], false),
    "CapitalGainByProductInTheMonth": o([
        { json: "applications", js: "applications", typ: 3.14 },
        { json: "capitalGain", js: "capitalGain", typ: 3.14 },
        { json: "finalEquity", js: "finalEquity", typ: 3.14 },
        { json: "initialDate", js: "initialDate", typ: Date },
        { json: "initialEquity", js: "initialEquity", typ: 3.14 },
        { json: "monthlyReferenceDate", js: "monthlyReferenceDate", typ: Date },
        { json: "net", js: "net", typ: 3.14 },
        { json: "portfolioProductId", js: "portfolioProductId", typ: 0 },
        { json: "proceeds", js: "proceeds", typ: 3.14 },
        { json: "productName", js: "productName", typ: "" },
        { json: "productTypeId", js: "productTypeId", typ: 0 },
        { json: "redemptions", js: "redemptions", typ: 3.14 },
        { json: "returns", js: "returns", typ: 3.14 },
        { json: "valueApplied", js: "valueApplied", typ: 3.14 },
    ], false),
    "PortfolioCommandPortfolioGetPortfoliosResponse": o([
        { json: "data", js: "data", typ: a(r("PortfolioCommandPortfolioGetPortfoliosResponseDatum")) },
        { json: "error", js: "error", typ: null },
        { json: "success", js: "success", typ: true },
    ], false),
    "PortfolioCommandPortfolioGetPortfoliosResponseDatum": o([
        { json: "currencySymbol", js: "currencySymbol", typ: "" },
        { json: "id", js: "id", typ: 0 },
        { json: "isPrincipal", js: "isPrincipal", typ: true },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PortfolioConsolidateRequest": o([
        { json: "ignoreCache", js: "ignoreCache", typ: true },
        { json: "portfolioId", js: "portfolioId", typ: 0 },
    ], false),
    "PortfolioConsolidateResponse": o([
        { json: "data", js: "data", typ: r("PortfolioConsolidateResponseData") },
        { json: "error", js: "error", typ: null },
        { json: "success", js: "success", typ: true },
    ], false),
    "PortfolioConsolidateResponseData": o([
        { json: "consolidationRoute", js: "consolidationRoute", typ: "" },
    ], false),
    "PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponse": o([
        { json: "data", js: "data", typ: r("PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData") },
        { json: "error", js: "error", typ: null },
        { json: "success", js: "success", typ: true },
    ], false),
    "PortfolioQueryPortfolioAnalysisGetPeriodicPortfolioProfitabilityResponseData": o([
        { json: "annualProfitabilityToChart", js: "annualProfitabilityToChart", typ: r("AnnualProfitabilityToChart") },
        { json: "dailyProfitabilityToChart", js: "dailyProfitabilityToChart", typ: r("LyProfitabilityToChart") },
        { json: "monthlyProfitabilityToChart", js: "monthlyProfitabilityToChart", typ: r("LyProfitabilityToChart") },
        { json: "realRateOfReturn", js: "realRateOfReturn", typ: r("RealRateOfReturn") },
        { json: "summaryByDateRange", js: "summaryByDateRange", typ: r("SummaryByDateRange") },
    ], false),
    "AnnualProfitabilityToChart": o([
        { json: "categories", js: "categories", typ: a(0) },
        { json: "series", js: "series", typ: a(r("Series")) },
    ], false),
    "Series": o([
        { json: "data", js: "data", typ: a(3.14) },
        { json: "name", js: "name", typ: "" },
        { json: "visible", js: "visible", typ: u(undefined, true) },
    ], false),
    "LyProfitabilityToChart": o([
        { json: "categories", js: "categories", typ: a("") },
        { json: "series", js: "series", typ: a(r("Series")) },
    ], false),
    "RealRateOfReturn": o([
        { json: "portfolioRateOfReturn", js: "portfolioRateOfReturn", typ: 3.14 },
        { json: "rateOverCDI", js: "rateOverCDI", typ: 3.14 },
        { json: "realRateOfReturn", js: "realRateOfReturn", typ: 3.14 },
    ], false),
    "SummaryByDateRange": o([
        { json: "fromBegin", js: "fromBegin", typ: r("FromBegin") },
        { json: "in12Months", js: "in12Months", typ: r("FromBegin") },
        { json: "in24Months", js: "in24Months", typ: r("FromBegin") },
        { json: "in36Months", js: "in36Months", typ: r("FromBegin") },
        { json: "inTheMonth", js: "inTheMonth", typ: r("FromBegin") },
        { json: "inTheYear", js: "inTheYear", typ: r("FromBegin") },
        { json: "lastDay", js: "lastDay", typ: r("FromBegin") },
    ], false),
    "FromBegin": o([
        { json: "fifthSerieProfitability", js: "fifthSerieProfitability", typ: 0 },
        { json: "firstSerieProfitability", js: "firstSerieProfitability", typ: 3.14 },
        { json: "fourthSerieProfitability", js: "fourthSerieProfitability", typ: 3.14 },
        { json: "portfolioProfitability", js: "portfolioProfitability", typ: 3.14 },
        { json: "secondSerieProfitability", js: "secondSerieProfitability", typ: 3.14 },
        { json: "thirdSerieProfitability", js: "thirdSerieProfitability", typ: 3.14 },
    ], false),
    "PortfolioQueryPortfolioConsolidationGetPortfolioResponse": o([
        { json: "data", js: "data", typ: r("PortfolioQueryPortfolioConsolidationGetPortfolioResponseData") },
        { json: "error", js: "error", typ: null },
        { json: "success", js: "success", typ: true },
    ], false),
    "PortfolioQueryPortfolioConsolidationGetPortfolioResponseData": o([
        { json: "equity", js: "equity", typ: 3.14 },
        { json: "firstApplicationDate", js: "firstApplicationDate", typ: Date },
        { json: "lastUpdateDate", js: "lastUpdateDate", typ: Date },
        { json: "profitability", js: "profitability", typ: 3.14 },
        { json: "valueApplied", js: "valueApplied", typ: 3.14 },
    ], false),
    "PortfolioQueryPortfolioStatisticsGetStatisticsByDateRequest": o([
        { json: "finalDate", js: "finalDate", typ: Date },
        { json: "initialDate", js: "initialDate", typ: Date },
        { json: "portfolioId", js: "portfolioId", typ: 0 },
    ], false),
    "PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponse": o([
        { json: "data", js: "data", typ: r("PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData") },
        { json: "error", js: "error", typ: null },
        { json: "success", js: "success", typ: true },
    ], false),
    "PortfolioQueryPortfolioStatisticsGetStatisticsByDateResponseData": o([
        { json: "bigNumbers", js: "bigNumbers", typ: r("FluffyBigNumbers") },
        { json: "portfolioProfitability", js: "portfolioProfitability", typ: r("PortfolioProfitability") },
        { json: "reportLogoUrl", js: "reportLogoUrl", typ: null },
    ], false),
    "FluffyBigNumbers": o([
        { json: "equity", js: "equity", typ: 3.14 },
        { json: "equityProfit", js: "equityProfit", typ: 3.14 },
        { json: "firstApplicationDate", js: "firstApplicationDate", typ: Date },
        { json: "profitability", js: "profitability", typ: 3.14 },
        { json: "valueApplied", js: "valueApplied", typ: 3.14 },
    ], false),
    "PortfolioProfitability": o([
        { json: "dailyProfitability", js: "dailyProfitability", typ: a(r("DailyProfitability")) },
        { json: "dailyProfitabilityCumulativeByFirstSeries", js: "dailyProfitabilityCumulativeByFirstSeries", typ: a(r("DailyProfitabilityCumulativeByFirstSery")) },
        { json: "dateRangeProfitability", js: "dateRangeProfitability", typ: r("Profitability") },
        { json: "fromBeginningProfitability", js: "fromBeginningProfitability", typ: r("Profitability") },
        { json: "in12MonthsProfitability", js: "in12MonthsProfitability", typ: r("Profitability") },
        { json: "in24MonthsProfitability", js: "in24MonthsProfitability", typ: r("Profitability") },
        { json: "inYearProfitability", js: "inYearProfitability", typ: r("Profitability") },
        { json: "monthlyProfitability", js: "monthlyProfitability", typ: a(r("MonthlyProfitability")) },
        { json: "statisticsSummaryMonthly", js: "statisticsSummaryMonthly", typ: r("StatisticsSummaryMonthly") },
    ], false),
    "DailyProfitability": o([
        { json: "dailyProfitability", js: "dailyProfitability", typ: 3.14 },
        { json: "date", js: "date", typ: Date },
        { json: "equity", js: "equity", typ: 0 },
        { json: "factor", js: "factor", typ: 3.14 },
        { json: "fifthSerieFactor", js: "fifthSerieFactor", typ: 0 },
        { json: "fifthSerieProfitability", js: "fifthSerieProfitability", typ: 0 },
        { json: "firstSerieFactor", js: "firstSerieFactor", typ: 3.14 },
        { json: "firstSerieProfitability", js: "firstSerieProfitability", typ: 3.14 },
        { json: "fourthSerieFactor", js: "fourthSerieFactor", typ: 3.14 },
        { json: "fourthSerieProfitability", js: "fourthSerieProfitability", typ: 3.14 },
        { json: "secondSerieFactor", js: "secondSerieFactor", typ: 3.14 },
        { json: "secondSerieProfitability", js: "secondSerieProfitability", typ: 3.14 },
        { json: "thirdSerieFactor", js: "thirdSerieFactor", typ: 3.14 },
        { json: "thirdSerieProfitability", js: "thirdSerieProfitability", typ: 3.14 },
        { json: "valueApplied", js: "valueApplied", typ: 0 },
    ], false),
    "DailyProfitabilityCumulativeByFirstSery": o([
        { json: "amountOfDays", js: "amountOfDays", typ: 0 },
        { json: "profitabilityPercentageOverSerie", js: "profitabilityPercentageOverSerie", typ: 0 },
    ], false),
    "Profitability": o([
        { json: "fifthSerieProfitability", js: "fifthSerieProfitability", typ: 0 },
        { json: "firstSerieProfitability", js: "firstSerieProfitability", typ: 3.14 },
        { json: "fourthSerieProfitability", js: "fourthSerieProfitability", typ: 3.14 },
        { json: "portfolioProfitability", js: "portfolioProfitability", typ: 3.14 },
        { json: "secondSerieProfitability", js: "secondSerieProfitability", typ: 3.14 },
        { json: "thirdSerieProfitability", js: "thirdSerieProfitability", typ: 3.14 },
    ], false),
    "MonthlyProfitability": o([
        { json: "fromBeginning", js: "fromBeginning", typ: r("FromBeginningClass") },
        { json: "inTheYear", js: "inTheYear", typ: r("FromBeginningClass") },
        { json: "months", js: "months", typ: a(r("FromBeginningClass")) },
        { json: "year", js: "year", typ: 0 },
    ], false),
    "FromBeginningClass": o([
        { json: "epochMonthlyReferenceDate", js: "epochMonthlyReferenceDate", typ: u(undefined, 0) },
        { json: "indexer", js: "indexer", typ: 3.14 },
        { json: "profitability", js: "profitability", typ: 3.14 },
        { json: "secondSerie", js: "secondSerie", typ: 3.14 },
        { json: "thirdSerie", js: "thirdSerie", typ: 3.14 },
    ], false),
    "StatisticsSummaryMonthly": o([
        { json: "averageMonthlyReturn", js: "averageMonthlyReturn", typ: 3.14 },
        { json: "highestMonthlyReturn", js: "highestMonthlyReturn", typ: 3.14 },
        { json: "lowestMonthlyReturn", js: "lowestMonthlyReturn", typ: 3.14 },
        { json: "monthsAboveFirstSerie", js: "monthsAboveFirstSerie", typ: 0 },
        { json: "monthsBelowFirstSerie", js: "monthsBelowFirstSerie", typ: 0 },
        { json: "negativeMonths", js: "negativeMonths", typ: 0 },
        { json: "positiveMonths", js: "positiveMonths", typ: 0 },
    ], false),
    "PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeRequest": o([
        { json: "finalDate", js: "finalDate", typ: Date },
        { json: "initialDate", js: "initialDate", typ: Date },
        { json: "portfolioId", js: "portfolioId", typ: 0 },
    ], false),
    "PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponse": o([
        { json: "data", js: "data", typ: a(r("PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum")) },
        { json: "error", js: "error", typ: null },
        { json: "success", js: "success", typ: true },
    ], false),
    "PortfolioQueryProductAnalysisGetProductProftabilityByDateRangeResponseDatum": o([
        { json: "equity", js: "equity", typ: 3.14 },
        { json: "financialInstitutionId", js: "financialInstitutionId", typ: 0 },
        { json: "financialInstitutionName", js: "financialInstitutionName", typ: "" },
        { json: "fromBeginning", js: "fromBeginning", typ: u(r("FromBeginning"), null) },
        { json: "inSixMonths", js: "inSixMonths", typ: u(r("FromBeginning"), null) },
        { json: "inTheMonth", js: "inTheMonth", typ: u(r("FromBeginning"), null) },
        { json: "inThePeriod", js: "inThePeriod", typ: u(r("FromBeginning"), null) },
        { json: "inTheYear", js: "inTheYear", typ: u(r("FromBeginning"), null) },
        { json: "inThreeMonths", js: "inThreeMonths", typ: u(r("FromBeginning"), null) },
        { json: "inTwelveMonths", js: "inTwelveMonths", typ: u(r("FromBeginning"), null) },
        { json: "inTwentyfourMonths", js: "inTwentyfourMonths", typ: u(r("FromBeginning"), null) },
        { json: "portfolioProductId", js: "portfolioProductId", typ: 0 },
        { json: "productName", js: "productName", typ: "" },
        { json: "productTypeId", js: "productTypeId", typ: 0 },
        { json: "strategyOfDiversificationDescription", js: "strategyOfDiversificationDescription", typ: "" },
        { json: "strategyOfDiversificationId", js: "strategyOfDiversificationId", typ: 0 },
    ], false),
    "FromBeginning": o([
        { json: "firstSerieProfitability", js: "firstSerieProfitability", typ: 3.14 },
        { json: "portfolioProfitability", js: "portfolioProfitability", typ: 3.14 },
    ], false),
    "PortfolioQueryProductConsolidationGetProductsResponse": o([
        { json: "data", js: "data", typ: a(r("PortfolioQueryProductConsolidationGetProductsResponseDatum")) },
        { json: "error", js: "error", typ: null },
        { json: "success", js: "success", typ: true },
    ], false),
    "PortfolioQueryProductConsolidationGetProductsResponseDatum": o([
        { json: "equity", js: "equity", typ: 3.14 },
        { json: "financialInstitutionId", js: "financialInstitutionId", typ: 0 },
        { json: "financialInstitutionName", js: "financialInstitutionName", typ: "" },
        { json: "firstApplicationDate", js: "firstApplicationDate", typ: "" },
        { json: "hasBalance", js: "hasBalance", typ: 0 },
        { json: "hasMovementsWaitingForQuota", js: "hasMovementsWaitingForQuota", typ: true },
        { json: "issuerId", js: "issuerId", typ: u(0, null) },
        { json: "issuerName", js: "issuerName", typ: u(null, "") },
        { json: "lastUpdate", js: "lastUpdate", typ: "" },
        { json: "partnerId", js: "partnerId", typ: null },
        { json: "partnerUserAlias", js: "partnerUserAlias", typ: null },
        { json: "partnerUserId", js: "partnerUserId", typ: null },
        { json: "portfolioCurrencySymbol", js: "portfolioCurrencySymbol", typ: r("CurrencySymbol") },
        { json: "portfolioPercentage", js: "portfolioPercentage", typ: 3.14 },
        { json: "portfolioProductId", js: "portfolioProductId", typ: 0 },
        { json: "productCanBeEdited", js: "productCanBeEdited", typ: true },
        { json: "productCountryCode", js: "productCountryCode", typ: r("ProductCountryCode") },
        { json: "productCurrencySymbol", js: "productCurrencySymbol", typ: r("CurrencySymbol") },
        { json: "productHasBeenImported", js: "productHasBeenImported", typ: true },
        { json: "productHasNotPricePublished", js: "productHasNotPricePublished", typ: true },
        { json: "productHasPublishedPrice", js: "productHasPublishedPrice", typ: true },
        { json: "productHasQuotation", js: "productHasQuotation", typ: 0 },
        { json: "productId", js: "productId", typ: 0 },
        { json: "productName", js: "productName", typ: "" },
        { json: "productTypeId", js: "productTypeId", typ: 0 },
        { json: "profitability", js: "profitability", typ: 3.14 },
        { json: "tagDescription", js: "tagDescription", typ: null },
        { json: "tagId", js: "tagId", typ: null },
        { json: "valueApplied", js: "valueApplied", typ: 3.14 },
    ], false),
    "CurrencySymbol": [
        "BRL",
        "USD",
    ],
    "ProductCountryCode": [
        "BR",
        "US",
    ],
};
