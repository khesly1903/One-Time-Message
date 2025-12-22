// src/pages/HomePage.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// İkonlar
import SendIcon from "@mui/icons-material/Send";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import SecurityIcon from "@mui/icons-material/Security";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// Animasyonlu metin bileşeni
import DecryptedText from "../components/DecryptedText";

export default function HomePage() {
  return (
    <Container
      maxWidth="xl"
      sx={{ display: "flex", alignItems: "center", m: "0rem 2rem" }}
    >
      {/* ANA LAYOUT YAPISI (STACK)
        xs (mobil): column (alt alta)
        md (masaüstü): row (yan yana)
        spacing: aralarındaki boşluk
      */}
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={{ xs: 8, md: 12 }}
        alignItems="center"
        sx={{ py: 8, width: "100%" }}
      >
        {/* ================= SOL TARAF: VİZYON (FLEX: 1) ================= */}
        <Box sx={{ flex: 1, width: "100%" }}>
          <Stack spacing={4}>
            {/* 1. Logo ve Başlık */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <SecurityIcon
                  sx={{ fontSize: { xs: 40, md: 56 }, color: "primary.main" }}
                />
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontFamily: "Saira Stencil One",
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <DecryptedText
                    text="OTM PROTOCOL"
                    animateOn="view"
                    sequential={true}
                    speed={100}
                    maxIterations={20}
                    revealDirection="start"
                  />
                </Typography>
              </Stack>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontFamily: "Oxanium",
                  fontWeight: 400,
                  fontSize: "1.2rem",
                }}
              >
                The definitive standard for secure, ephemeral communication.
              </Typography>
            </Box>

            {/* 2. Teknik Açıklama */}
            <Paper elevation={0} sx={{ p: 3, border: 0, borderRadius: 4 }}>
              <List disablePadding>
                <ListItem disableGutters sx={{ pb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40, m: 1 }}>
                    <KeyOffIcon color="primary" fontSize="large" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ fontFamily: "Oxanium", fontWeight: 700 }}
                      >
                        Zero-Knowledge Architecture
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: "Oxanium" }}
                      >
                        We never hold the keys. The decryption key is generated
                        on your device. We technically cannot read your data.
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40, m: 1 }}>
                    <VerifiedUserIcon color="primary" fontSize="large" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ fontFamily: "Oxanium", fontWeight: 700 }}
                      >
                        End-to-End Encrypted
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: "Oxanium" }}
                      >
                        Encryption happens in your browser before data is sent.
                        Your message travels through the internet as unreadable
                        code.
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Paper>

            {/* 3. Aksiyon Butonları */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                pt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                component={RouterLink}
                to="/sender"
                variant="contained"
                size="large"
                startIcon={<ArrowUpwardIcon sx={{ fontSize: 30 }} />}
                sx={{
                  py: 2,
                  px: { xs: 2, md: 4 },
                  width: { xs: "100%", sm: "50%", md: "40%" },
                  fontFamily: "Oxanium",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textAlign: "left",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>Send</span>
                  <span style={{ fontSize: "1.3rem" }}>OTM</span>
                </Box>
              </Button>
              <Button
                component={RouterLink}
                to="/receiver"
                variant="contained"
                size="large"
                startIcon={<ArrowDownwardIcon sx={{ fontSize: 30 }} />}
                sx={{
                  py: 2,
                  px: { xs: 2, md: 4 },
                  width: { xs: "100%", sm: "50%", md: "40%" },
                  fontFamily: "Oxanium",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textAlign: "left",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                    Decrypt
                  </span>
                  <span style={{ fontSize: "1.3rem" }}>OTM</span>
                </Box>
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* ================= SAĞ TARAF: NASIL ÇALIŞIR (FLEX: 1) ================= */}
        <Box sx={{ flex: 1, width: "100%" }}>
          <Stack spacing={4}>
            {/* ADIM 1 */}
            <Paper
              elevation={3}
              sx={(theme) => ({
                p: 4,
                position: "relative",
                overflow: "hidden",
                border: 0,
                borderRadius: 4,
                background:
                  theme.palette.mode === "dark"
                    ? // Dark Mod: Paper renginden -> Tam siyaha (#000000) doğru
                      `linear-gradient(to right, ${theme.palette.background.paper}, #000000)`
                    : // Light Mod: Paper renginden -> Hafif Griye (Grey 200) doğru
                      `linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.grey[200]})`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 20px 50px -10px rgba(0,0,0, 0.9)"
                      : "0 20px 50px -10px rgba(0,0,0, 0.2)",
                },
              })}
            >
              <Typography
                sx={{
                  position: "absolute",
                  top: "10%",
                  right: 10,
                  fontSize: "8rem",
                  fontWeight: 900,
                  opacity: 0.09,
                  fontFamily: "Saira Stencil One",
                  lineHeight: 1,
                }}
              >
                1
              </Typography>
              <Stack direction="row" spacing={3}>
                <VpnKeyIcon
                  color="primary"
                  sx={{ fontSize: 40, alignSelf: "center" }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: "Oxanium", fontWeight: 700, mb: 1 }}
                  >
                    Encrypt & Generate Link
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontFamily: "Oxanium" }}
                  >
                    Write your secret. Your browser encrypts it locally and
                    generates a unique, one-time link containing the decryption
                    key.
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* ADIM 2 */}
            <Paper
              elevation={3}
              sx={(theme) => ({
                p: 4,
                position: "relative",
                overflow: "hidden",
                border: 0,
                borderRadius: 4,

                // --- GRADIENT AYARI ---
                background:
                  theme.palette.mode === "dark"
                    ? // Dark Mod: Paper renginden -> Tam siyaha (#000000) doğru
                      `linear-gradient(to right, ${theme.palette.background.paper}, #000000)`
                    : // Light Mod: Paper renginden -> Hafif Griye (Grey 200) doğru
                      `linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.grey[200]})`,

                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 20px 50px -10px rgba(0,0,0, 0.9)"
                      : "0 20px 50px -10px rgba(0,0,0, 0.2)",
                },
              })}
            >
              <Typography
                sx={{
                  position: "absolute",

                  top: "10%",
                  right: 10,
                  fontSize: "8rem",
                  fontWeight: 900,
                  opacity: 0.09,
                  fontFamily: "Saira Stencil One",
                  lineHeight: 1,
                }}
              >
                2
              </Typography>
              <Stack direction="row" spacing={3}>
                <SendIcon
                  color="primary"
                  sx={{ fontSize: 40, alignSelf: "center" }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: "Oxanium", fontWeight: 700, mb: 1 }}
                  >
                    Share the OTM Link
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontFamily: "Oxanium" }}
                  >
                    Send the link to your intended recipient via any channel.
                    The key is in the link itself.
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* ADIM 3 */}
            <Paper
              elevation={10}
              sx={(theme) => ({
                p: 4,
                position: "relative",
                overflow: "hidden",
                border: 0,
                borderRadius: 4,

                // --- GRADIENT AYARI ---
                background:
                  theme.palette.mode === "dark"
                    ? // Dark Mod: Paper renginden -> Tam siyaha (#000000) doğru
                      `linear-gradient(to right, ${theme.palette.background.paper}, #000000)`
                    : // Light Mod: Paper renginden -> Hafif Griye (Grey 200) doğru
                      `linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.grey[200]})`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 20px 50px -10px rgba(0,0,0, 0.9)"
                      : "0 20px 50px -10px rgba(0,0,0, 0.2)",
                },
              })}
            >
              <Typography
                sx={{
                  position: "absolute",
                  top: "10%",
                  right: 10,
                  fontSize: "8rem",
                  fontWeight: 900,
                  opacity: 0.09,
                  fontFamily: "Saira Stencil One",
                  lineHeight: 1,
                }}
              >
                3
              </Typography>
              <Stack direction="row" spacing={3}>
                <LocalFireDepartmentIcon
                  color="primary"
                  sx={{ fontSize: 40, alignSelf: "center" }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: "Oxanium", fontWeight: 700, mb: 1 }}
                  >
                    Burn After Reading
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontFamily: "Oxanium" }}
                  >
                    Once opened, the message is securely and permanently deleted
                    from servers. No logs, no backups.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
