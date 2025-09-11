import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post("/api/users/register", form);
      setMessage(res.data.message);
      setForm({ name: "", email: "", phone: "", event: "" });
      setTimeout(() => {
        navigate("/thank-you");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm">
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
          User Registration
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
          />
          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Event"
            name="event"
            value={form.event}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Select Event</MenuItem>
            {events.map((ev) => (
              <MenuItem key={ev._id} value={ev._id}>
                {ev.name} ({new Date(ev.date).toLocaleDateString()})
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default Registration;
