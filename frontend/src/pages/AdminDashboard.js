import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrBooking, setQrBooking] = useState(null);
  const [resendMsg, setResendMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    axios
      .get("/api/users/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to fetch bookings")
      );
  }, [navigate]);

  const handleShowQR = (booking) => {
    setQrBooking(booking);
    setQrCode(booking.passQRCode || "");
    setResendMsg("");
    setQrDialogOpen(true);
  };

  const handleResendTicket = async () => {
    if (!qrBooking) return;
    setResendLoading(true);
    setResendMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/users/send-qrcode",
        { bookingId: qrBooking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResendMsg(res.data.message || "Ticket resent successfully.");
    } catch (err) {
      setResendMsg(
        err.response?.data?.message ||
          "Failed to resend ticket. Please try again."
      );
    }
    setResendLoading(false);
  };

  const handleCloseDialog = () => {
    setQrDialogOpen(false);
    setQrCode("");
    setQrBooking(null);
    setResendMsg("");
    setResendLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard - Bookings
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>QR Code</TableCell>
              <TableCell>Checked In</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.phone}</TableCell>
                <TableCell>{booking.user?.email}</TableCell>
                <TableCell>
                  <Link
                    to={`/events/${booking.event?._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {booking.event?.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {booking.event
                    ? new Date(booking.event.date).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>{booking.event?.location}</TableCell>
                <TableCell>
                  {booking.passQRCode ? (
                    <IconButton
                      color="primary"
                      onClick={() => handleShowQR(booking)}
                      title="Show QR"
                    >
                      <QrCodeIcon />
                    </IconButton>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not generated
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {booking.isCheckedIn ? (
                    <Typography variant="body2" color="success.main">
                      Yes
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="error.main">
                      No
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {booking.amountPaid ? (
                    <Typography>{`₹${(booking.amountPaid / 100).toLocaleString(
                      "en-IN"
                    )}`}</Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {bookings.length === 0 && (
          <Typography sx={{ mt: 2 }}>No bookings found.</Typography>
        )}
      </Paper>
      <Dialog
        open={qrDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {qrBooking ? `QR Code for ${qrBooking.user?.name}` : "QR Code"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {qrCode ? (
            <Box>
              <img
                src={qrCode}
                alt="QR Code"
                style={{ width: 200, height: 200, marginBottom: 16 }}
              />
              {qrBooking && !qrBooking.isCheckedIn && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EmailIcon />}
                  onClick={handleResendTicket}
                  disabled={resendLoading}
                  sx={{ mb: 2 }}
                >
                  {resendLoading ? "Resending..." : "Resend Ticket"}
                </Button>
              )}
              {resendMsg && (
                <Alert
                  severity={
                    resendMsg.toLowerCase().includes("fail")
                      ? "error"
                      : "success"
                  }
                  sx={{ mt: 1 }}
                >
                  {resendMsg}
                </Alert>
              )}
            </Box>
          ) : (
            <Typography sx={{ mt: 2 }}>Loading QR code...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
