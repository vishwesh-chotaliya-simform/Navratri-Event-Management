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
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrUser, setQrUser] = useState(null);
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
      .get("/api/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to fetch users")
      );
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));
  }, [navigate]);

  // Helper to get event name by event id
  const getEventName = (eventId) => {
    const event = events.find((ev) => ev._id === eventId);
    return event ? event.name : "-";
  };

  // Only fetch and show QR code, do not send email
  const handleShowQR = async (user) => {
    setQrUser(user);
    setQrCode("");
    setResendMsg("");
    setQrDialogOpen(true);
    try {
      const res = await axios.get(`/api/users/${user.email}/qrcode`, {
        params: { preview: true }, // Optionally, you can add a query param to indicate preview
      });
      setQrCode(res.data.qrCode);
    } catch (err) {
      setQrCode("");
      setError(err.response?.data?.message || "Failed to fetch QR code");
    }
  };

  // Resend ticket email
  const handleResendTicket = async () => {
    if (!qrUser) return;
    setResendLoading(true);
    setResendMsg("");
    try {
      const res = await axios.post("/api/users/send-qrcode", {
        email: qrUser.email,
        eventId: qrUser.event,
      });
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
    setQrUser(null);
    setResendMsg("");
    setResendLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>QR Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Link
                    to={`/events/${user.event}`}
                    style={{
                      textDecoration: "none",
                      color: "#d72660",
                      fontWeight: 600,
                    }}
                  >
                    {getEventName(user.event)}
                  </Link>
                </TableCell>
                <TableCell>
                  {!user.isCheckedIn ? (
                    <IconButton
                      color="primary"
                      onClick={() => handleShowQR(user)}
                      title="Show QR"
                    >
                      <QrCodeIcon />
                    </IconButton>
                  ) : (
                    <Typography variant="body2" color="success.main">
                      Checked In
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog
        open={qrDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {qrUser ? `QR Code for ${qrUser.name}` : "QR Code"}
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
