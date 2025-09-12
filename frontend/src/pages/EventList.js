import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  Button,
  Typography,
  Container,
  Alert,
  Chip,
  Box,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion } from "framer-motion";

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
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        Upcoming Events
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={4}>
        {events.map((event, index) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
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
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EventIcon sx={{ fontSize: 60, color: "white" }} />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2">{event.location}</Typography>
                  </Box>
                  <Chip
                    label={new Date(event.date).toLocaleDateString()}
                    color="secondary"
                    size="small"
                  />
                </CardContent>
                {isAdmin && (
                  <CardActions sx={{ justifyContent: "center", p: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/admin/edit-event/${event._id}`}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
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
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventList;
