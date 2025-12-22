import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import toast from "react-hot-toast";

import LockIcon from "@mui/icons-material/Lock";
import DescriptionIcon from "@mui/icons-material/Description";

import DecryptedText from "../components/DecryptedText";
import useReceiverStore from "../store/useReceiverStore";

export default function ReceiverPageQuery() {
  const { id } = useParams();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [plaintext, setPlaintext] = useState("");

  const status = useReceiverStore((s) => s.status);
  const burnStatus = useReceiverStore((s) => s.burnStatus);
  const error = useReceiverStore((s) => s.error);
  const consumeMessage = useReceiverStore((s) => s.consumeMessage);
  const reset = useReceiverStore((s) => s.reset);

  const secretFromHash = useMemo(() => {
    const raw = location.hash?.startsWith("#") ? location.hash.slice(1) : "";
    if (!raw) return "";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [location.hash]);

  const needsPassword = !secretFromHash;

  const runConsume = async (secret) => {
    if (!id) return;

    const result = await consumeMessage({ id, secret });
    if (!result) {
      setPlaintext("");
      return;
    }
    setPlaintext(result);
  };

  useEffect(() => {
    // New message id => clear view state
    reset();
    setPlaintext("");
    setPassword("");
  }, [id, reset]);

  useEffect(() => {
    // Auto-consume if the secret is embedded in the URL fragment
    if (!id) return;
    if (!secretFromHash) return;

    void runConsume(secretFromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, secretFromHash]);

  const handleDecrypt = async () => {
    if (!id) return;

    if (!password) {
      toast.error("Please enter password");
      return;
    }

    await runConsume(password);
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
        <Stack spacing={3} alignItems="center">
          <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <DecryptedText
              text="You received an OTM"
              animateOn="view"
              fontSize="1.5rem"
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
              It will be burned after a valid read.
            </Typography>
          </Stack>

          {!!error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ fontFamily: "Oxanium", width: "100%" }}
            >
              {error}
            </Typography>
          )}

          {needsPassword && !plaintext && (
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="primary" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}

          {needsPassword && !plaintext && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleDecrypt}
              disabled={status === "loading" || status === "decrypting"}
              sx={{
                py: 1.5,
                fontSize: "1.2rem",
              }}
            >
              {status === "loading" || status === "decrypting"
                ? "Decrypting..."
                : "Decrypt"}
            </Button>
          )}

          {/* {!needsPassword && !plaintext && (
            <Typography sx={{ fontFamily: "Oxanium" }} color="text.secondary">
              Decrypting from link...
            </Typography>
          )} */}

          {!!plaintext && (
            <Typography sx={{ fontFamily: "Oxanium" }} color="text.secondary">
              {burnStatus === "deleting"
                ? "Burning..."
                : burnStatus === "deleted"
                ? "Burned."
                : burnStatus === "error"
                ? "Read OK, but burn failed (will not show again if deleted)."
                : ""}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
