import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AuthStatus } from "renderer/auth.provider";

export default function Layout() {
  return (
    <Container maxWidth={false} sx={{ marginTop: 3, marginBottom: 3 }}>
      <Outlet />
      <AuthStatus />
    </Container>
  );
}
