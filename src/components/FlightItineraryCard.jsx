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
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from "dayjs";
import FlightSegment from "./FlightSegment";
import LayoverSegment from "./LayoverSegment";
import { formatDuration, hasOvernight } from "../utils/itineraryUtils";

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
          const durationInMinutes = nextDepartureTime.diff(arrivalTime, "minute");

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
          return <FlightSegment key={`f-${index}`} segment={item.data} isLast={index === segmentsAndLayovers.length - 1} />;
        }
        if (item.type === "layover") {
          return <LayoverSegment key={`l-${index}`} duration={item.data.duration} layoverCity={item.data.city} />;
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
  const price = itinerary.price?.formatted || "N/A";
  const emissionSavings = itinerary.eco?.ecoContenderDelta ? Math.round(itinerary.eco.ecoContenderDelta) : 2234;
  const emissionPercent = emissionSavings > 0 ? `+${Math.round((emissionSavings / 2234) * 100)}%` : "+65%";
  return (
    <Accordion
      elevation={6}
      sx={{
        my: 2,
        borderRadius: 2,
        overflow: "hidden",
        background: '#2c2c30',
        transition: "transform 180ms ease, box-shadow 180ms ease",
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)' },
        border: '1px solid rgba(255,255,255,0.05)',
        '&.Mui-expanded': {
          border: '1px solid rgba(255,255,255,0.1)',
          background: '#2c2c30'
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.light' }} />}
        sx={{ p: 0 }}
      >
        <Box sx={{ p: 3, width: '100%' }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, fontWeight: 600 }} src={departureLeg.carriers.marketing[0].logoUrl}>
                  {carrierName?.charAt(0) || "A"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {dayjs(departureLeg.departure).format("h:mm A")} — {dayjs(departureLeg.arrival).format("h:mm A")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {departureLeg.origin.city} → {departureLeg.destination.city}
                  </Typography>
                  <Box sx={{ mt: 0.5, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                    <Chip label={totalDuration} size="small" sx={{ bgcolor: "rgba(255,255,255,0.06)", color: "text.primary", fontWeight: 500 }} />
                    <Chip label={`${totalStops} stop${totalStops !== 1 ? "s" : ""}`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.06)", color: "text.primary", fontWeight: 600 }} />
                    {hasOvernight(itinerary) && <Chip size="small" label="Overnight" sx={{ ml: 0.5, height: 24, bgcolor: "rgba(200,1,2,10)", color: "text.error", fontWeight: 700 }} />}
                    {itinerary.tags && itinerary.tags.map((tag, index) => <Chip key={index} label={tag.replace(/_/g, " ")} size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "text.primary", fontWeight: 500 }} />)}
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={8} md={3}>
              <Box sx={{ textAlign: { xs: "left", md: "center" }, borderLeft: { md: "1px solid rgba(255,255,255,0.1)" }, pl: { md: 3 } }}>
                <Typography variant="subtitle2" color="warning.main" fontWeight={600}>
                  {emissionSavings} kg CO2e
                </Typography>
                <Typography variant="caption" color="text.secondary">{emissionPercent} vs avg</Typography>
              </Box>
            </Grid>

            <Grid item xs={4} md={2}>
              <Box sx={{ display: "flex", justifyContent: { xs: "flex-end", md: "flex-end" }, alignItems: "center", gap: 2 }}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="h5" color="success.main" fontWeight={700}>{price}</Typography>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.light", borderBottom: "1px solid rgba(255,255,255,0.1)", pb: 1 }}>
            <FlightTakeoffIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Outbound • {dayjs(departureLeg.departure).format("dddd, MMM D")}
          </Typography>
          {renderDetailedItinerary({ legs: [departureLeg] })}

          {returnLeg && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.light", borderBottom: "1px solid rgba(255,255,255,0.1)", pb: 1 }}>
                <FlightLandIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Return • {dayjs(returnLeg.departure).format("dddd, MMM D")}
              </Typography>
              {renderDetailedItinerary({ legs: [returnLeg] })}
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: "text.primary" }}>
              <AttachMoneyIcon sx={{ mr: 0.5, verticalAlign: "middle", color: "success.main" }} /> Fare Conditions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color={itinerary.farePolicy?.isChangeAllowed ? "success.main" : "error.main"}>
                  {itinerary.farePolicy?.isChangeAllowed ? "✓ Changes Allowed" : "✗ No Changes"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color={itinerary.farePolicy?.isCancellationAllowed ? "success.main" : "error.main"}>
                  {itinerary.farePolicy?.isCancellationAllowed ? "✓ Cancellation Allowed" : "✗ No Cancellation"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color={itinerary.farePolicy?.isPartiallyRefundable ? "warning.main" : "text.secondary"}>
                  {itinerary.farePolicy?.isPartiallyRefundable ? "⚠️ Partial Refund" : "Non-refundable"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color={itinerary.isSelfTransfer ? "error.main" : "success.main"}>
                  {itinerary.isSelfTransfer ? "⚠️ Self Transfer" : "Protected Transfer"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3, p: 1, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
            Disclaimer: Prices are a total estimated cost for {itinerary.legs.length === 2 ? "round-trip" : "one-way"} travel. Fare rules and baggage allowances may vary by carrier.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FlightItineraryCard;
