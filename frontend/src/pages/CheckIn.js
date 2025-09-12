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
        if (
          !scanProcessedRef.current &&
          decodedText &&
          decodedText.startsWith("PASS:")
        ) {
          scanProcessedRef.current = true;
          setScanResult(decodedText);
          setCheckedIn(true);
          const email = decodedText.replace("PASS:", "");
          if (html5Qr.getState() === 2) {
            await html5Qr.stop();
          }
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
            setError(""); // Only clear error on success
          } catch (err) {
            setMessage(""); // Only clear message on error
            setError(err.response?.data?.message || "Check-in failed");
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

  const handleRestart = () => {
    if (scanner) {
      setScanResult("");
      setMessage("");
      setError("");
      setCheckedIn(false);
      scanProcessedRef.current = false;
      if (scanner.getState() !== 2) {
        scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 320,
          },
          async (decodedText) => {
            if (
              !scanProcessedRef.current &&
              decodedText &&
              decodedText.startsWith("PASS:")
            ) {
              scanProcessedRef.current = true;
              setScanResult(decodedText);
              setCheckedIn(true);
              const email = decodedText.replace("PASS:", "");
              if (scanner.getState() === 2) {
                await scanner.stop();
              }
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
                setError("");
              } catch (err) {
                setMessage("");
                setError(err.response?.data?.message || "Check-in failed");
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
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleRestart}>
            Scan Another
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default CheckIn;
