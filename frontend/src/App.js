import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NavBar from "./components/NavBar";
import CreateEvent from "./pages/CreateEvent";
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import CheckIn from "./pages/CheckIn";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";

function UserOrAdminProtectedRoute({ children }) {
  const { isUser, isAdmin } = React.useContext(AuthContext);
  return isUser || isAdmin ? children : <Navigate to="/" replace />;
}

function App() {
  const [mode, setMode] = useState("light");

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#5c6bc0", // Soft indigo for a calming, modern primary
        contrastText: "#fff",
      },
      secondary: {
        main: "#ff9800", // Warm amber for vibrant accents
        contrastText: "#fff",
      },
      background: {
        default: mode === "light" ? "#fafafa" : "#121212", // Soft off-white or dark
        paper: mode === "light" ? "#fff" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#212121" : "#fff",
        secondary: mode === "light" ? "#757575" : "#bdbdbd",
      },
      error: {
        main: "#f44336", // Accessible red
      },
      success: {
        main: "#4caf50", // Accessible green
      },
    },
    shape: {
      borderRadius: 16, // Softer, modern rounded corners
    },
    typography: {
      fontFamily: ["Montserrat", "Roboto", "Arial", "sans-serif"].join(","),
      h4: {
        fontWeight: 700,
        letterSpacing: "0.01em",
        color: mode === "light" ? "#5c6bc0" : "#fff",
        fontSize: "2rem",
      },
      h6: {
        fontWeight: 600,
        letterSpacing: "0.005em",
        color: mode === "light" ? "#5c6bc0" : "#fff",
        fontSize: "1.25rem",
      },
      body1: {
        fontSize: 16,
        lineHeight: 1.6,
        color: mode === "light" ? "#212121" : "#fff",
      },
      body2: {
        fontSize: 14,
        lineHeight: 1.5,
        color: mode === "light" ? "#757575" : "#bdbdbd",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background:
              mode === "light"
                ? "linear-gradient(135deg, #5c6bc0 0%, #ff9800 100%)"
                : "linear-gradient(135deg, #121212 0%, #ff9800 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "0 8px 32px rgba(0,0,0,0.1)"
                : "0 8px 32px rgba(0,0,0,0.3)",
            borderRadius: 16,
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow:
                mode === "light"
                  ? "0 12px 40px rgba(0,0,0,0.15)"
                  : "0 12px 40px rgba(0,0,0,0.4)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: "10px 24px",
            fontSize: 16,
            fontWeight: 600,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            },
            "&:focus": {
              outline: "2px solid #5c6bc0",
              outlineOffset: 2,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              transition: "border-color 0.3s ease",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#5c6bc0",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#5c6bc0",
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: 15,
            color: mode === "light" ? "#212121" : "#fff",
            borderBottom: `1px solid ${
              mode === "light" ? "#e0e0e0" : "#424242"
            }`,
            padding: "16px 12px",
            transition: "background-color 0.3s ease",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            background: mode === "light" ? "#fff" : "#1e1e1e",
            border: `1px solid ${mode === "light" ? "#e0e0e0" : "#424242"}`,
            transition: "all 0.3s ease",
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: "16px !important",
            paddingRight: "16px !important",
            "@media (min-width:600px)": {
              paddingLeft: "24px !important",
              paddingRight: "24px !important",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: mode === "light" ? "#f5f5f5" : "#333",
              transform: "scale(1.1)",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent mode={mode} setMode={setMode} />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent({ mode, setMode }) {
  const { isUser } = React.useContext(AuthContext);

  return (
    <Router>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          transition: "background-color 0.3s ease",
        }}
      >
        <NavBar mode={mode} setMode={setMode} />
        <Box sx={{ flex: 1, py: 4 }}>
          <Routes>
            <Route
              path="/"
              element={isUser ? <Navigate to="/events" replace /> : <Login />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/events"
              element={
                <UserOrAdminProtectedRoute>
                  <EventList />
                </UserOrAdminProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <UserOrAdminProtectedRoute>
                  <EventDetails />
                </UserOrAdminProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <UserOrAdminProtectedRoute>
                  <MyBookings />
                </UserOrAdminProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
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
            <Route
              path="/checkin"
              element={
                <ProtectedRoute>
                  <CheckIn />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
