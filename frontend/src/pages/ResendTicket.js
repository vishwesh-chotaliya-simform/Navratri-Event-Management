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
} from "@mui/material";

const ResendTicket = () => {
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/users/send-qrcode", {
        email,
        eventId,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to resend ticket. Please check details."
      );
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Resend Your Event Ticket by Email
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Event"
            name="event"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
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
          <TextField
            label="Your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Ticket"}
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

export default ResendTicket;
