import React, { useRef, useEffect, useState } from "react";
import { Container, Paper, Typography, Alert, Button } from "@mui/material";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import "./CheckIn.css";

const CheckIn = () => {
  const qrRef = useRef(null);
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const scanProcessedRef = useRef(false);

  useEffect(() => {
    const html5Qr = new Html5Qrcode("qr-reader");
    setScanner(html5Qr);
    scanProcessedRef.current = false;

    html5Qr.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 320,
      },
      async (decodedText) => {
        if (!scanProcessedRef.current && decodedText) {
          scanProcessedRef.current = true;
          setCheckedIn(true);
          let bookingInfo;
          try {
            bookingInfo = JSON.parse(decodedText);
          } catch {
            setError("Invalid QR code format");
            setShowBookingDetails(false);
            if (html5Qr.getState && html5Qr.getState() === 2) {
              await html5Qr.stop();
            }
            return;
          }
          try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`/api/users/bookings`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const booking = res.data.find(
              (b) => b._id === bookingInfo.bookingId
            );
            if (!booking) {
              setError("Booking not found.");
              setShowBookingDetails(false);
              if (html5Qr.getState && html5Qr.getState() === 2) {
                await html5Qr.stop();
              }
              return;
            }
            if (booking.isCheckedIn) {
              setError("Already checked in.");
              setShowBookingDetails(false);
              if (html5Qr.getState && html5Qr.getState() === 2) {
                await html5Qr.stop();
              }
              return;
            }
            setBookingDetails(booking);
            setShowBookingDetails(true);
            await axios.post(
              "/api/users/checkin",
              { qrData: decodedText },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Check-in successful");
            setError("");
          } catch (err) {
            setMessage("");
            setError(err.response?.data?.message || "Check-in failed");
            setShowBookingDetails(false);
          }
          // Stop camera after scan processed
          if (html5Qr.getState && html5Qr.getState() === 2) {
            await html5Qr.stop();
          }
        }
      },
      (scanError) => {
        if (scanError && scanError.toLowerCase().includes("camera")) {
          setError("Camera error: " + scanError);
        }
      }
    );

    return () => {
      if (html5Qr.getState && html5Qr.getState() === 2) {
        html5Qr
          .stop()
          .catch(() => {})
          .finally(() => {
            html5Qr.clear()?.catch(() => {});
          });
      } else {
        html5Qr.clear()?.catch(() => {});
      }
    };
  }, []);

  const handleRestart = async () => {
    if (scanner) {
      setMessage("");
      setError("");
      setCheckedIn(false);
      setBookingDetails(null);
      setShowBookingDetails(false);
      scanProcessedRef.current = false;
      // Ensure camera is stopped before restarting
      if (scanner.getState && scanner.getState() === 2) {
        await scanner.stop();
      }
      scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 320,
        },
        async (decodedText) => {
          if (!scanProcessedRef.current && decodedText) {
            scanProcessedRef.current = true;
            setCheckedIn(true);
            let bookingInfo;
            try {
              bookingInfo = JSON.parse(decodedText);
            } catch {
              setError("Invalid QR code format");
              setShowBookingDetails(false);
              if (scanner.getState && scanner.getState() === 2) {
                await scanner.stop();
              }
              return;
            }
            try {
              const token = localStorage.getItem("token");
              const res = await axios.get(`/api/users/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const booking = res.data.find(
                (b) => b._id === bookingInfo.bookingId
              );
              if (!booking) {
                setError("Booking not found.");
                setShowBookingDetails(false);
                if (scanner.getState && scanner.getState() === 2) {
                  await scanner.stop();
                }
                return;
              }
              if (booking.isCheckedIn) {
                setError("Already checked in.");
                setShowBookingDetails(false);
                if (scanner.getState && scanner.getState() === 2) {
                  await scanner.stop();
                }
                return;
              }
              setBookingDetails(booking);
              setShowBookingDetails(true);
              await axios.post(
                "/api/users/checkin",
                { qrData: decodedText },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setMessage("Check-in successful");
              setError("");
            } catch (err) {
              setMessage("");
              setError(err.response?.data?.message || "Check-in failed");
              setShowBookingDetails(false);
            }
            // Stop camera after scan processed
            if (scanner.getState && scanner.getState() === 2) {
              await scanner.stop();
            }
          }
        },
        (scanError) => {
          if (scanError && scanError.toLowerCase().includes("camera")) {
            setError("Camera error: " + scanError);
          }
        }
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Check-In (Scan QR Code)
        </Typography>
        <div
          id="qr-reader"
          ref={qrRef}
          style={{
            width: 320,
            height: 320,
            margin: "0 auto",
            borderRadius: 16,
            overflow: "hidden",
            background: "#000",
          }}
        />
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
        {checkedIn && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleRestart}>
            Scan Another
          </Button>
        )}
        {showBookingDetails && bookingDetails && (
          <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6">Booking Details</Typography>
            <Typography>Booking ID: {bookingDetails._id}</Typography>
            <Typography>Name: {bookingDetails.name}</Typography>
            <Typography>Phone: {bookingDetails.phone}</Typography>
            <Typography>Email: {bookingDetails.user?.email}</Typography>
            <Typography>Event: {bookingDetails.event?.name}</Typography>
            <Typography>
              Date:{" "}
              {bookingDetails.event
                ? new Date(bookingDetails.event.date).toLocaleDateString()
                : "-"}
            </Typography>
            <Typography>Location: {bookingDetails.event?.location}</Typography>
            <Typography>
              Number of Tickets: {bookingDetails.numTickets}
            </Typography>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default CheckIn;
