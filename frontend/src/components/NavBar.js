import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { motion } from "framer-motion";

const NavBar = ({ mode, setMode }) => {
  const { isUser, isAdmin, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const navItems = isAdmin
    ? [
        { text: "Admin Dashboard", to: "/admin" },
        { text: "Events", to: "/events" },
        { text: "Create Event", to: "/admin/create-event" },
        { text: "User Check-In", to: "/checkin" },
        { text: "Logout", action: logout },
      ]
    : isUser
    ? [
        { text: "Events", to: "/events" },
        { text: "My Bookings", to: "/bookings" },
        { text: "Logout", action: logout },
      ]
    : [];

  return (
    <AppBar position="static" elevation={3} sx={{ borderRadius: 0 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <motion.img
            src="/logo.png"
            alt="Logo"
            style={{ height: 40, marginRight: 12 }}
            whileHover={{ scale: 1.1 }}
          />
          <motion.span
            style={{
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 2,
            }}
            whileHover={{ scale: 1.05 }}
          >
            Navratri Event
          </motion.span>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {navItems.map((item) => (
            <motion.div key={item.text} whileHover={{ scale: 1.05 }}>
              {item.to ? (
                <Button color="inherit" component={Link} to={item.to}>
                  {item.text}
                </Button>
              ) : (
                <Button color="inherit" onClick={item.action}>
                  {item.text}
                </Button>
              )}
            </motion.div>
          ))}
          <IconButton
            sx={{ ml: 2 }}
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            color="inherit"
            aria-label="toggle theme"
          >
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>
        <IconButton
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={toggleDrawer}
          color="inherit"
          aria-label="open menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={item.to ? Link : "button"}
                  to={item.to}
                  onClick={item.action || toggleDrawer}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMode(mode === "light" ? "dark" : "light");
                  toggleDrawer();
                }}
              >
                <ListItemText primary="Toggle Theme" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default NavBar;
