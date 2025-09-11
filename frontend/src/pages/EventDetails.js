import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/events`)
      .then((res) => {
        const found = res.data.find((ev) => ev._id === id);
        setEvent(found);
      })
      .catch(() => setEvent(null));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("/api/users/register", { ...form, event: id });
      setMessage("Registration successful. QR code sent to your email.");
      setForm({ name: "", email: "", phone: "" });
      setTimeout(() => navigate("/qrcode"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  if (!event)
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5">Event not found</Typography>
        </Paper>
      </Container>
    );

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {event.name}
        </Typography>
        <Typography>{event.description}</Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </Typography>
        <Typography>
          <strong>Location:</strong> {event.location}
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Register for this event
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

export default EventDetails;
