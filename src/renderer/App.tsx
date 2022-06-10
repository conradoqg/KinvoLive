import { createTheme, CssBaseline, StyledEngineProvider } from '@mui/material';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
// TODO: Could it be removed?
import './App.css';
import PortfoliosPage from './PortfoliosPage';
import LoginPage from './LoginPage';
import AuthProvider, { RequireAuth } from './context/useAuthContext';
import Layout from './component/common/Layout';
import { PreferenceProvider, RequirePreference } from './context/usePreferenceContext';
import ProviderComposer, { provider } from './context/ProviderComposer';

const themeLight = createTheme({
  typography: {
    fontSize: 12,
  },
});

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeLight}>
        <CssBaseline />
        <ProviderComposer providers={[
          provider(AuthProvider),
          provider(PreferenceProvider)
        ]}>
          <MemoryRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<RequirePreference><RequireAuth><PortfoliosPage /></RequireAuth></RequirePreference>} />
                <Route path="/login" element={<LoginPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ProviderComposer>
      </ThemeProvider >
    </StyledEngineProvider>
  );
}
