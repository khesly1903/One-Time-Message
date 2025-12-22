import {
  Container,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import DecryptedText from "./DecryptedText";

export default function ShowOTM() {
  const msg =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam obcaecati sapiente nemo architecto modi veniam quo aspernatur debitis quisquam magnam consequuntur culpa, quas, facilis totam rem dicta fugiat perferendis autem nisi libero excepturi quam enim. Molestias odit natus cum doloribus tempore ad totam, suscipit dolore maxime beatae id magni repudiandae vero laudantium recusandae officiis, sequi neque non corporis earum molestiae necessitatibus, delectus labore veniam. ";
  const getStatusMessage = (type, date = null) => {
    const messages = {
      BURN_ON_READ: {
        severity: "warning",
        title: "Self-Destruct Sequence Initiated",
        text: "This message will be permanently deleted once you close this page. Copy it immediately if needed.",
      },

      PERSISTENT: {
        severity: "info",
        title: "Retention Policy Active",
        text: `This message will remain accessible until ${date}. It will be destroyed automatically after that time.`,
      },

      DESTROYED: {
        severity: "error",
        title: "Error 404: Data Vaporized",
        text: "Message unavailable. It has either been read and destroyed, or the expiration timer has finished.",
      },
    };

    return messages[type];
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
          <DecryptedText
            text="You received an OTM"
            fontSize="2rem"
            animateOn="view"
            sequential={true}
            speed={100}
            maxIterations={20}
            revealDirection="start"
          />

          <TextField
            label={getStatusMessage("PERSISTENT").severity}
            color={getStatusMessage("PERSISTENT").severity}
            readonly
            focused
            fullWidth
            multiline
            value={getStatusMessage("PERSISTENT").text}
          />

          <TextField
            label="OTM Message"
            readonly
            focused
            fullWidth
            multiline
            value={msg}
            maxRows={10}
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
        </Stack>
      </Paper>
    </Container>
  );
}
