import React from "react";
import { Box, Stack, Paper, Typography, Chip, Divider } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import { formatDuration } from "../utils/itineraryUtils";

const FlightSegment = ({ segment, isLast }) => {
  const marketingCarrier = segment.marketingCarrier;

  return (
    <Box sx={{ display: "flex", pt: 1 }}>
      <Stack alignItems="center" sx={{ mr: 2 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <FlightTakeoffIcon sx={{ fontSize: 14, color: "background.default" }} />
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            height: "100px",
            borderRight: "2px dashed rgba(255,255,255,0.1)",
            mx: 1,
            my: 0.5,
          }}
        />

        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: isLast ? "success.main" : "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <FlightLandIcon sx={{ fontSize: 14, color: "background.default" }} />
        </Box>
      </Stack>

      <Box sx={{ flexGrow: 1, pb: 2 }}>
        <Paper elevation={0} sx={{ p: 1.5, mb: 1.5, bgcolor: "background.secondaryPaper" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="h6" component="div" fontWeight={600} color="primary.light">
                {dayjs(segment.departure).format("h:mm A")}
              </Typography>
              <Typography variant="body1">{segment.origin.parent?.name || segment.origin.name}</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {segment.origin.displayCode} • {dayjs(segment.departure).format("ddd, MMM D")}
              </Typography>
            </Box>
            <Chip
              label={formatDuration(segment.durationInMinutes)}
              size="medium"
              sx={{ bgcolor: "rgba(255,255,255,0.1)", fontWeight: 500 }}
              icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
            />
          </Box>
        </Paper>

        <Box sx={{ pl: 1, py: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {marketingCarrier?.name} • {segment.cabinClass || "Economy"}
          </Typography>
          <Typography variant="caption" color="primary.light" fontWeight={500}>
            Flight {marketingCarrier?.alternateId} {segment.flightNumber}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.disabled", mt: 0.5 }}>
            Aircraft: {segment.aircraft || "Unknown"} • {segment.stopCount || 0} Stop(s)
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 1.5, mt: 1.5, bgcolor: "background.secondaryPaper" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography
                variant="h6"
                component="div"
                fontWeight={600}
                color={dayjs(segment.arrival).day() !== dayjs(segment.departure).day() ? "warning.main" : "primary.light"}
              >
                {dayjs(segment.arrival).format("h:mm A")}
                {dayjs(segment.arrival).day() !== dayjs(segment.departure).day() && (
                  <sup style={{ fontSize: "0.6em", marginLeft: 4 }}>+1 day</sup>
                )}
              </Typography>
              <Typography variant="body1">{segment.destination.parent?.name || segment.destination.name}</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {segment.destination.displayCode} • {dayjs(segment.arrival).format("ddd, MMM D")}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default FlightSegment;
