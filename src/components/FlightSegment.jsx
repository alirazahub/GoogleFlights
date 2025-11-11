import React from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import { formatDuration } from "../utils/itineraryUtils";

const FlightSegment = ({ segment, isLast }) => {
  const marketingCarrier = segment.marketingCarrier;
  const operator = segment.operatingCarrier || marketingCarrier;
  const operatorLogoUrl =
    operator?.logoUrl ||
    (operator?.alternateId
      ? `https://logos.skyscnr.com/images/airlines/favicon/${operator.alternateId}.png`
      : null);

  return (
    <Box sx={{ display: "flex" }}>
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
          <FlightTakeoffIcon
            sx={{ fontSize: 14, color: "background.default" }}
          />
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

      <Box sx={{ flexGrow: 1 }}>
        <Paper
          elevation={0}
          sx={{ p: 1, mb: 1.5, bgcolor: "background.secondaryPaper" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                fontSize={16}
                component="div"
                fontWeight={500}
                color="primary.light"
              >
                {dayjs(segment.departure).format("h:mm A")} •{" "}
                {dayjs(segment.departure).format("ddd, MMM D")}
              </Typography>
              <Typography fontSize={12} sx={{ color: "text.secondary" }}>
                {segment.origin.name} ({segment.origin.displayCode}) -{" "}
                {segment.origin.parent.name}, {segment.origin.country}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={formatDuration(segment.durationInMinutes)}
                size="medium"
                sx={{ bgcolor: "rgba(255,255,255,0.1)", fontWeight: 500 }}
                icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
              />
              <Avatar
                src={operatorLogoUrl}
                alt={operator?.name}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "primary.main",
                  fontWeight: 600,
                }}
              >
                {operator?.name?.charAt(0) || operator?.alternateId || "A"}
              </Avatar>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ pl: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {operator?.name}
            {marketingCarrier && marketingCarrier.name && marketingCarrier.name !== operator?.name && (
              <span style={{ color: "rgba(255,255,255,0.6)", marginLeft: 6, fontSize: "0.85em" }}>
                (Marketing: {marketingCarrier.name})
              </span>
            )}{" "}• {segment.cabinClass || "Economy"}
          </Typography>
          <Typography variant="caption" color="primary.light" fontWeight={500}>
            Flight {segment.flightNumber}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{ p: 1, mt: 1, bgcolor: "background.secondaryPaper" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                fontSize={16}
                fontWeight={500}
                color={
                  dayjs(segment.arrival).day() !==
                  dayjs(segment.departure).day()
                    ? "warning.main"
                    : "primary.light"
                }
              >
                {dayjs(segment.arrival).format("h:mm A")} •{" "}
                {dayjs(segment.arrival).format("ddd, MMM D")}
                {dayjs(segment.arrival).day() !==
                  dayjs(segment.departure).day() && (
                  <sup style={{ fontSize: "0.6em", marginLeft: 4 }}>+1 day</sup>
                )}
              </Typography>
              <Typography fontSize={12} sx={{ color: "text.secondary" }}>
                {" "}
                {console.log(segment)}
                {segment.destination.name} ({segment.destination.displayCode}) -{" "}
                {segment.destination.parent.name}, {segment.destination.country}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default FlightSegment;
