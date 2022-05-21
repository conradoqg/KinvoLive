import { Box, Checkbox, FormControlLabel, Paper, Snackbar, TextField, Typography } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth } from "./auth.provider";
import icon from '../../assets/icon.png';
import Alert from "./components/Alert";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string>(null)
  const [errorFields, setErrorFields] = useState<{ [key: string]: string }>({ email: ' ', password: ' ' })
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const state: any = location.state as any
  const from = state.from?.pathname || "/";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email') as string
    const password = data.get('password') as string
    const remember = data.get('remember') === 'remember'

    if (email && password) {
      setLoading(true)
      setErrorFields({
        email: ' ',
        password: ' '
      })
      auth.signin(email, password, remember, (newErrorMessage: string) => {
        setLoading(false)
        if (newErrorMessage) {
          setErrorMessage(newErrorMessage)
        } else {
          navigate(from, { replace: true });
        }
      });
    } else {
      setErrorFields({
        email: email ? ' ' : 'O email é obrigatório',
        password: password ? ' ' : 'A senha é obrigatória'
      })
    }
  };

  return (
    <Paper elevation={0} sx={{ padding: 1 }}>
      <Box sx={{ marginTop: 4, marginLeft: 4, marginRight: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={icon} alt='Kinvo' />
        <Typography component="h1" variant="h5" mt={4}>
          Autenticação Kinvo
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de e-mail"
            name="email"
            autoComplete="email"
            error={errorFields.email.trim().length > 0}
            helperText={errorFields.email}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errorFields.password.trim().length > 0}
            helperText={errorFields.password}
          />
          <FormControlLabel
            control={<Checkbox name="remember" value="remember" defaultChecked color="primary" />}
            label="Lembrar"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </LoadingButton>
        </Box>
      </Box>
      <Snackbar
        open={errorMessage != null}
        onClose={() => setErrorMessage(null)}
        autoHideDuration={dayjs.duration(8, 'seconds').asMilliseconds()}>
        <Alert onClose={() => setErrorMessage(null)} severity="error">{errorMessage}</Alert>
      </Snackbar>
    </Paper >
  )
}
