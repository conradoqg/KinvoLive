import { LoadingButton } from "@mui/lab";
import { ButtonGroup, Skeleton, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import { capitalizeFirstLetter } from "shared/helpers/string";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

type MonthSelectProps = { loading: boolean, selectedMonth: Dayjs | null, largestMonth: Dayjs | null, smallestMonth: Dayjs | null, onMonthChange: (newSelectedMonth: Dayjs) => void }

const MonthSelect = ({ loading, selectedMonth, largestMonth, smallestMonth, onMonthChange }: MonthSelectProps) => {
  const handleMonthChange = async (direction: number) => {
    return onMonthChange(selectedMonth.add(direction, 'month'))
  }

  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <LoadingButton onClick={() => handleMonthChange(-1)} size="small" loading={loading} variant="contained" disabled={smallestMonth ? smallestMonth.isSameOrAfter(selectedMonth, 'month') : true}><KeyboardArrowLeftIcon /></LoadingButton>
      <Typography alignSelf='center' sx={{ marginLeft: 3, marginRight: 3 }} >{!selectedMonth ? <Skeleton width={50} /> : (selectedMonth && capitalizeFirstLetter(selectedMonth.format('MMM - YY')))}</Typography>
      <LoadingButton onClick={() => handleMonthChange(1)} size="small" loading={loading} variant="contained" disabled={selectedMonth ? largestMonth.isSameOrBefore(selectedMonth, 'month') : true}> <KeyboardArrowRightIcon /></LoadingButton>
    </ButtonGroup>);
}

export default MonthSelect;
