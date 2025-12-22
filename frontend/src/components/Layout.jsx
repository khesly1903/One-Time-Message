import Navbar from "./Navbar";
import Footer from "./Fotter";
import { Box } from "@mui/material";

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout;
