/* eslint-disable jsx-a11y/anchor-is-valid */
import { Divider, FormControl, Grid, InputLabel, Link, MenuItem, Paper, Select, Skeleton, Snackbar, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { Portfolios, PortfolioSummary } from 'shared/type/backend.types';
import React, { useEffect, useState } from 'react';
import { blue, green, red } from '@mui/material/colors';
import dayjs from 'dayjs';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import { norm } from '../shared/helpers/math';
import formatters from '../shared/helpers/formatters'
import { colorByRange, colorGradient, hexToRgb, rgbToString } from '../shared/helpers/color';
import loggerService from './service/logger.service';
import Alert from './components/Alert';
import backendService from './service/backend.service';

type SortOptions = {
  field: string
  order: number
}

// TODO: Centralizar
const UPDATE_INTERVAL = dayjs.duration(30, 'minute').asMilliseconds()

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<Portfolios>(null)
  const [selectedPortfolio, setSelectedPortfolio] = useState<number>(null)
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>(null)
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'relativeProfitabilityThisMonth', order: 1 })
  const [errorMessage, setErrorMessage] = useState<string>(null)
  const [valueType, setValueType] = useState<string>('proportional')
  const [loadingPortfolioSummary, setLoadingPortfolioSummary] = useState<boolean>(true)

  useEffect(() => {
    const updatePortfolios = async () => {
      loggerService.debug('Calling getPortfolios')
      setLoadingPortfolioSummary(true)
      try {
        const newPortfolios = await backendService.getPortfolios()
        setPortfolios(newPortfolios)
      } catch (ex) {
        setErrorMessage(ex.message)
      }
    };

    updatePortfolios();
    const checkForUpdateInterval = setInterval(() => updatePortfolios(), UPDATE_INTERVAL)
    return () => clearInterval(checkForUpdateInterval)
  }, [])

  useEffect(() => {
    if ((!selectedPortfolio && portfolios && portfolios.length > 0) || (selectedPortfolio && !portfolios.find(portfolio => portfolio.id === selectedPortfolio))) {
      const principal = portfolios.find(portfolio => portfolio.isPrincipal)
      setSelectedPortfolio(principal.id)
    }
  }, [portfolios, selectedPortfolio])

  useEffect(() => {
    const updatePortfolioSummary = async () => {
      loggerService.debug('Calling getPortfolioSummary')
      setLoadingPortfolioSummary(true)
      try {
        const newPortfolioSummary = await backendService.getPortfolioSummary(selectedPortfolio)
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
  }, [selectedPortfolio])

  const sortedProducts = portfolioSummary && portfolioSummary.products.
    sort((leftProduct, rightProduct) => leftProduct[sortOptions.field] > rightProduct[sortOptions.field] ? sortOptions.order * -1 : sortOptions.order * 1)

  const sortAdornment = (field: string) => {
    if (sortOptions.field === field) return (sortOptions.order > 0 ? '↑' : '↓')
    return ''
  }

  const changeSort = (field: string) => setSortOptions({ field, order: sortOptions.order * -1 })

  // TODO: Refatorar
  const colorByValue = (referenceField: string, value: number) => {
    const roundedValue = Math.round((value + Number.EPSILON) * 100) / 100
    let normalizedValue = null
    let gradient = null

    let smallestField = null
    let largestField = null

    if (referenceField === 'M') {
      smallestField = portfolioSummary.portfolio.smallestThisMonthProfitability
      largestField = portfolioSummary.portfolio.largestThisMonthProfitability
    } else if (referenceField === '12M') {
      smallestField = portfolioSummary.portfolio.smallestLast12Profitability
      largestField = portfolioSummary.portfolio.largestLast12Profitability
    } else if (referenceField === 'MR') {
      smallestField = portfolioSummary.portfolio.smallestRelativeProfitabilityThisMonth
      largestField = portfolioSummary.portfolio.largestRelativeProfitabilityThisMonth
    } else if (referenceField === '12MR') {
      smallestField = portfolioSummary.portfolio.smallestRelativeProfitabilityLast12Months
      largestField = portfolioSummary.portfolio.largestRelativeProfitabilityLast12Months
    }

    if (roundedValue < 0) {
      normalizedValue = norm(roundedValue, 0, smallestField)
      gradient = colorGradient(normalizedValue, hexToRgb(red[300]), hexToRgb(red[900]))
    } else if (roundedValue > 0) {
      normalizedValue = norm(roundedValue, largestField, 0)
      gradient = colorGradient(normalizedValue, hexToRgb(green[900]), hexToRgb(green[300]))
    } else {
      gradient = hexToRgb(blue[500])
    }
    return rgbToString(gradient)
  }

  const handleValueTypeChange = (event: React.MouseEvent<HTMLElement>, newValueType: string) => {
    setValueType(newValueType);
  };

  const handleRefreshClick = async () => {
    loggerService.debug('Calling getPortfolioSummary')
    setLoadingPortfolioSummary(true)
    try {
      const newPortfolioSummary = await backendService.getPortfolioSummary(selectedPortfolio)
      setPortfolioSummary(newPortfolioSummary)
    } catch (ex) {
      setErrorMessage(ex.message)
    } finally {
      setLoadingPortfolioSummary(false)
    }
  }

  // TODO: Refatorar
  return (
    <>
      <Paper elevation={0} sx={{ padding: 1 }}>
        <Grid container alignItems='center'>
          <Grid item xs textAlign='center'>
            <b>Mês (%):</b> {portfolioSummary ? (<Typography sx={{ display: 'inline', color: colorByValue('M', portfolioSummary.portfolio.profitabilityThisMonth) }}>{formatters.percentage(portfolioSummary.portfolio.profitabilityThisMonth / 100)}</Typography>) : (<Typography sx={{ display: 'inline' }}><Skeleton variant="text" width={30} sx={{ display: 'inline-block' }} /></Typography>)}
          </Grid>
          <Grid item xs textAlign='center'>
            <b>12M (%):</b> {portfolioSummary ? (<Typography sx={{ display: 'inline', color: colorByValue('M', portfolioSummary.portfolio.profitabilityLast12Months) }}>{formatters.percentage(portfolioSummary.portfolio.profitabilityLast12Months / 100)}</Typography>) : (<Typography sx={{ display: 'inline' }}><Skeleton variant="text" width={30} sx={{ display: 'inline-block' }} /></Typography>)}
          </Grid>
          <Grid item xs="auto">
            <ToggleButtonGroup
              sx={{ m: 1 }}
              value={valueType}
              size='small'
              exclusive
              onChange={handleValueTypeChange}
            >
              <ToggleButton value="proportional"><Tooltip title="Proporcional"><Typography>∝</Typography></Tooltip></ToggleButton>
              <ToggleButton value="absolute"><Tooltip title="Porcentagem"><Typography>%</Typography></Tooltip></ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs>
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
              <InputLabel id="demo-select-small">Carteira</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-simple-select"
                value={selectedPortfolio !== null ? selectedPortfolio.toString() : ''}
                label="Carteira"
                onChange={(event) => setSelectedPortfolio(parseInt(event.target.value, 10))}
              >
                {portfolios ? portfolios.map((portifolio) => <MenuItem key={portifolio.id} value={portifolio.id}>{portifolio.title}</MenuItem>) : <Skeleton />}
              </Select>
            </FormControl>
          </Grid>
          <Grid item >
            <LoadingButton size='small' loading={loadingPortfolioSummary} variant='contained' onClick={handleRefreshClick}>
              <RefreshIcon />
            </LoadingButton>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" >
          <Grid item xs={false} textAlign='center' sx={{ minWidth: 20 }}><Tooltip title="Categoria"><Link href="#" underline="hover" noWrap color="inherit" onClick={() => changeSort('productTypeId')}><b>C</b> {sortAdornment('productTypeId')}</Link></Tooltip></Grid>
          <Grid item xs zeroMinWidth><Tooltip title="Nome do investimento"><Link href="#" underline="hover" paddingLeft={1} noWrap color="inherit" onClick={() => changeSort('productName')}><b>Nome</b> {sortAdornment('productName')}</Link></Tooltip></Grid>
          {valueType === 'proportional' && (<>
            <Grid item xs={1} minWidth={60} textAlign='center'><Tooltip title="Variação proporcional a representividade no mês"><Link href="#" underline="hover" noWrap color="inherit" onClick={() => changeSort('relativeProfitabilityThisMonth')}><b>M (∝)</b> {sortAdornment('relativeProfitabilityThisMonth')}</Link></Tooltip></Grid>
            <Grid item xs={1} minWidth={60} textAlign='center'><Tooltip title="Variação proporcional a representividade nos últimos 12 meses"><Link href="#" underline="hover" noWrap color="inherit" onClick={() => changeSort('relativeProfitabilityLast12Months')}><b>12M (∝)</b> {sortAdornment('relativeProfitabilityLast12Months')}</Link></Tooltip></Grid>
          </>)}
          {valueType === 'absolute' && (<>
            <Grid item xs={1} minWidth={60} textAlign='center'><Tooltip title="Variação no mês"><Link href="#" underline="hover" noWrap color="inherit" onClick={() => changeSort('profitabilityThisMonth')}><b>M (%)</b> {sortAdornment('profitabilityThisMonth')}</Link></Tooltip></Grid>
            <Grid item xs={1} minWidth={60} textAlign='center'><Tooltip title="Variação nos último 12 meses"><Link href="#" underline="hover" noWrap color="inherit" onClick={() => changeSort('profitabilityLast12Months')}><b>12M (%)</b> {sortAdornment('profitabilityLast12Months')}</Link></Tooltip></Grid>
          </>)}
          <Grid item xs={1} minWidth={60} textAlign='center'><Tooltip title="Representatividade no portifólio"><Link href="#" underline="hover" noWrap color="inherit" onClick={() => changeSort('portfolioPercentage')}><b>R (%)</b> {sortAdornment('portfolioPercentage')}</Link></Tooltip></Grid>
        </Grid>
        <Divider />
        {sortedProducts ? sortedProducts
          .map(product => (
            <React.Fragment key={product.productId}>
              <Grid container wrap="nowrap">
                <Grid item xs={false} sx={{ backgroundColor: formatters.categoryFormatter[product.productTypeId].color, minWidth: 20 }}><Tooltip title={formatters.categoryFormatter[product.productTypeId].displayText} placement="right"><Typography>&nbsp;</Typography></Tooltip></Grid>
                <Grid item xs zeroMinWidth><Tooltip title={product.productName}><Typography noWrap paddingLeft={1}>{product.productName}</Typography></Tooltip></Grid>
                {valueType === 'proportional' && (<>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline', color: colorByValue('MR', product.relativeProfitabilityThisMonth) }}>{formatters.percentage(product.relativeProfitabilityThisMonth / 100)}</Typography></Grid>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline', color: colorByValue('12MR', product.relativeProfitabilityLast12Months) }}>{formatters.percentage(product.relativeProfitabilityLast12Months / 100)}</Typography></Grid>
                </>)}
                {valueType === 'absolute' && (<>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline', color: colorByValue('M', product.profitabilityThisMonth) }}>{formatters.percentage(product.profitabilityThisMonth / 100)}</Typography></Grid>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline', color: colorByValue('12M', product.profitabilityLast12Months) }}>{formatters.percentage(product.profitabilityLast12Months / 100)}</Typography></Grid>
                </>)}
                <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline', color: colorByRange(product.portfolioPercentage, portfolioSummary.portfolio.smallestPortfolioPercentage, portfolioSummary.portfolio.largestPortfolioPercentage, hexToRgb(blue[300]), hexToRgb(blue[900])) }}>{formatters.percentage(product.portfolioPercentage / 100)}</Typography></Grid>
              </Grid>
              <Divider />
            </React.Fragment>
          )) : (<>
            {[...Array(3).keys()].map((key) =>
              <React.Fragment key={key}>
                <Grid container wrap="nowrap">
                  <Grid item xs={false} sx={{ minWidth: 20 }}><Typography><Skeleton /></Typography></Grid>
                  <Grid item xs zeroMinWidth><Typography noWrap paddingLeft={1}><Skeleton /></Typography></Grid>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline' }}><Skeleton /></Typography></Grid>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline' }}><Skeleton /></Typography></Grid>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline' }}><Skeleton /></Typography></Grid>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline' }}><Skeleton /></Typography></Grid>
                  <Grid item xs={1} minWidth={60} textAlign='center'><Typography sx={{ display: 'inline' }}><Skeleton /></Typography></Grid>
                </Grid>
                <Divider />
              </React.Fragment>
            )}
          </>)}
        {portfolioSummary && (<Grid container wrap="nowrap" >
          <Grid item xs={12} textAlign='center'>
            <Typography variant="caption">Última mudança de valores em: {dayjs(portfolioSummary.portfolio.newValuesAt).format('lll')}</Typography>
          </Grid>
        </Grid>)}
      </Paper>
      <Snackbar
        open={errorMessage != null}
        onClose={() => setErrorMessage(null)}
        autoHideDuration={dayjs.duration(8, 'seconds').asMilliseconds()}>
        <Alert onClose={() => setErrorMessage(null)} severity="error">{errorMessage}</Alert>
      </Snackbar>
    </>
  );
};
