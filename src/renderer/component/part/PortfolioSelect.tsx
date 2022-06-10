import { FormControl, InputLabel, MenuItem, Select, Skeleton } from "@mui/material"

type PortfolioSelectProps = { loading: boolean, selectedPortfolio: number, portfolios: { id: number, title: string }[], onChange: (newSelectedPortfolio: number) => void }

const PortfolioSelect = ({ loading, selectedPortfolio, portfolios, onChange }: PortfolioSelectProps) => {
  return (<FormControl sx={{ minWidth: 150 }} size="small">
    <InputLabel id="portfolioName">Carteira</InputLabel>
    <Select
      labelId="portfolioName"
      id="portfolioNameId"
      value={loading || selectedPortfolio == null ? '' : selectedPortfolio.toString()}
      label="Carteira"
      onChange={(event) => onChange(parseInt(event.target.value, 10))}
    >
      {(!loading && portfolios) ? portfolios.map((portifolio) => <MenuItem key={portifolio.id} value={portifolio.id}>{portifolio.title}</MenuItem>) : <Skeleton />}
    </Select>
  </FormControl>)
}

export default PortfolioSelect
