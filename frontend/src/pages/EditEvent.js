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

const EditEvent = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/events`).then((res) => {
      const event = res.data.find((ev) => ev._id === id);
      if (event)
        setForm({
          name: event.name,
          description: event.description,
          date: event.date.slice(0, 10),
          location: event.location,
        });
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const token = localStorage.getItem("token");
    try {
      await axios.put(`/api/events/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Event updated successfully!");
      setTimeout(() => navigate("/events"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Event
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Event Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
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
            Update Event
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

export default EditEvent;
