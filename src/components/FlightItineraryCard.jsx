import React from "react";
import {
  Paper,
  Box,
  Grid,
  Avatar,
  Typography,
  Chip,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BedtimeIcon from "@mui/icons-material/Bedtime"; // Icon for overnight
import dayjs from "dayjs";
import FlightSegment from "./FlightSegment";
import LayoverSegment from "./LayoverSegment";
import { formatDuration, hasOvernight } from "../utils/itineraryUtils";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const renderDetailedItinerary = (itinerary) => {
  const segmentsAndLayovers = [];

  itinerary.legs.forEach((leg, legIndex) => {
    leg.segments.forEach((segment, segmentIndex) => {
      segmentsAndLayovers.push({
        type: "flight",
        data: {
          ...segment,
          marketingCarrier: leg.carriers.marketing[0],
          cabinClass: segment.cabinClass || "Economy",
        },
      });

      const isLastLeg = legIndex === itinerary.legs.length - 1;
      const isLastSegmentInLeg = segmentIndex === leg.segments.length - 1;

      if (!isLastLeg || !isLastSegmentInLeg) {
        let nextDeparture;
        let nextCity;

        if (!isLastSegmentInLeg) {
          nextDeparture = leg.segments[segmentIndex + 1].departure;
          nextCity = segment.destination.name;
        } else if (!isLastLeg) {
          return;
        }

        if (nextDeparture) {
          const arrivalTime = dayjs(segment.arrival);
          const nextDepartureTime = dayjs(nextDeparture);
          const durationInMinutes = nextDepartureTime.diff(
            arrivalTime,
            "minute"
          );

          segmentsAndLayovers.push({
            type: "layover",
            data: { duration: durationInMinutes, city: nextCity },
          });
        }
      }
    });
  });

  return (
    <Box sx={{ mt: 2 }}>
      {segmentsAndLayovers.map((item, index) => {
        if (item.type === "flight") {
          return (
            <FlightSegment
              key={`f-${index}`}
              segment={item.data}
              isLast={index === segmentsAndLayovers.length - 1}
            />
          );
        }
        if (item.type === "layover") {
          return (
            <LayoverSegment
              key={`l-${index}`}
              duration={item.data.duration}
              layoverCity={item.data.city}
            />
          );
        }
        return null;
      })}
    </Box>
  );
};

const FlightItineraryCard = ({ itinerary }) => {
  const departureLeg = itinerary.legs[0];
  const returnLeg = itinerary.legs[1];
  const totalDuration = formatDuration(departureLeg.durationInMinutes);
  const totalStops = departureLeg.stopCount;
  const carrierName = departureLeg.carriers.marketing[0].name.split(" ")[0];
  const departureTime = dayjs(departureLeg.departure);
  const arrivalTime = dayjs(departureLeg.arrival);
  const dayDifference = arrivalTime
    .startOf("day")
    .diff(departureTime.startOf("day"), "day");
  const arrivalTimeDisplay = arrivalTime.format("h:mm A");
  const departureTimeDisplay = departureTime.format("h:mm A");

  const dayIndicator = dayDifference > 0 ? `+${dayDifference}` : "";

  // Tooltip text for time
  const timeTooltip = `${departureTime.format(
    "MMM D, h:mm A"
  )} - ${arrivalTime.format("MMM D, h:mm A")} ${
    dayDifference > 0
      ? `(${dayDifference} day${dayDifference > 1 ? "s" : ""} travel time)`
      : "(Same day arrival)"
  }`;
  // ------------------------------------

  // Map operating carriers to get a unique list of names for display
  const operatingCarrierNames = [
    ...new Set(
      departureLeg.segments.map((s) => (s.operatingCarrier ? s.operatingCarrier.name.split(" ")[0] : ""))
    ),
  ].join(", ");

  // Build unique list of operator objects for logos in the summary
  const uniqueOperators = Object.values(
    departureLeg.segments.reduce((acc, s) => {
      const op = s.operatingCarrier || departureLeg.carriers?.marketing?.[0];
      const key = op?.alternateId || op?.id || op?.name || Math.random();
      if (op && !acc[key]) acc[key] = op;
      return acc;
    }, {})
  );

  const getOperatorLogo = (op) => {
    if (!op) return null;
    if (op.logoUrl) return op.logoUrl;
    if (op.alternateId)
      return `https://logos.skyscnr.com/images/airlines/favicon/${op.alternateId}.png`;
    return null;
  };

  const price = itinerary.price?.formatted || "N/A";
  // Find the first layover city and duration for display in the summary
  const firstLayover = departureLeg.segments.reduce(
    (acc, segment, index, array) => {
      if (acc) return acc;
      if (index < array.length - 1) {
        const arrivalTime = dayjs(segment.arrival);
        const nextDepartureTime = dayjs(array[index + 1].departure);
        const durationInMinutes = nextDepartureTime.diff(arrivalTime, "minute");
        if (durationInMinutes > 0) {
          return {
            duration: formatDuration(durationInMinutes),
            city: segment.destination.parent.name,
            country: segment.destination.country,
            name: segment.destination.name,
            airport: segment.destination.displayCode,
          };
        }
      }
      return acc;
    },
    null
  );

  const overnight = hasOvernight(itinerary);

  return (
    <Accordion
      disableGutters
      sx={{
        overflow: "hidden",
        background: "transparent",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        border: "1px solid rgba(255,255,255,0.4)",
        "&.Mui-expanded": {
          border: "1px solid rgba(255,255,255,0.1)",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <IconButton
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
        sx={{
          "&:hover": {
            cursor: "default",
          },
        }}
      >
        <Box sx={{ p: 1, width: "100%" }}>
          <Grid container display={'flex'} justifyContent={"space-between"} spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* If only one operator, show its logo; if multiple, show up to 3 overlapping avatars */}
                {uniqueOperators.length <= 1 ? (
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 40,
                      height: 40,
                      fontSize: "0.8rem",
                      transition: "width 150ms ease, height 150ms ease",
                      "@media (min-width:600px)": {
                        width: 50,
                        height: 50,
                      },
                    }}
                    variant="rounded"
                    src={getOperatorLogo(uniqueOperators[0]) || departureLeg.carriers.marketing[0]?.logoUrl}
                  >
                    {carrierName.charAt(0)}
                  </Avatar>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {uniqueOperators.slice(0, 3).map((op, i) => (
                      <Avatar
                        key={i}
                        src={getOperatorLogo(op)}
                        alt={op?.name}
                        sx={{
                          width: 32,
                          height: 32,
                          border: "2px solid rgba(0,0,0,0)",
                          ml: i === 0 ? 0 : -1.2,
                          zIndex: 10 - i,
                        }}
                      />
                    ))}
                  </Box>
                )}
                <Box>
                  <Tooltip title={timeTooltip} arrow>
                    <Typography variant="body1" fontWeight={500}>
                      {departureTimeDisplay} — {arrivalTimeDisplay}
                      {dayIndicator && (
                        <sup
                          component="span"
                          style={{
                            marginLeft: 2,
                            color: "text.secondary",
                            fontSize: "0.8em",
                          }}
                        >
                          {dayIndicator}
                        </sup>
                      )}
                    </Typography>
                  </Tooltip>
                  <Typography fontSize={11} color="text.secondary">
                    {operatingCarrierNames}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={8} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={12} sx={{ textAlign: { xs: "left", md: "center" } }}>
                  <Typography variant="body1" fontWeight={500}>
                    {totalDuration}
                  </Typography>
                  <Typography fontSize={11} color="text.secondary">
                    <Tooltip
                      title={`${departureLeg.origin.displayCode}: ${departureLeg.origin.city}, ${departureLeg.origin.country} to ${departureLeg.destination.displayCode}: ${departureLeg.destination.city}, ${departureLeg.destination.country}`}
                    >
                      {departureLeg.origin.displayCode} →{" "}
                      {departureLeg.destination.displayCode}
                    </Tooltip>
                  </Typography>
                </Grid>

                <Grid item xs={6} md={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "flex-start", md: "center" },
                      gap: 0.5,
                      mt: { xs: 0, md: 0 }
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {totalStops} stop{totalStops !== 1 ? "s" : ""}
                    </Typography>
                    {overnight && (
                      <Tooltip title="Overnight travel">
                        <WarningAmberIcon
                          fontSize="small"
                          sx={{ color: "warning.main" }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {totalStops > 0 ? (
                      firstLayover ? (
                        <Tooltip
                          title={`${firstLayover.name}, ${firstLayover.city}, ${firstLayover.country}`}
                          arrow
                        >
                          {firstLayover.duration} in {firstLayover.airport}
                        </Tooltip>
                      ) : (
                        "Layover details..."
                      )
                    ) : (
                      "Direct"
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={4} md={3}>
              <Box
                sx={{
                  textAlign: "right", 
                  pt: { xs: 0, md: 0 },
                  borderTop: "none", 
                  pl: { md: 2 },
                }}
              >
                <Typography variant="h5" fontWeight={400}>
                  {price}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              mb: 2,
              color: "primary.light",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              pb: 1,
            }}
          >
            <FlightTakeoffIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Outbound • {dayjs(departureLeg.departure).format("dddd, MMM D")}
          </Typography>
          {renderDetailedItinerary({ legs: [departureLeg] })}

          {returnLeg && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  mb: 2,
                  color: "primary.light",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  pb: 1,
                }}
              >
                <FlightLandIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Return • {dayjs(returnLeg.departure).format("dddd, MMM D")}
              </Typography>
              {renderDetailedItinerary({ legs: [returnLeg] })}
            </>
          )}
          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 1, color: "text.primary" }}
            >
              <AttachMoneyIcon
                sx={{ mr: 0.5, verticalAlign: "middle", color: "success.main" }}
              />{" "}
              Fare Conditions
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color={
                    itinerary.farePolicy?.isChangeAllowed
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {itinerary.farePolicy?.isChangeAllowed
                    ? "✓ Changes Allowed"
                    : "✗ No Changes"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color={
                    itinerary.farePolicy?.isCancellationAllowed
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {itinerary.farePolicy?.isCancellationAllowed
                    ? "✓ Cancellation Allowed"
                    : "✗ No Cancellation"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color={
                    itinerary.farePolicy?.isPartiallyRefundable
                      ? "warning.main"
                      : "text.secondary"
                  }
                >
                  {itinerary.farePolicy?.isPartiallyRefundable
                    ? "⚠️ Partial Refund"
                    : "Non-refundable"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color={
                    itinerary.isSelfTransfer ? "error.main" : "success.main"
                  }
                >
                  {itinerary.isSelfTransfer
                    ? "⚠️ Self Transfer"
                    : "Protected Transfer"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 1,
              p: 1,
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: 1,
            }}
          >
            Disclaimer: Prices are a total estimated cost for{" "}
            {itinerary.legs.length === 2 ? "round-trip" : "one-way"} travel.
            Fare rules and baggage allowances may vary by carrier.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FlightItineraryCard;