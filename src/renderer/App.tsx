import { createTheme, CssBaseline, StyledEngineProvider } from '@mui/material';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import './App.css';
import PortfoliosPage from './PortfoliosPage';
import LoginPage from './LoginPage';
import AuthProvider, { RequireAuth } from './auth.provider';
import Layout from './components/Layout';

const themeLight = createTheme({
  palette: {
    background: {
      default: "rgb(238 242 244)"
    }
  },
  typography: {
    fontSize: 12,
  },
});

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeLight}>
        <CssBaseline />
        <AuthProvider>
          <MemoryRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<RequireAuth><PortfoliosPage /></RequireAuth>} />
                <Route path="/login" element={<LoginPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider >
    </StyledEngineProvider>
  );
}
