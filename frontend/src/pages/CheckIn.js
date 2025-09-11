import React, { useState, useRef } from "react";
import axios from "axios";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { Container, Paper, Typography, Alert } from "@mui/material";

const CheckIn = () => {
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);
  const checkedInRef = useRef(false);

  const handleScan = async (result) => {
    if (checkedInRef.current) return;
    if (result && result.startsWith("PASS:")) {
      checkedInRef.current = true;
      setCheckedIn(true);
      setScanResult(result);
      setMessage("");
      setError("");
      const email = result.replace("PASS:", "");
      try {
        const res = await axios.post(
          "/api/users/checkin",
          { email },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessage(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Check-in failed");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Check-In (Scan QR Code)
        </Typography>
        <div
          style={{
            width: 320,
            height: 320,
            margin: "0 auto",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#222", // optional, for contrast
          }}
        >
          <QrReader
            onResult={(result, error) => {
              if (!!result) handleScan(result?.text);
            }}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        {scanResult && (
          <Typography sx={{ mt: 2 }}>Scanned: {scanResult}</Typography>
        )}
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
          <Typography sx={{ mt: 3, color: "#1976d2" }}>
            You have been checked in. Please close this page.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default CheckIn;
