import React, { useState } from "react";
import axios from "axios";
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
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", form);
      setMessage(res.data.message);
      setTimeout(() => navigate("/events"), 1500); // Smooth redirect
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              placeholder="Enter your full name"
            />
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
              placeholder="Create a password"
              helperText="At least 6 characters."
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              placeholder="Enter your phone number"
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
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </motion.div>
          </form>
          <Button
            component={Link}
            to="/"
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Already have an account? Login
          </Button>
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert severity="success" sx={{ mt: 2 }}>
                {message}
              </Alert>
            </motion.div>
          )}
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

export default Signup;
