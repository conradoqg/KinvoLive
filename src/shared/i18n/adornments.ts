import numeral from 'numeral';
import "./numeral-extension"

export default {
  currency: () => numeral.localeData().currency.symbol,
  percentage: () => numeral.localeData().percentage.symbol,
  aproximate: () => numeral.localeData().aproximate.symbol
};
