import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  Box,
  Avatar,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { authProvider } from "./authProvider";

export const Dashboard = () => {
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  useEffect(() => {
    authProvider
      .checkAuth({} as any)
      .then(() => setAuthStatus("Authenticated"))
      .catch(() => setAuthStatus("Not Authenticated"));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          background: `linear-gradient(135deg, ${blue[500]} 30%, ${blue[300]} 90%)`,
          color: "white",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: "white",
                color: blue[500],
              }}
            >
              A
            </Avatar>
          }
          title="Welcome to the Administration"
          titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        />
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome to the administration panel. Here, you can manage content, monitor activities, and
            customize settings to ensure the system runs efficiently.
          </Typography>
        </CardContent>
        <CardContent>
          {authStatus === null ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
              <Typography variant="body2">Checking authentication...</Typography>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {authStatus}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
