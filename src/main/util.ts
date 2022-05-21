/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import memoizee, { Memoized } from 'memoizee';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

// ts-ignore
export function Memoize(options?: memoizee.Options<any>) {
  return function (target: any, key: PropertyKey, descriptor: PropertyDescriptor) {
    const oldFunction = descriptor.value;
    const newFunction = memoizee(oldFunction, options);
    descriptor.value = function () {
      // eslint-disable-next-line prefer-rest-params
      return newFunction.apply(this, arguments) as Memoized<typeof oldFunction>;
    };
  };
};
