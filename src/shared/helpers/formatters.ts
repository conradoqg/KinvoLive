import numeral from 'numeral';
import { ProductTypeId } from '../type/backend.types';
import adornments from '../i18n/adornments'

export default {
  percentage: (value: number) => numeral(value * 100).format('0.00') + adornments.percentage(),
  categoryFormatter: {
    [ProductTypeId.STOCK]: {
      displayText: 'Ações',
      color: '#4C309B'
    },
    [ProductTypeId.CRYPTOCURRENCY]: {
      displayText: 'Criptomoeda',
      color: '#3E71B9'
    },
    [ProductTypeId.DEBENTURES]: {
      displayText: 'Debêntures',
      color: '#86B2DE'
    },
    [ProductTypeId.FUNDS]: {
      displayText: 'Fundo',
      color: "#008DCB"
    },
    [ProductTypeId.SAVINGS]: {
      displayText: 'Poupança',
      color: "#5AAAD5"
    },
    [ProductTypeId.PENSION]: {
      displayText: 'Previdência',
      color: "#D5A82C"
    },
    [ProductTypeId.POST_FIXED_INCOME]: {
      displayText: 'Renda Fixa Pós-fixada',
      color: "#94E5D2"
    },
    [ProductTypeId.PRE_FIXED_INCOME]: {
      displayText: 'Renda Fixa Prefixada',
      color: "#38BFA0"
    },
    [ProductTypeId.TREASURY_DIRECT]: {
      displayText: 'Tesouro Direto',
      color: "#86B2DE"
    },
    [ProductTypeId.CURRENCY]: {
      displayText: 'Moeda',
      color: "#B9B42C"
    },
    [ProductTypeId.FII]: {
      displayText: 'FII',
      color: "#4141D5"
    },
    [ProductTypeId.BDR]: {
      displayText: 'BDR',
      color: "#9390E5"
    },
    [ProductTypeId.CHECKING_ACCOUNT]: {
      displayText: 'Conta Corrente',
      color: "#DDDD5B"
    },
    [ProductTypeId.COE]: {
      displayText: 'COE',
      color: "#D470F3"
    },
    [ProductTypeId.CUSTOM_FIXED_INCOME]: {
      displayText: 'Renda Fixa Personalizada',
      color: "#D470F3"
    },
    [ProductTypeId.CUSTOM]: {
      displayText: 'Personalizado',
      color: "#FFD880"
    }
  }
};
