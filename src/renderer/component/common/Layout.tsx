import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AuthStatus } from "renderer/context/useAuthContext";

export default function Layout() {
  return (
    <Box height="100vh" display="flex" flexDirection="column" padding={1}>
      <Box flex={1} overflow="auto">
        <Outlet />
      </Box>
      <Box height={30}>
        <AuthStatus />
      </Box>
    </Box>
  );
}
