import { Box, Typography, IconButton, useTheme } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        mt: 6,
        py: 3,
        px: 2,
        textAlign: "center",
        background: theme.palette.mode === "light" ? "#f8f6f2" : "#232946",
        color: theme.palette.text.primary,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${
          theme.palette.mode === "light" ? "#e0e0e0" : "#393E46"
        }`,
        boxShadow: "0 2px 8px rgba(34,34,34,0.08)",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          mb: 1,
          fontFamily: "Merriweather, Georgia, serif",
          color: theme.palette.text.secondary,
        }}
      >
        © {new Date().getFullYear()} Navratri Event. All rights reserved.
      </Typography>
      <IconButton href="https://facebook.com" target="_blank" color="secondary">
        <FacebookIcon />
      </IconButton>
      <IconButton
        href="https://instagram.com"
        target="_blank"
        color="secondary"
      >
        <InstagramIcon />
      </IconButton>
    </Box>
  );
};

export default Footer;
