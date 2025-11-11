import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import { formatDuration } from "../utils/itineraryUtils";

const LayoverSegment = ({ duration, layoverCity }) => {
  const isOvernight = duration > 6 * 60;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 1,
        px: 2,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 1,
        my: 1,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <LuggageIcon sx={{ fontSize: 18, mr: 1.5, color: "text.secondary" }} />
      <Typography variant="body2" color="text.primary">
        {formatDuration(duration)} layover in <strong>{layoverCity}</strong>
        {isOvernight && (
          <Chip
            size="small"
            label="Overnight"
            sx={{ ml: 1, height: 20, bgcolor: "rgba(255,255,255,0.10)", color: "text.primary", fontWeight: 600 }}
          />
        )}
      </Typography>
    </Box>
  );
};

export default LayoverSegment;
