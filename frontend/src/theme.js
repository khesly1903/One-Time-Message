import { createTheme } from "@mui/material/styles";

// =========================================================
// 1. COMMON SETTINGS (Shared across both modes)
// =========================================================
const commonSettings = {
  typography: {
    fontFamily: "'Oxanium', 'Roboto', sans-serif",
    h1: {
      fontFamily: "'Saira Stencil One', cursive",
      letterSpacing: ".05rem",
    },
    h2: {
      fontFamily: "'Saira Stencil One', cursive",
      letterSpacing: ".04rem",
    },
    h3: {
      fontFamily: "'Saira Stencil One', cursive",
      letterSpacing: ".03rem",
    },
    h4: { fontFamily: "'Saira Stencil One', cursive" },
    h5: { fontFamily: "'Saira Stencil One', cursive" },
    h6: { fontFamily: "'Saira Stencil One', cursive" },
    body1: { fontWeight: 400 },
    button: {
      fontWeight: 600,
      letterSpacing: "1px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "uppercase",
          fontFamily: "'Saira Stencil One', cursive",
          fontSize: "1.1rem",
        },
      },
    },
  },
};

// =========================================================
// 2. LIGHT THEME SETTINGS (Cyber Blue - Professional)
// =========================================================
const lightSettings = {
  palette: {
    mode: "light",
    primary: {
      main: "#7d1452ff", // Magenta/Mor tonu
      contrastText: "#000000ff", // Buton içi yazı beyaz olsun
    },
    background: {
      default: "#f0f2f5", 
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#616161",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #e0e0e0",
        },
      },
    },
    // Accordion Light Ayarı
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff", // Beyaz kağıt rengi
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)", // Hafif gölge
        },
      },
    },
    // Button Light Ayarı
    MuiButton: {
      styleOverrides: {
        root: {},
        contained: () => ({
          // Normal hali: Primary Rengi
          backgroundColor: "#7d1452ff", 
          color: "#ffffff",
          
          // Hover hali: Tersine çevir (Siyahımsı yap)
          "&:hover": {
            backgroundColor: "#1a1a1a", // Koyu gri/siyah
            color: "#ffffff",
          },
        }),
      },
    },
    // Select Icon Light Ayarı
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#1a1a1a", // İkon koyu olmalı ki beyazda görünsün
        },
      },
    },
  },
};

// =========================================================
// 3. DARK THEME SETTINGS (Cyber Blue - Neon/Futuristic)
// =========================================================
const darkSettings = {
  palette: {
    mode: "dark",
    primary: {
      main: "#D3DAD9",
      contrastText: "#000000",
    },
    background: {
      default: "#0C0C0C",
      paper: "#121212",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #333",
        },
      },
    },
    // DÜZELTME: 'Accordion' değil 'MuiAccordion' olmalı
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#171717",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {}, 
        contained: () => ({
          backgroundColor: "#1212129a", 
          color: "#ffffff",
          border: "1px solid #333", // Dark modda hafif çerçeve şık durur

          "&:hover": {
            backgroundColor: "#ffffff",
            color: "#121212", // Yazı rengini koyulaştırdım okunması için
          },
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#ffffff", 
        },
      },
    },
  },
};

// =========================================================
// 4. THEME GENERATOR FUNCTION
// =========================================================
export const getTheme = (mode) => {
  const activeSettings = mode === "light" ? lightSettings : darkSettings;
  return createTheme(commonSettings, activeSettings);
};