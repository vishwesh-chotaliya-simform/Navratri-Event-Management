import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Registration from "./pages/Registration";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NavBar from "./components/NavBar";
import CreateEvent from "./pages/CreateEvent";
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import CheckIn from "./pages/CheckIn";
import ResendTicket from "./pages/ResendTicket";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { IconButton, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "@fontsource/montserrat";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [mode, setMode] = useState("light");

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#d72660",
        contrastText: "#fff",
      },
      secondary: {
        main: "#fbb13c",
        contrastText: "#fff",
      },
      background: {
        default: mode === "light" ? "#fff8f0" : "#1a1a2e",
        paper: mode === "light" ? "#fff" : "#22223b",
      },
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: "Montserrat, Roboto, Arial, sans-serif",
      h4: {
        fontWeight: 800,
        letterSpacing: "0.05em",
      },
      h6: {
        fontWeight: 700,
        letterSpacing: "0.03em",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "linear-gradient(90deg, #d72660 60%, #fbb13c 100%)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow:
              "0 8px 32px 0 rgba(215,38,96,0.12), 0 2px 8px 0 rgba(251,177,60,0.08)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 14,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <NavBar />
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                color="inherit"
                aria-label="toggle theme"
              >
                {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Routes>
                {/* Public user routes */}
                <Route path="/" element={<Registration />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route
                  path="/checkin"
                  element={
                    <ProtectedRoute>
                      <CheckIn />
                    </ProtectedRoute>
                  }
                />

                {/* Admin login route (public) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin-only routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/create-event"
                  element={
                    <ProtectedRoute>
                      <CreateEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/edit-event/:id"
                  element={
                    <ProtectedRoute>
                      <EditEvent />
                    </ProtectedRoute>
                  }
                />
                <Route path="/resend-ticket" element={<ResendTicket />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
