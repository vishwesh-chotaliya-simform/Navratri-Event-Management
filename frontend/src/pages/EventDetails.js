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
  const [formLoading, setFormLoading] = useState(false); // Loading for form submission / payment flow
  const [form, setForm] = useState({ name: "", phone: "", numTickets: 1 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isUser, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`/api/events`)
      .then((res) => {
        const found = res.data.find((ev) => ev._id === id);
        setEvent(found);
        setLoading(false);
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

  // Main submit: if event has price > 0, run payment flow; otherwise register directly.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFormLoading(true);

    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("Please login to continue.");
      setFormLoading(false);
      return;
    }

    const email = getEmailFromJWT();
    const numTickets = Number(form.numTickets) || 1;

    if (event?.price && Number(event.price) > 0) {
      try {
        // 1) Create order on backend
        const orderRes = await axios.post(
          "/api/users/create-order",
          { eventId: id, numTickets },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { orderId, amount, currency } = orderRes.data;

        // 2) Open Razorpay checkout
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || "",
          amount: amount,
          currency: currency || "INR",
          name: "Navratri Event",
          description: `Tickets for ${event.name}`,
          order_id: orderId,
          handler: async function (response) {
            try {
              // 3) Verify payment on backend — server will create booking and send QR
              const verifyRes = await axios.post(
                "/api/users/verify-payment",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              setMessage(
                verifyRes.data.message ||
                  "Payment successful. Registration complete. QR code sent to your email."
              );
              setForm({ name: "", phone: "", numTickets: 1 });
              // Wait 2 seconds for user to read message then redirect to bookings
              setTimeout(() => navigate("/bookings"), 2000);
            } catch (err) {
              setError(
                err.response?.data?.message ||
                  "Payment verification failed. If amount was deducted, contact support."
              );
              setFormLoading(false);
            }
          },
          prefill: {
            name: form.name,
            email: email,
            contact: form.phone,
          },
          notes: {
            eventId: id,
            numTickets: String(numTickets),
          },
          theme: {
            color: "#5c6bc0",
          },
          modal: {
            ondismiss: function () {
              setFormLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        setError(err.response?.data?.message || "Payment initiation failed");
        setFormLoading(false);
      }
    } else {
      // Free event / no price configured — register directly
      try {
        await axios.post(
          "/api/users/register",
          { ...form, email, event: id, numTickets },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Registration successful. QR code sent to your email.");
        setForm({ name: "", phone: "", numTickets: 1 });
        setTimeout(() => navigate("/bookings"), 2000);
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed");
        setFormLoading(false);
      }
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

  const totalPrice = event.price
    ? Number(event.price) * (Number(form.numTickets) || 1)
    : 0;

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
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Price per ticket:</strong>{" "}
                  {event.price ? `₹${event.price}` : "Free"}
                </Typography>
                <Typography variant="body2">
                  <strong>Total (current qty):</strong>{" "}
                  {event.price ? `₹${totalPrice}` : "—"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            {isAdmin ? "Event Management" : "Register for this Event"}
          </Typography>

          {!isUser && !isAdmin ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Please login to register for this event.
            </Alert>
          ) : isUser ? (
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
                    disabled={formLoading}
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
                    disabled={formLoading}
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
                    disabled={formLoading}
                  />
                </Grid>
              </Grid>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  disabled={formLoading}
                  startIcon={
                    formLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  {formLoading
                    ? event.price && event.price > 0
                      ? "Processing payment..."
                      : "Registering..."
                    : event.price && event.price > 0
                    ? `Pay ₹${totalPrice}`
                    : "Register"}
                </Button>
              </motion.div>
            </motion.form>
          ) : isAdmin ? (
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
