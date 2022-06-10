export type SortOptions = {
  field: string
  order: number
}

export type SelectedCols = {
  [key: string]: boolean
}

export type PortfoliosPage = {
  selectedCols: SelectedCols;
  sortOptions: SortOptions;
}

export type PreferenceData = {
  appMain: {
    width: number;
    height: number;
  },
  appRender: {
    portfoliosPage: PortfoliosPage;
  }
}
