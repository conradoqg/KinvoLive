/* eslint-disable no-bitwise */
/* eslint-disable no-nested-ternary */

const ptBR = {
    delimiters: {
        thousands: '.',
        decimal: ',',
        arguments: ';'
    },
    abbreviations: {
        thousand: 'mil',
        million: 'mi',
        billion: 'bi',
        trillion: 'tri'
    },
    ordinal: () => {
        return 'º';
    },
    currency: {
        symbol: 'R$'
    },
    percentage: {
        symbol: '%'
    },
    aproximate: {
        symbol: '+/-'
    }
};

const enUS = {
    delimiters: {
        thousands: ',',
        decimal: '.',
        arguments: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: (number: number) => {
        const b = number % 10;
        return (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                    (b === 3) ? 'rd' : 'th';
    },
    currency: {
        symbol: 'U$'
    },
    percentage: {
        symbol: '%'
    },
    aproximate: {
        symbol: '+/-'
    }
};

const en = {
    delimiters: {
        thousands: ',',
        decimal: '.',
        arguments: ','
    },
    percentage: {
        symbol: '%'
    },
    aproximate: {
        symbol: '+/-'
    }
};

const locales = {
    'pt-br': ptBR,
    'en': en,
    'en-us': enUS
};

export default locales;
