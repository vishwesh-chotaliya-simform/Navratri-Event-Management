import { Box, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => (
  <Box
    sx={{
      mt: 6,
      py: 3,
      textAlign: "center",
      background: "linear-gradient(90deg, #d72660 60%, #fbb13c 100%)",
      color: "#fff",
    }}
  >
    <Typography variant="body1" sx={{ mb: 1 }}>
      © {new Date().getFullYear()} Navratri Event. All rights reserved.
    </Typography>
    <IconButton href="https://facebook.com" target="_blank" color="inherit">
      <FacebookIcon />
    </IconButton>
    <IconButton href="https://instagram.com" target="_blank" color="inherit">
      <InstagramIcon />
    </IconButton>
  </Box>
);

export default Footer;