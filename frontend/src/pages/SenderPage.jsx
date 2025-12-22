import React, { useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Checkbox,
  MenuItem,
  Alert,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import toast from "react-hot-toast";

import SendIcon from "@mui/icons-material/Send";
import LockIcon from "@mui/icons-material/Lock";
import DescriptionIcon from "@mui/icons-material/Description";
import TimerIcon from "@mui/icons-material/Timer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DecryptedText from "../components/DecryptedText";

import {
  generateKey,
  encryptMessage,
  deriveKeyFromPassword,
} from "../utils/crypto";

import useSenderStore from "../store/useSenderStore";

const expirationOptions = [
  { value: "1h", label: "1 Hour" },
  { value: "6h", label: "6 Hours" },
  { value: "12h", label: "12 Hours" },
  { value: "24h", label: "1 Day" },
  { value: "3d", label: "3 Days" },
  { value: "7d", label: "1 Week" },
];

export default function SenderPage() {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);
  const [otmCode, setOtmCode] = useState(null)
  const [otmPassword, setOtmPassword] = useState(null)

  // UI-only flag for now (burn is enforced on receiver after valid decrypt)
  const [selfDestruct, setSelfDestruct] = useState(true);
  const [expiry, setExpiry] = useState("24h");
  const [optionsOpen, setOptionsOpen] = useState(false);

  const senderStatus = useSenderStore((s) => s.status);
  const senderError = useSenderStore((s) => s.error);
  const createEncryptedMessage = useSenderStore((s) => s.createEncryptedMessage);

  const passwordsDoNotMatch =
    confirmPassword !== "" && password !== confirmPassword;

  const getExpiresAtIso = (value) => {
    const msByOption = {
      "1h": 1 * 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "12h": 12 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "3d": 3 * 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
    };

    const ms = msByOption[value] ?? msByOption["24h"];
    return new Date(Date.now() + ms).toISOString();
  };

  const handleCreateLink = async () => {
    if (!message) {
      toast.error("Please enter a message");
      return;
    }

    if (passwordsDoNotMatch) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // We never use raw key directly.
      // We derive the AES key via PBKDF2 from a 'secret' (password or random string).
      const secret = password ? password : generateKey();
      const key = deriveKeyFromPassword(secret);

      const encryptedData = encryptMessage(message, key);
      const expiresAt = getExpiresAtIso(expiry);

      const result = await createEncryptedMessage({ encryptedData, expiresAt });
      if (!result?.id) {
        toast.error(senderError || "Failed to create message");
        return;
      }

      const baseURL = `${window.location.origin}/${result.id}`;

      // If user did NOT enter password, embed the secret in the URL fragment.
      // If user entered password, receiver should type it manually at /receiver or /:id.
      const finalURL = !password
        ? `${baseURL}#${encodeURIComponent(secret)}`
        : baseURL;

      setOtmCode(result.id)
      setOtmPassword(secret)
      setGeneratedLink(finalURL);
    } catch (error) {
      toast.error(error?.message || "Encryption failed");
      console.log("Encryption failed", error);
    }
  };

  const handleReset = () => {
    setGeneratedLink(null);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setExpiry("24h");
    setSelfDestruct(true);
    setOptionsOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: { xs: "35rem", md: "35rem" },
        py: 4,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: { xs: 3, sm: 4 },
          border: 0,
          borderRadius: 4,
          width: "100%",
          position: "relative",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Stack alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <DecryptedText
              text="One Time Message"
              animateOn="view"
              fontSize="2rem"
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
              Encrypt your one time message
            </Typography>
          </Stack>

          {generatedLink ? (
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Alert severity="success" sx={{ fontFamily: "Oxanium" }}>
                Link generated successfully!{" "}
                {password
                  ? "Don't forget to share the password."
                  : "The key is embedded in the link."}
              </Alert>

              <TextField
                label="Secure Link"
                fullWidth
                value={generatedLink}
                focused
                color="success"
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(generatedLink);
                            toast.success("Link copied to clipboard!");
                          }}
                          color="success"
                          edge="end"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="OTM code"
                fullWidth
                value={otmCode}
                focused
                color="success"
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(otmCode);
                            toast.success("Link copied to clipboard!");
                          }}
                          color="success"
                          edge="end"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="OTM password"
                fullWidth
                value={otmPassword}
                focused
                color="success"
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(otmPassword);
                            toast.success("Link copied to clipboard!");
                          }}
                          color="success"
                          edge="end"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ fontFamily: "Oxanium", fontWeight: 700 }}
              >
                Send Another Secret
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ width: "100%" }}>
              <TextField
                label="Your message"
                multiline
                rows={5}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your secret message here..."
                sx={{ "& .MuiInputBase-root": { fontFamily: "Oxanium" } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color="primary" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Accordion
                expanded={optionsOpen}
                onChange={() => setOptionsOpen((v) => !v)}
                elevation={4}
                sx={(theme) => ({
                  width: "100%",
                  backgroundColor: theme.palette.background.default,
                  "&:before": { display: "none" },
                })}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                  aria-controls="sender-options-content"
                  id="sender-options-header"
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
                    {optionsOpen ? "Security settings" : "Show options"}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 2 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Password Protection"
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

                    <TextField
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      fullWidth
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={passwordsDoNotMatch}
                      helperText={passwordsDoNotMatch ? "Passwords do not match" : ""}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon
                                sx={{
                                  color: passwordsDoNotMatch
                                    ? "error.main"
                                    : "primary.main",
                                }}
                              />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    <Stack
                      direction="row"
                      alignItems="center"
                      onClick={() => setSelfDestruct(!selfDestruct)}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        width: "fit-content",
                      }}
                    >
                      <Checkbox color="primary" checked={selfDestruct} readOnly />
                      <Typography
                        sx={{
                          fontFamily: "Oxanium",
                          fontSize: "0.9rem",
                        }}
                      >
                        Burn after read
                      </Typography>
                    </Stack>

                    <TextField
                      select
                      label="Self-Destruct Timer"
                      fullWidth
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <TimerIcon color="primary" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    >
                      {expirationOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{ fontFamily: "Oxanium" }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Button
                variant="contained"
                size="large"
                fullWidth
                endIcon={<SendIcon />}
                onClick={handleCreateLink}
                disabled={senderStatus === "sending"}
                sx={{
                  py: 1.5,
                  fontSize: "1.2rem",
                }}
              >
                {senderStatus === "sending" ? "Generating..." : "Generate OTM Code"}
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
