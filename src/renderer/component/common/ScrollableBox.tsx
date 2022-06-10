import { Box, BoxProps, Theme } from '@mui/material';
import styled from '@emotion/styled';

const StyledBox = styled(Box)<BoxProps>(({ theme }: { theme: Theme }) => ({
  transition: 'scrollbar-color 0.3s ease-out',
  scrollbarWidth: 'thin',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '12px',
    height: '12px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.default,
    borderRadius: '25px'
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '25px',
    border: '3px solid transparent',
    backgroundClip: 'content-box',
    backgroundColor: theme.palette.primary.main
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}))

export default function ScrollableBox(props: BoxProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (<StyledBox  {...props} />)
}
