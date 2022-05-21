import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import pkg from '../../package.json'
import backendService from './service/backend.service';
import loggerService from './service/logger.service';

// TODO: Centralizar
const UPDATE_INTERVAL = dayjs.duration(5, 'minute').asMilliseconds()

interface AuthContextType {
  ready: boolean;
  email: string;
  signin: (email: string, password: string, store?: boolean, callback?: (errorMessage?: string) => void) => void;
  signout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = React.useState<string>(null);
  const [ready, setReady] = React.useState<boolean>(false);

  useEffect(() => {
    loggerService.info('Getting credential')

    async function updateCredential() {
      try {
        const kinvoCredential = await backendService.getCredential()
        if (kinvoCredential) {
          loggerService.info(`Credential received: ${kinvoCredential.email}`)
          setEmail(kinvoCredential.email)
        } else {
          loggerService.info('No credential received')
        }
        setReady(true)
      } catch (ex) {
        loggerService.error(ex)
      }
    }

    updateCredential()
    const checkForUpdateInterval = setInterval(() => updateCredential(), UPDATE_INTERVAL)
    return () => clearInterval(checkForUpdateInterval)
  }, [])

  const signin = async (newEmail: string, newPassword: string, store = false, callback?: (errorMessage?: string) => void) => {
    try {
      const success = await backendService.login({ email: newEmail, password: newPassword }, store)

      if (success) {
        setEmail(newEmail)
        if (callback) callback();
      }
    } catch (ex) {
      loggerService.error(ex)
      if (callback) callback(ex.message);
    }
  };

  const signout = async (callback?: VoidFunction) => {
    await backendService.logout();
    setEmail(null)
    if (callback) callback();
  };

  const value = { ready, email, signin, signout };

  return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  loggerService.info(`Is auth ready? ${auth.ready}`)
  if (auth.ready) {
    loggerService.info(`Logged e-mail: ${auth.email}`)
    if (!auth.email) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }
  return <Backdrop open><CircularProgress /></Backdrop>
}


export function AuthStatus() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleOpenLogClick = () => {
    backendService.openLog()
  }

  if (!auth.email) {
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    return <Box textAlign='center'><Typography variant='caption'>Não logado - Versão {pkg.version} - <a href='#' style={{ textDecoration: 'none' }} onClick={handleOpenLogClick}>📒</a></Typography></Box>;
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Box textAlign='center'><Typography variant='caption'>Logado como {auth.email}, <a href="#" onClick={() => { auth.signout(() => navigate("/")); }}>sair.</a> - Versão {pkg.version} - <a href='#' style={{ textDecoration: 'none' }} onClick={handleOpenLogClick}>📒</a></Typography></Box>
  );
}
