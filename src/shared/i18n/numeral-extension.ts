import 'numeral';

declare module 'numeral' {
  export interface NumeralJSLocale {
    percentage: {
      symbol: string
    };
    aproximate: {
      symbol: string
    };
  }
}
