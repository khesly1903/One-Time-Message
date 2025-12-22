import React from "react";
import { Typography, Container, Box, Stack } from "@mui/material";


export default function Fotter() {
  return (
    <Box
      component="footer"
      elevation={1}
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={1} alignItems="center">
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            fontFamily="Oxanium"
          >
            Zero-Knowledge Architecture • End-to-End Encrypted
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ opacity: 0.5 }}
          >
            {"Copyright © Berkay Kaya "}
            {"2025"}
            {/* {new Date().getFullYear()} */}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
