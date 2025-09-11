import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

const NavBar = () => {
  const { isAdmin, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 40, marginRight: 12 }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 2,
            }}
          >
            Navratri Event
          </span>
        </Box>
        {isAdmin ? (
          <>
            <Button color="inherit" component={Link} to="/admin">
              Admin Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/events">
              Events
            </Button>
            <Button color="inherit" component={Link} to="/admin/create-event">
              Create Event
            </Button>
            <Button color="inherit" component={Link} to="/checkin">
              User Check-In
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/">
              Register
            </Button>
            <Button color="inherit" component={Link} to="/events">
              Events
            </Button>
            <Button color="inherit" component={Link} to="/admin/login">
              Admin Login
            </Button>
            <Button color="inherit" component={Link} to="/resend-ticket">
              Resend Ticket
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
