import { Backdrop, CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react'
import generateContext from 'react-generate-context'
import { PreferenceData, SelectedCols, SortOptions } from 'shared/type/preference.type';
import backendService from '../service/backend.service';
import loggerService from '../service/logger.service';

type PreferenceProps = { children: JSX.Element }

type PreferencesContext = [
  PreferenceData['appRender'],
  {
    portfoliosPage: {
      setSelectedCols: (selectedCols: SelectedCols) => void
      setSortOptions: (sortOptions: SortOptions) => void
    }
  }
]

function usePreferences(): PreferencesContext {
  const [state, setState] = useState<PreferenceData['appRender']>({
    portfoliosPage: {
      sortOptions: { field: 'inTheMonthAbsoluteProfitability', order: 1 },
      selectedCols: { productTypeId: true, productName: true, inTheMonthAbsoluteProfitability: true, portfolioPercentage: true, inTheMonthRelativeProfitability: true, inTwelveMonthsAverageProfitability: true }
    }
  })
  const actions = useMemo(
    () => ({
      portfoliosPage: {
        setSelectedCols: (selectedCols: SelectedCols) => {
          setState(s => {
            const newState = { ...s, portfoliosPage: { ...s.portfoliosPage, selectedCols } }
            backendService.setPreference('appRender', newState)
            return newState
          })
        },
        setSortOptions: (sortOptions: SortOptions) => {
          setState(s => {
            const newState = { ...s, portfoliosPage: { ...s.portfoliosPage, sortOptions } }
            backendService.setPreference('appRender', newState)
            return newState
          })
        },
      }
    }),
    []
  )

  useEffect(() => {
    (async () => {
      loggerService.debug('Getting preferences')
      const preferences = await backendService.getPreference('appRender')
      if (preferences) setState(preferences)
    })()
  }, [])

  return [state, actions]
}

export const [PreferenceProvider, usePreferenceContext] = generateContext<PreferencesContext, PreferenceProps>(usePreferences, null)

export function RequirePreference({ children }: { children: JSX.Element }) {
  const [preferences] = usePreferenceContext();

  loggerService.debug(`Is preference ready? ${preferences != null}`)

  if (preferences) return children;

  return <Backdrop open > <CircularProgress /></Backdrop >
}
