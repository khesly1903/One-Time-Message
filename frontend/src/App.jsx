import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { getTheme } from "./theme";

import HomePage from "./pages/HomePage";
import SenderPage from "./pages/SenderPage";
import ReceiverPage from "./pages/ReceiverPage";
import ReceiverPageQuery from "./pages/ReceiverPageQuery";
import ShowOTM from "./components/ShowOTM";

import Layout from "./components/Layout";
import { useMemo } from "react";
import useThemeStore from "./store/useThemeStore";

export default function App() {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: "Oxanium",
          },
          success: {
            style: {
              border: "1px solid #4caf50",
            },
            iconTheme: {
              primary: "#4caf50",
              secondary: theme.palette.background.paper,
            },
          },
          error: {
            style: {
              border: "1px solid #f44336",
            },
            iconTheme: {
              primary: "#f44336",
              secondary: theme.palette.background.paper,
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout children={<HomePage />} />} />
          <Route
            path="/sender"
            element={<Layout children={<SenderPage />} />}
          />
          <Route
            path="/receiver"
            element={<Layout children={<ReceiverPage />} />}
          />
          <Route path="/test" element={<Layout children={<ShowOTM />} />} />
          <Route
            path="/:id"
            element={<Layout children={<ReceiverPageQuery />} />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
