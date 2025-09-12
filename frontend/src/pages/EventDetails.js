import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion } from "framer-motion";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); // Loading for event fetch
  const [formLoading, setFormLoading] = useState(false); // Loading for form submission
  const [form, setForm] = useState({ name: "", phone: "", numTickets: 1 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isUser, isAdmin } = useContext(AuthContext); // Include isAdmin

  useEffect(() => {
    axios
      .get(`/api/events`)
      .then((res) => {
        const found = res.data.find((ev) => ev._id === id);
        setEvent(found);
        setLoading(false); // Set loading to false after fetching
      })
      .catch(() => {
        setEvent(null);
        setLoading(false);
      });
  }, [id]);

  const getEmailFromJWT = () => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      try {
        const payload = JSON.parse(atob(userToken.split(".")[1]));
        return payload.email || "";
      } catch (e) {
        return "";
      }
    }
    return "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFormLoading(true); // Start loading
    try {
      const token = localStorage.getItem("userToken");
      const email = getEmailFromJWT();
      await axios.post(
        "/api/users/register",
        { ...form, email, event: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Registration successful. QR code sent to your email.");
      setForm({ name: "", phone: "", numTickets: 1 });
      setTimeout(() => navigate("/bookings"), 2000); // Redirect to bookings after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setFormLoading(false); // Stop loading on error
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading event details...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5">Event not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card elevation={4} sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: 200,
                    bgcolor: "primary.main",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EventIcon sx={{ fontSize: 80, color: "white" }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event.description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">{event.location}</Typography>
                </Box>
                <Typography variant="body2">
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            {isAdmin ? "Event Management" : "Register for this Event"}
          </Typography>
          {!isUser && !isAdmin ? ( // Show alert only if neither user nor admin is logged in
            <Alert severity="info" sx={{ mt: 2 }}>
              Please login to register for this event.
            </Alert>
          ) : isUser ? ( // Show form only for users
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    placeholder="Enter your name"
                    disabled={formLoading} // Disable during loading
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    placeholder="Enter your phone number"
                    disabled={formLoading} // Disable during loading
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Number of Tickets"
                    name="numTickets"
                    type="number"
                    value={form.numTickets}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                    placeholder="1"
                    disabled={formLoading} // Disable during loading
                  />
                </Grid>
              </Grid>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  disabled={formLoading} // Disable during loading
                  startIcon={
                    formLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  {formLoading ? "Registering..." : "Register"}
                </Button>
              </motion.div>
            </motion.form>
          ) : isAdmin ? ( // For admins, show a message instead of form
            <Alert severity="info" sx={{ mt: 2 }}>
              As an admin, you can manage this event from the events page.
            </Alert>
          ) : null}
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

export default EventDetails;
