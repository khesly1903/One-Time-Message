import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Link,
  IconButton,
  Tooltip,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

import useThemeStore from "../store/useThemeStore";
import SecurityIcon from "@mui/icons-material/Security";
import GitHubIcon from "@mui/icons-material/GitHub";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function Navbar() {
  const { mode, toggleTheme } = useThemeStore();
const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        bgcolor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* --- SOL TARAF: LOGO --- */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <SecurityIcon
              sx={{
                // display: { xs: "none", md: "flex" },
                mr: 1,
                color: "primary.main",
              }}
            />
            {/* Logo Yazısı: Mobilde çok yer kaplamaması için fontu biraz küçültebiliriz */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                // display:{xs:"none",sm:"block"},
                mr: 2,
                fontFamily: "Saira Stencil One",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                // Mobilde fontu küçültüyoruz ki butonlara yer kalsın
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
             {isMobile ? "OTM" : "ONE TIME MESSAGE"}
            </Typography>
          </Box>

          {/* --- ORTA/SAĞ TARAF: NAVİGASYON LİNKLERİ --- */}
          <Box
            sx={{
              // DEĞİŞİKLİK 1: 'xs: none' yerine 'flex' yaptık. Artık hep görünür.
              display: "flex",
              alignItems: "center",
              gap: 1,
              mr: 2,
            }}
          >
            {/* SENDER BUTTON */}
            <Button
              component={RouterLink}
              to="/sender"
              color="inherit"
              // DEĞİŞİKLİK 2: startIcon'u kaldırdık, içeriği elle yazıyoruz
              sx={{
                fontFamily: "Oxanium",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 0,
                minWidth: "auto", // Mobilde butonun gereksiz genişlemesini engeller
                borderBottom: isActive("/sender")
                  ? "2px solid"
                  : "2px solid transparent",
                borderColor: isActive("/sender")
                  ? "primary.main"
                  : "transparent",
                color: isActive("/sender") ? "primary.main" : "inherit",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "transparent",
                },
              }}
            >
              {/* İkon Her Zaman Görünür */}
              <ArrowUpwardIcon sx={{ fontSize: 20 }} />

              {/* Yazı Sadece SM ve Üstünde Görünür */}
              <Box
                component="span"
                sx={{ display: { xs: "none", lg: "block" }, ml: 1 }}
              >
                I am Sender
              </Box>
            </Button>

            {/* RECEIVER BUTTON */}
            <Button
              component={RouterLink}
              to="/receiver"
              color="inherit"
              sx={{
                fontFamily: "Oxanium",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 0,
                minWidth: "auto",
                borderBottom: isActive("/receiver")
                  ? "2px solid"
                  : "2px solid transparent",
                borderColor: isActive("/receiver")
                  ? "primary.main"
                  : "transparent",
                color: isActive("/receiver") ? "primary.main" : "inherit",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "transparent",
                },
              }}
            >
              <ArrowDownwardIcon sx={{ fontSize: 20 }} />

              {/* Yazı Sadece SM ve Üstünde Görünür */}
              <Box
                component="span"
                sx={{ display: { xs: "none", lg: "block" }, ml: 1 }}
              >
                I am Receiver
              </Box>
            </Button>

            {/* Ayırıcı Çizgi */}
            <Box
              sx={{ width: "1px", height: "24px", bgcolor: "divider", mx: 1 }}
            />
          </Box>

          {/* --- EN SAĞ: TEMA VE GITHUB --- */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Görünümü Değiştir">
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            <Link
              href="https://github.com/khesly1903/One-Time-Message"
              target="_blank"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 1,
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              <GitHubIcon />
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
