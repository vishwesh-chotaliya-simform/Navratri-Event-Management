import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Avatar,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to fetch events")
      );
  }, []);

  const isAdmin = !!localStorage.getItem("token");

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter((ev) => ev._id !== id));
      } catch (err) {
        alert(
          "Delete failed: " + (err.response?.data?.message || "Unknown error")
        );
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                border: "3px solid",
                borderImage:
                  "linear-gradient(90deg, #d72660 60%, #fbb13c 100%) 1",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Avatar sx={{ bgcolor: "primary.main", mb: 2 }}>
                  <EventIcon />
                </Avatar>
                <Typography variant="h6" color="primary">
                  <Link
                    to={`/events/${event._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {event.name}
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {event.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {event.location}
                </Typography>
              </CardContent>
              {isAdmin && (
                <CardActions sx={{ justifyContent: "center" }}>
                  <Link to={`/admin/edit-event/${event._id}`}>
                    <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventList;
