import React, { useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import toast from "react-hot-toast";

import SendIcon from "@mui/icons-material/Send";
import LockIcon from "@mui/icons-material/Lock";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import DecryptedText from "../components/DecryptedText";
import useReceiverStore from "../store/useReceiverStore";

export default function ReceiverPage() {
  const [otmCode, setOtmCode] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(true);
  const [plaintext, setPlaintext] = useState("");

  const status = useReceiverStore((s) => s.status);
  const burnStatus = useReceiverStore((s) => s.burnStatus);
  const error = useReceiverStore((s) => s.error);
  const consumeMessage = useReceiverStore((s) => s.consumeMessage);

  const handleGetOtm = async () => {
    const id = otmCode.trim();
    if (!id) {
      toast.error("Please enter message id");
      return;
    }

    if (!password) {
      toast.error("Please enter password");
      return;
    }

    const secret = password;
    const result = await consumeMessage({ id, secret });

    if (!result) {
      setPlaintext("");
      return;
    }

    setPlaintext(result);
  };

  const handleAccordionChange = () => {
    setIsPasswordEnabled(!isPasswordEnabled);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "35rem",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 4,
          border: 0,
          borderRadius: 4,
          width: "35rem",
          flex: 1,
          position: "relative",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        {/* Tüm elemanlar arasında spacing={3} var */}
        <Stack spacing={3} alignItems="center">
          {/* Başlık Alanı */}
          <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <DecryptedText
              text="OTM Decrypt"
              fontSize="2rem"
              animateOn="view"
              sequential={true}
              speed={100}
              maxIterations={20}
              revealDirection="start"
            />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ fontFamily: "Oxanium", letterSpacing: 1 }}
            >
              Decrypt your one time message
            </Typography>
          </Stack>

          <TextField
            label="OTM Code"
            rows={1}
            fullWidth
            value={otmCode}
            onChange={(e) => setOtmCode(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Accordion
            expanded={isPasswordEnabled}
            onChange={handleAccordionChange}
            elevation={4}
            sx={(theme) => ({
              width: "100%",
              backgroundColor: theme.palette.background.default,
              "&:before": { display: "none" },
            })}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
              aria-controls="password-content"
              id="password-header"
              sx={{
                fontFamily: "Oxanium",
                minHeight: 48,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontFamily: "Oxanium",
                  letterSpacing: 1,
                }}
              >
                {isPasswordEnabled
                  ? "Enter password"
                  : "Password (if there is)"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2 }}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </AccordionDetails>
          </Accordion>

          {!!error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ fontFamily: "Oxanium", width: "100%" }}
            >
              {error}
            </Typography>
          )}

          {!!plaintext && (
            <TextField
              label="OTM Message"
              fullWidth
              multiline
              maxRows={10}
              value={plaintext}
              focused
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            endIcon={<SendIcon />}
            onClick={handleGetOtm}
            disabled={status === "loading" || status === "decrypting"}
            sx={{
              py: 1.5,
              fontSize: "1.2rem",
            }}
          >
            {status === "loading" || status === "decrypting"
              ? "Decrypting..."
              : burnStatus === "deleting"
              ? "Burning..."
              : "Get my OTM"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
