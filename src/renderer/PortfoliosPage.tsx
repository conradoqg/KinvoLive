/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Checkbox, ClickAwayListener, Divider, Grid, GridSize, Link, ListItemIcon, MenuItem, MenuList, Paper, Popper, Skeleton, Snackbar, Tooltip, Typography, useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Portfolios, PortfolioSummary, PortfolioSummaryProduct, PortfolioSummaryRangedValue, ranges } from 'shared/type/backend.types';
import React, { useEffect, useState } from 'react';
import { blue } from '@mui/material/colors';
import dayjs, { Dayjs } from 'dayjs';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import PopupState, { bindPopper, bindTrigger } from 'material-ui-popup-state';
import formatters from '../shared/helpers/formatters'
import { colorByIndex, colorByRange, hexToRgb, triColor } from '../shared/helpers/color';
import loggerService from './service/logger.service';
import Alert from './component/common/Alert';
import backendService from './service/backend.service';
import ScrollableBox from './component/common/ScrollableBox';
import MonthSelect from './component/part/MonthSelect';
import PortfolioSelect from './component/part/PortfolioSelect';
import { usePreferenceContext } from './context/usePreferenceContext';

// TODO: Centralize
const UPDATE_INTERVAL = dayjs.duration(30, 'minute').asMilliseconds()

type AvaliableCols = {
  id: string;
  title: string;
  shortTitle: string;
  style?: {
    xs?: boolean | GridSize;
    zeroMinWidth?: boolean;
    minWidth?: number;
    maxWidth?: number
    textAlign: string;
  };
  getValueToSortBy: (value: unknown) => unknown;
  displayRowValue?: (value?: unknown) => string;
  displayTooltipValue?: (value?: unknown) => string;
  displayTotalValue?: (value?: unknown) => string;
  color?: (value?: unknown) => string;
  backgroundColor?: (value?: unknown) => string;
}[]

const buildAvailableCols = (): AvaliableCols => {

  const percentageDisplayValue = (value: { current: number }): string => formatters.percentage(value.current)
  const triColorDisplayColor = (values: { current: number, smallest: number, largest: number }): string => triColor(values.current, values.smallest, values.largest)
  const rangeColorDisplayColor = (values: { current: number, smallest: number, largest: number }): string => colorByRange(values.current, values.smallest, values.largest, hexToRgb(blue[300]), hexToRgb(blue[900]))

  const baseCols: AvaliableCols = [{
    id: 'productTypeId',
    title: 'Categoria',
    shortTitle: 'C',
    style: {
      xs: false,
      minWidth: 35,
      textAlign: 'center'
    },
    displayTooltipValue: (value: string) => formatters.categoryFormatter[value].displayText,
    backgroundColor: (value: string) => formatters.categoryFormatter[value].color,
    getValueToSortBy: (value: string): string => value
  }, {
    id: 'productFinantialInstitution',
    title: 'Instituição',
    shortTitle: 'I',
    style: {
      xs: false,
      minWidth: 35,
      textAlign: 'center'
    },
    displayTooltipValue: (value: { id: number, name: string }) => value.name,
    backgroundColor: (value: { id: number, name: string }) => colorByIndex(value.id),
    getValueToSortBy: (value: { id: number, name: string }): string => value.name
  }, {
    id: 'productStrategy',
    title: 'Estratégia',
    shortTitle: 'E',
    style: {
      xs: false,
      minWidth: 35,
      textAlign: 'center'
    },
    displayTooltipValue: (value: { id: number, name: string }) => value.name,
    backgroundColor: (value: { id: number, name: string }) => colorByIndex(value.id),
    getValueToSortBy: (value: { id: number, name: string }): string => value.name
  }, {
    id: 'productName',
    title: 'Nome do investimento',
    shortTitle: 'Nome',
    style: {
      xs: true,
      zeroMinWidth: true,
      textAlign: 'left',
      minWidth: 150
    },
    displayTooltipValue: (value: string) => value,
    displayRowValue: (value: string): string => value,
    displayTotalValue: (): string => 'Total',
    getValueToSortBy: (value: string): string => value
  }]

  const rangeBasedCols = [{
    id: 'AbsoluteProfitability',
    title: 'Variação',
    shortTitle: '%',
    style: {
      xs: 1,
      minWidth: 70,
      textAlign: 'center'
    },
    displayRowValue: percentageDisplayValue,
    displayTotalValue: percentageDisplayValue,
    color: triColorDisplayColor,
    getValueToSortBy: (value: PortfolioSummaryRangedValue) => value.current
  }, {
    id: 'RelativeProfitability',
    title: 'Variação relativa',
    shortTitle: '∝',
    style: {
      xs: 1,
      minWidth: 70,
      textAlign: 'center'
    },
    displayRowValue: percentageDisplayValue,
    displayTotalValue: percentageDisplayValue,
    color: triColorDisplayColor,
    getValueToSortBy: (value: PortfolioSummaryRangedValue) => value.current
  }, {
    id: 'AverageProfitability',
    title: 'Variação média por mês',
    shortTitle: 'x̄',
    style: {
      xs: 1,
      minWidth: 70,
      textAlign: 'center'
    },
    displayRowValue: percentageDisplayValue,
    displayTotalValue: percentageDisplayValue,
    color: triColorDisplayColor,
    getValueToSortBy: (value: PortfolioSummaryRangedValue) => value.current
  }]

  const fixedCols = [{
    id: 'portfolioPercentage',
    title: 'Representividade no portifólio',
    shortTitle: 'R (%)',
    style: {
      xs: 1,
      minWidth: 70,
      textAlign: 'center'
    },
    displayRowValue: percentageDisplayValue,
    displayTotalValue: percentageDisplayValue,
    color: rangeColorDisplayColor,
    getValueToSortBy: (value: PortfolioSummaryRangedValue) => value.current
  }]

  const availableCols: AvaliableCols = []

  availableCols.push(...baseCols)

  for (const range of ranges) {
    for (const rangeBasedCol of rangeBasedCols) {
      availableCols.push({
        id: `${range.id}${rangeBasedCol.id}`,
        title: `${rangeBasedCol.title} ${range.name}`,
        shortTitle: `${range.shortName} (${rangeBasedCol.shortTitle})`,
        style: rangeBasedCol.style,
        displayRowValue: rangeBasedCol.displayRowValue,
        displayTotalValue: rangeBasedCol.displayTotalValue,
        color: rangeBasedCol.color,
        getValueToSortBy: rangeBasedCol.getValueToSortBy
      })
    }
  }

  for (const fixedCol of fixedCols) {
    availableCols.push({
      id: `${fixedCol.id}`,
      title: `${fixedCol.title}`,
      shortTitle: `${fixedCol.shortTitle}`,
      style: fixedCol.style,
      displayRowValue: fixedCol.displayRowValue,
      displayTotalValue: fixedCol.displayTotalValue,
      color: fixedCol.color,
      getValueToSortBy: fixedCol.getValueToSortBy
    })
  }

  return availableCols
}

const availableCols = buildAvailableCols()

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<Portfolios>(null)
  const [selectedPortfolio, setSelectedPortfolio] = useState<number>(null)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(null)
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>(null)
  const [errorMessage, setErrorMessage] = useState<string>(null)
  const [preferences, preferencesActions] = usePreferenceContext()
  // TODO: Split loading variables
  const [loadingPortfolioSummary, setLoadingPortfolioSummary] = useState<boolean>(true)
  const theme = useTheme()

  const { sortOptions, selectedCols } = preferences.portfoliosPage

  useEffect(() => {
    const updatePortfolios = async () => {
      loggerService.debug('Calling getPortfolios')
      setLoadingPortfolioSummary(true)
      try {
        const newPortfolios = await backendService.getPortfolios()
        setPortfolios(newPortfolios)
      } catch (ex) {
        setErrorMessage(ex.message)
        setLoadingPortfolioSummary(false)
      }
    };

    updatePortfolios();
    const checkForUpdateInterval = setInterval(() => updatePortfolios(), UPDATE_INTERVAL)
    return () => clearInterval(checkForUpdateInterval)
  }, [])

  useEffect(() => {
    if ((!selectedPortfolio && portfolios && portfolios.length > 0) || (selectedPortfolio && !portfolios.find(portfolio => portfolio.id === selectedPortfolio))) {
      const principalPortfolio = portfolios.find(portfolio => portfolio.isPrincipal)
      setSelectedPortfolio(principalPortfolio.id)
    }
  }, [portfolios, selectedPortfolio])

  useEffect(() => {
    const updatePortfolioSummary = async () => {
      loggerService.debug('Calling getPortfolioSummary')
      setLoadingPortfolioSummary(true)
      try {
        const newPortfolioSummary = await backendService.getPortfolioSummary(selectedPortfolio, selectedMonth ? selectedMonth.toDate() : undefined)
        setPortfolioSummary(newPortfolioSummary)
      } catch (ex) {
        setErrorMessage(ex.message)
      } finally {
        setLoadingPortfolioSummary(false)
      }
    }

    if (selectedPortfolio) {
      updatePortfolioSummary()
    }

    const checkForUpdateInterval = setInterval(() => updatePortfolioSummary(), UPDATE_INTERVAL)
    return () => clearInterval(checkForUpdateInterval)
  }, [selectedPortfolio, selectedMonth])

  const handleRefreshClick = async () => {
    loggerService.debug('Calling getPortfolioSummary')
    setLoadingPortfolioSummary(true)
    try {
      const newPortfolioSummary = await backendService.getPortfolioSummary(selectedPortfolio, selectedMonth ? selectedMonth.toDate() : undefined)
      setPortfolioSummary(newPortfolioSummary)
    } catch (ex) {
      setErrorMessage(ex.message)
    } finally {
      setLoadingPortfolioSummary(false)
    }
  }

  const handleSortChange = (colId: string) => preferencesActions.portfoliosPage.setSortOptions({ field: colId, order: sortOptions.order * -1 })
  const handleCheckColChange = (colId: string, checked: boolean) => preferencesActions.portfoliosPage.setSelectedCols({ ...selectedCols, [colId]: checked });

  const sortAdornment = (field: string) => (sortOptions.field === field ? (sortOptions.order > 0 ? '↑' : '↓') : '')
  const isColSelected = (colId: string) => Object.entries(selectedCols).filter(([selectedColId, selected]) => selectedColId === colId && selected === true).length > 0;
  const sortProducts = (leftProduct: PortfolioSummaryProduct, rightProduct: PortfolioSummaryProduct) => {
    const leftColMeta = availableCols.find(col => col.id === sortOptions.field)
    const rightColMeta = availableCols.find(col => col.id === sortOptions.field)
    return leftColMeta.getValueToSortBy(leftProduct[sortOptions.field]) > rightColMeta.getValueToSortBy(rightProduct[sortOptions.field]) ? sortOptions.order * -1 : sortOptions.order * 1
  }

  const sortedProducts = portfolioSummary && portfolioSummary.products.sort(sortProducts)

  const monthToShow = selectedMonth || (portfolioSummary && dayjs(portfolioSummary.monthReference))

  // TODO: Refactor
  return (
    <>
      <Box height="100%" display="flex" flexDirection="column" pt={1} pb={1}>
        <Box>
          <Grid container alignItems='center' textAlign='center'>
            <Grid item xs>
              <PortfolioSelect loading={selectedPortfolio == null} selectedPortfolio={selectedPortfolio} portfolios={portfolios} onChange={(newSelectedPortfolio) => setSelectedPortfolio(newSelectedPortfolio)} />
            </Grid>
            <Grid item xs>
              <MonthSelect
                loading={loadingPortfolioSummary}
                selectedMonth={monthToShow}
                smallestMonth={portfolioSummary && dayjs(portfolioSummary.firstApplicationDate)}
                largestMonth={dayjs()}
                onMonthChange={(newSelectedMonth) => setSelectedMonth(newSelectedMonth)}
              />
            </Grid>
            <Grid item xs={false}>
              <PopupState variant="popper" popupId="demo-popup-menu">
                {(popupState) => (
                  <>
                    <LoadingButton size="small" sx={{ minWidth: 32, marginLeft: 1, marginRight: 1 }} loading={loadingPortfolioSummary} variant='contained' {...bindTrigger(popupState)}>
                      <SettingsIcon />
                    </LoadingButton>
                    <Popper {...bindPopper(popupState)} placement='bottom-start' >
                      <Paper>
                        <ScrollableBox sx={{ maxHeight: 300 }}>
                          <ClickAwayListener onClickAway={popupState.close}>
                            <MenuList dense>
                              {(availableCols.map(availableCol => (<MenuItem key={availableCol.id} ><ListItemIcon><Checkbox edge="start" checked={isColSelected(availableCol.id)} onChange={(event) => handleCheckColChange(availableCol.id, event.target.checked)} tabIndex={-1} disableRipple /></ListItemIcon>{availableCol.title}</MenuItem>)))}
                            </MenuList>
                          </ClickAwayListener>
                        </ScrollableBox>
                      </Paper>
                    </Popper>
                  </>
                )}
              </PopupState>
            </Grid>
            <Grid item xs={false}>
              <LoadingButton size="small" sx={{ minWidth: 32, marginLeft: 1, marginRight: 1 }} loading={loadingPortfolioSummary} variant='contained' onClick={handleRefreshClick}>
                <RefreshIcon />
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
        <ScrollableBox flex={1} display="grid" gridAutoRows="min-content" flexDirection="column" mt={1}>
          <Grid container wrap="nowrap" alignItems='center' sx={{ position: 'sticky', top: 0, backgroundColor: theme.palette.background.paper }}>
            {availableCols.filter(availableCol => isColSelected(availableCol.id)).map(availableCol => {
              return (
                <Grid item key={availableCol.id} xs={availableCol.style.xs} minWidth={availableCol.style.minWidth} sx={availableCol.style.textAlign && { textAlign: availableCol.style.textAlign }}>
                  <Tooltip title={availableCol.title}>
                    <Link noWrap sx={{ paddingLeft: 1, paddingRight: 1 }} href="#" underline="hover" color="inherit" onClick={() => handleSortChange(availableCol.id)}><b>{availableCol.shortTitle}</b> {sortAdornment(availableCol.id)}</Link>
                  </Tooltip>
                </Grid>
              )
            })}
          </Grid>
          {sortedProducts ? sortedProducts
            .map((product, index) => (
              <React.Fragment key={product.productId}>
                <Grid container wrap="nowrap">
                  {availableCols.filter(availableCol => isColSelected(availableCol.id)).map(availableCol => {
                    let textContent = null

                    if (availableCol.displayRowValue) {
                      textContent = (<Typography noWrap sx={{ paddingLeft: 1, paddingRight: 1 }} minWidth={availableCol.style.minWidth} maxWidth={availableCol.style.maxWidth} color={availableCol.color && availableCol.color(product[availableCol.id])}>{availableCol.displayRowValue(product[availableCol.id])}</Typography>)
                    } else {
                      textContent =
                        (<Box display='block' sx={{ paddingLeft: 1, paddingRight: 1, height: '100%' }} minWidth={availableCol.style.minWidth} >
                          <Box display='block' sx={{ height: '100%', width: '100%', ...(availableCol.backgroundColor ? { backgroundColor: availableCol.backgroundColor(product[availableCol.id]) } : {}) }} />
                        </Box>)
                    }

                    let textWrapperContent = null

                    if (availableCol.displayTooltipValue) {
                      textWrapperContent = (
                        <Tooltip title={availableCol.displayTooltipValue(product[availableCol.id])} placement="right" disableInteractive>
                          {textContent}
                        </Tooltip>
                      )
                    } else {
                      textWrapperContent = (
                        <>
                          {textContent}
                        </>
                      )
                    }

                    return (
                      <Grid item key={availableCol.id} display="grid" xs={availableCol.style.xs} zeroMinWidth={availableCol.style.zeroMinWidth} minWidth={availableCol.style.minWidth} sx={availableCol.style.textAlign && { textAlign: availableCol.style.textAlign }}>
                        {textWrapperContent}
                      </Grid>
                    )
                  })}
                </Grid>
                {index + 1 < sortedProducts.length && <Divider />}
              </React.Fragment>
            )) : (<>
              {[...Array(3).keys()].map((key) =>
                <React.Fragment key={key}>
                  <Grid container wrap="nowrap">
                    {availableCols.filter(availableCol => isColSelected(availableCol.id)).map(availableCol => {
                      return (
                        <Grid item key={availableCol.id} display="grid" xs={availableCol.style.xs} zeroMinWidth={availableCol.style.zeroMinWidth} minWidth={availableCol.style.minWidth} sx={availableCol.style.textAlign && { textAlign: availableCol.style.textAlign }}>
                          <Typography sx={{ paddingLeft: 1, paddingRight: 1 }} ><Skeleton /></Typography>
                        </Grid>
                      )
                    })}
                  </Grid>
                  <Divider />
                </React.Fragment>
              )}
            </>)}
          {portfolioSummary && (
            <Grid container wrap="nowrap" sx={{ position: 'sticky', bottom: 0, backgroundColor: theme.palette.background.paper }}>
              <Divider />
              {availableCols.filter(availableCol => isColSelected(availableCol.id)).map(availableCol => {
                return (
                  <Grid item key={availableCol.id} xs={availableCol.style.xs} zeroMinWidth={availableCol.style.zeroMinWidth} minWidth={availableCol.style.minWidth} sx={availableCol.style.textAlign && { textAlign: availableCol.style.textAlign }}>
                    <Typography noWrap sx={{ paddingLeft: 1, paddingRight: 1 }} color={availableCol.color && availableCol.color(portfolioSummary[availableCol.id])}><b>{availableCol.displayRowValue && availableCol.displayRowValue(portfolioSummary[availableCol.id])}</b></Typography>
                  </Grid>
                )
              })}
            </Grid>)}
        </ScrollableBox>
        <Box mt={1}>
          <Grid container wrap="nowrap" >
            <Grid item xs={12} textAlign='center'>
              <Typography variant="caption" sx={{ display: 'inline' }}>Última mudança de valores em: {portfolioSummary ? dayjs(portfolioSummary.newValuesAt).format('lll') : <Skeleton width={50} variant='text' sx={{ display: 'inline-block' }} />}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={errorMessage != null}
        onClose={() => setErrorMessage(null)}
        autoHideDuration={dayjs.duration(8, 'seconds').asMilliseconds()}>
        <Alert onClose={() => setErrorMessage(null)} severity="error">{errorMessage}</Alert>
      </Snackbar>
    </>
  );
};
