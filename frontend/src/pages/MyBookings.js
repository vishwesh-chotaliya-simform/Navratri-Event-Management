import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Box,
  Button,
  Chip,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrBooking, setQrBooking] = useState(null);
  const { isUser } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    axios
      .get("/api/users/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to fetch bookings")
      );
  }, []);

  const handleResend = async (booking) => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await axios.post("/api/users/send-qrcode", {
        bookingId: booking._id,
      });
      setSuccess("Ticket resent to your email address.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to resend ticket. Please try again."
      );
    }
    setLoading(false);
  };

  const handleShowQR = (booking) => {
    setQrBooking(booking);
    setQrCode(booking.passQRCode || "");
    setQrDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setQrDialogOpen(false);
    setQrCode("");
    setQrBooking(null);
    setSuccess("");
    setError("");
    setLoading(false);
  };

  if (!isUser) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Please login to view your bookings.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        My Bookings
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Grid container spacing={3}>
        {bookings.map((booking, index) => (
          <Grid item xs={12} sm={6} md={4} key={booking._id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-8px)" },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" color="primary">
                      <Link
                        to={`/events/${booking.event?._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {booking.event?.name}
                      </Link>
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {booking.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {booking.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Date:</strong>{" "}
                    {booking.event
                      ? new Date(booking.event.date).toLocaleDateString()
                      : "-"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Location:</strong> {booking.event?.location}
                  </Typography>
                  <Chip
                    label={
                      booking.isCheckedIn ? "Checked In" : "Not Checked In"
                    }
                    color={booking.isCheckedIn ? "success" : "warning"}
                    size="small"
                  />
                </CardContent>
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleShowQR(booking)}
                    title="Show QR"
                  >
                    <QrCodeIcon />
                  </IconButton>
                  {!booking.isCheckedIn && (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<EmailIcon />}
                      onClick={() => handleResend(booking)}
                      disabled={loading}
                      size="small"
                    >
                      Resend
                    </Button>
                  )}
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {bookings.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          No bookings found.
        </Typography>
      )}
      <Dialog
        open={qrDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {qrBooking ? `QR Code for ${qrBooking.event?.name}` : "QR Code"}
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {qrCode ? (
            <Box>
              <img
                src={qrCode}
                alt="QR Code"
                style={{ width: 200, height: 200, marginBottom: 16 }}
              />
            </Box>
          ) : (
            <Typography sx={{ mt: 2 }}>Loading QR code...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MyBookings;
