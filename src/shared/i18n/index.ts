import numeral from 'numeral';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import locales from './locales';

dayjs.extend(localizedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

// Register new locales for numeral
for (const localeKey in locales) {
  if (numeral.locales[localeKey] != null)
    numeral.locales[localeKey] = { ...numeral.locales[localeKey], ...locales[localeKey] };
  else
    numeral.register('locale', localeKey, locales[localeKey]);
}
