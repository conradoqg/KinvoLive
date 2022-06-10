/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */

export const provider = (provider, props = {}) => [provider, props];

export default function ProviderComposer({ providers, children }) {
  for (let i = providers.length - 1; i >= 0; --i) {
    const [Provider, props] = providers[i];
    // eslint-disable-next-line no-param-reassign
    children = <Provider {...props}> {children} </Provider>
  }
  return children;
}
