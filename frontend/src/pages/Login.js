import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", form);
      login(res.data.token);
      setTimeout(() => navigate("/events"), 1000); // Smooth redirect
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            mb: 2,
            color: "primary.main",
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 48, marginBottom: 8 }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            Welcome to Navratri Event Registration
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
            Celebrate with us! Register for your favorite events.
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              placeholder="Enter your email"
              helperText="We'll never share your email."
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              placeholder="Enter your password"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </motion.div>
          </form>
          <Button
            component={Link}
            to="/signup"
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Don't have an account? Sign Up
          </Button>
          <Button
            component={Link}
            to="/admin/login"
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
          >
            Admin Login
          </Button>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;
