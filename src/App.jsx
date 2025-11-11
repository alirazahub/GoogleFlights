import React from "react";
import {
  Typography,
  Box,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  FormControl,
  Grid,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
  Paper,
  Avatar,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand"; // 💡 NEW IMPORT
import LuggageIcon from "@mui/icons-material/Luggage"; // 💡 NEW IMPORT
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// --- Date Picker Imports ---
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
// ---------------------------

// 💡 IMPORT YOUR REAL API FUNCTIONS HERE
import { searchAirports, searchFlights } from "./apis"; 

// --- MOCK LOCATION PLACEHOLDERS ---
const INITIAL_LONDON = {
  skyId: "LOND",
  entityId: "27544008",
  localizedName: "London (Any)",
  suggestionTitle: "London (Any)",
  subtitle: "United Kingdom",
};

const INITIAL_NEW_YORK = {
  skyId: "NYCA",
  entityId: "27537542",
  localizedName: "New York (Any)",
  suggestionTitle: "New York (Any)",
  subtitle: "United States",
};
// ---------------------------------------------


// 2. Define the Dark Theme (Unchanged)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#202124",
      paper: "#2c2c30",
      secondaryPaper: "#3a3a3e", // Added for subtle contrast
    },
    primary: {
      main: "#8ab4f8",
    },
    success: { // Added for fare policies
        main: "#6AA84F",
    },
    error: { // Added for fare policies
        main: "#CC0000",
    },
    warning: { // Added for self-transfer/partial refund
        main: "#FFCC00",
    }
  },
  typography: {
    h4: {
      color: "#e8eaed",
    },
    subtitle1: {
      color: "#bdc1c6",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "background.paper",
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "search" },
          style: {
            backgroundColor: "#8ab4f8",
            color: "#202124",
            "&:hover": {
              backgroundColor: "#6c9ce3",
            },
            borderRadius: 24,
            padding: "12px 30px",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c2c30",
        },
      },
    },
  },
});

// Utility function to format duration in minutes
const formatDuration = (minutes) => {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

// 💡 IMPROVED Component to display a single flight segment/leg
// 💡 UPDATED Flight Segment Component
const FlightSegment = ({ segment, isFirst, isLast }) => {
  const marketingCarrier = segment.marketingCarrier;

  return (
    <Box sx={{ display: 'flex', pt: 1 }}>
        {/* Timeline Column */}
        <Stack alignItems="center" sx={{ mr: 2 }}>
            <Box 
                sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 2 
                }}
            >
                <FlightTakeoffIcon sx={{ fontSize: 14, color: 'background.default' }} />
            </Box>
            
            {/* Dashed Line representing the flight path */}
            <Divider 
                orientation="vertical" 
                flexItem 
                sx={{ 
                    height: '100px', // Fixed height for visual consistency
                    borderRight: '2px dashed rgba(255,255,255,0.1)', // Softer dashed line
                    mx: 1, 
                    my: 0.5,
                }} 
            />
            
            <Box 
                sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: isLast ? 'success.main' : 'primary.main', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 2 
                }}
            >
                <FlightLandIcon sx={{ fontSize: 14, color: 'background.default' }} /> 
            </Box>
        </Stack>

        {/* Content Column */}
        <Box sx={{ flexGrow: 1, pb: 2 }}>
            {/* Departure Info */}
            <Paper elevation={0} sx={{ p: 1.5, mb: 1.5, bgcolor: 'background.secondaryPaper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600} color="primary.light">
                            {dayjs(segment.departure).format("h:mm A")}
                        </Typography>
                        <Typography variant="body1">
                            {segment.origin.parent?.name || segment.origin.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {segment.origin.displayCode} • {dayjs(segment.departure).format("ddd, MMM D")}
                        </Typography>
                    </Box>
                    <Chip 
                        label={formatDuration(segment.durationInMinutes)} 
                        size="medium" 
                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', fontWeight: 500 }} // Softer chip
                        icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                    />
                </Box>
            </Paper>

            {/* Flight Details Summary */}
            <Box sx={{ pl: 1, py: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                    {marketingCarrier?.name} • {segment.cabinClass || 'Economy'}
                </Typography>
                <Typography variant="caption" color="primary.light" fontWeight={500}>
                    Flight {marketingCarrier?.alternateId} {segment.flightNumber}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', mt: 0.5 }}>
                    Aircraft: {segment.aircraft || 'Unknown'} • {segment.stopCount || 0} Stop(s)
                </Typography>
            </Box>
            
            {/* Arrival Info */}
            <Paper elevation={0} sx={{ p: 1.5, mt: 1.5, bgcolor: 'background.secondaryPaper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600} color={dayjs(segment.arrival).day() !== dayjs(segment.departure).day() ? 'warning.main' : 'primary.light'}>
                            {dayjs(segment.arrival).format("h:mm A")}
                            {dayjs(segment.arrival).day() !== dayjs(segment.departure).day() && (
                                <sup style={{ fontSize: '0.6em', marginLeft: 4 }}>+1 day</sup>
                            )}
                        </Typography>
                        <Typography variant="body1">
                            {segment.destination.parent?.name || segment.destination.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {segment.destination.displayCode} • {dayjs(segment.arrival).format("ddd, MMM D")}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    </Box>
  );
};


// 💡 IMPROVED Component to display layover details
// 💡 UPDATED Layover Segment Component
const LayoverSegment = ({ duration, layoverCity }) => {
  const isOvernight = duration > 6 * 60; 
  return (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 1, 
        px: 2, 
        backgroundColor: 'rgba(255,255,255,0.03)', // Subtle gray background
        borderRadius: 1, 
        my: 1,
        border: '1px solid rgba(255,255,255,0.06)', // Subtle gray border
    }}>
      <LuggageIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} />
      <Typography variant="body2" color="text.primary">
        {formatDuration(duration)} layover in <strong>{layoverCity}</strong>
        {isOvernight && (
          <Chip
            size="small"
            label="Overnight"
            sx={{ ml: 1, height: 20, bgcolor: 'rgba(255,255,255,0.10)', color: 'text.primary', fontWeight: 600 }}
          />
        )}
      </Typography>
    </Box>
  );
};

// Combined Flight Leg and Layover renderer (Unchanged logic, uses new components)
const renderDetailedItinerary = (itinerary) => {
    // Collect all segments and layovers into a single sequential array
    const segmentsAndLayovers = [];

    itinerary.legs.forEach((leg, legIndex) => {
        leg.segments.forEach((segment, segmentIndex) => {
            // Add the flight segment
            segmentsAndLayovers.push({
                type: 'flight',
                data: {
                    ...segment,
                    // Use carrier details from leg if not in segment (API inconsistency handler)
                    marketingCarrier: leg.carriers.marketing[0], // Assuming one carrier per leg
                    cabinClass: segment.cabinClass || 'Economy',
                },
            });

            // Calculate and add layover if this isn't the last segment of the entire itinerary
            const isLastLeg = legIndex === itinerary.legs.length - 1;
            const isLastSegmentInLeg = segmentIndex === leg.segments.length - 1;

            if (!isLastLeg || !isLastSegmentInLeg) {
                let nextDeparture;
                let nextCity;

                if (!isLastSegmentInLeg) {
                    // Layover within the same leg (e.g., flight with 2 stops)
                    nextDeparture = leg.segments[segmentIndex + 1].departure;
                    nextCity = segment.destination.name;
                } else if (!isLastLeg) {
                    // Layover between two different legs (skipped for simplicity in this display)
                    return; 
                }

                if (nextDeparture) {
                    const arrivalTime = dayjs(segment.arrival);
                    const nextDepartureTime = dayjs(nextDeparture);
                    const durationInMinutes = nextDepartureTime.diff(arrivalTime, 'minute');

                    segmentsAndLayovers.push({
                        type: 'layover',
                        data: {
                            duration: durationInMinutes,
                            city: nextCity,
                        },
                    });
                }
            }
        });
    });

    return (
        <Box sx={{ mt: 2 }}>
            {segmentsAndLayovers.map((item, index) => {
                if (item.type === 'flight') {
                    return (
                        <FlightSegment
                            key={`f-${index}`}
                            segment={item.data}
                            isFirst={index === 0}
                            isLast={index === segmentsAndLayovers.length - 1}
                        />
                    );
                } else if (item.type === 'layover') {
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

    // Helper to determine if an itinerary has an overnight condition
    const hasOvernight = (itinerary) => {
      try {
        // Look through legs and segments to find any layover > 6 hours or segment that arrives next day
        for (const leg of itinerary.legs || []) {
          for (let i = 0; i < (leg.segments || []).length; i++) {
            const seg = leg.segments[i];
            // arrival vs departure day difference
            if (dayjs(seg.arrival).day() !== dayjs(seg.departure).day()) return true;

            // layover to next segment in same leg
            if (i < leg.segments.length - 1) {
              const next = leg.segments[i + 1];
              const minutes = dayjs(next.departure).diff(dayjs(seg.arrival), 'minute');
              if (minutes > 6 * 60) return true;
            }
          }
        }
      } catch (e) {
        console.error('hasOvernight check failed', e);
      }
      return false;
    };


// Main Flight Itinerary Card (Top Level - Minimal Changes to enhance display)
// 💡 UPDATED FlightItineraryCard Component
const FlightItineraryCard = ({ itinerary }) => {
    const [expanded, setExpanded] = React.useState(false);
    
    // ... data extraction logic remains the same ...
    const departureLeg = itinerary.legs[0];
    const returnLeg = itinerary.legs[1]; 
    const totalDuration = formatDuration(departureLeg.durationInMinutes);
    const totalStops = departureLeg.stopCount;
    const carrierName = departureLeg.carriers.marketing[0].name.split(' ')[0];
    const price = itinerary.price?.formatted || 'N/A';
    const emissionSavings = itinerary.eco?.ecoContenderDelta ? Math.round(itinerary.eco.ecoContenderDelta) : 2234; 
    const emissionPercent = emissionSavings > 0 ? `+${Math.round((emissionSavings / 2234) * 100)}%` : '+65%';
  
    return (
      <Paper
        elevation={6} // Slightly lower elevation
        sx={{
          my: 2,
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'transform 180ms ease, box-shadow 180ms ease',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)' },
          border: `1px solid ${expanded ? darkTheme.palette.primary.main : 'rgba(255,255,255,0.05)'}`,
        }}
      >
        {/* Top Header Row (Departure + Price) */}
        <Box
          sx={{
            p: 3,
            background: expanded ? 'rgba(100, 181, 246, 0.05)' : 'none', // Highlight background if expanded
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontWeight: 600 }} // Reduced bolding
                  src={departureLeg.carriers.marketing[0].logoUrl}
                >
                  {carrierName?.charAt(0) || 'A'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700}> {/* Reduced bolding */}
                    {dayjs(departureLeg.departure).format('h:mm A')} — {dayjs(departureLeg.arrival).format('h:mm A')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {departureLeg.origin.city} → {departureLeg.destination.city}
                  </Typography>
                  {/* Neutral, low-contrast chips (grayscale) */}
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Chip label={totalDuration} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: 'text.primary', fontWeight: 500 }} />
                        <Chip label={`${totalStops} stop${totalStops !== 1 ? 's' : ''}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: 'text.primary', fontWeight: 600 }} />
                        {hasOvernight(itinerary) && (
                          <Chip size="small" label="Overnight" sx={{ ml: 0.5, height: 24, bgcolor: 'rgba(255,255,255,0.10)', color: 'text.primary', fontWeight: 700 }} />
                        )}
                        {itinerary.tags && itinerary.tags.map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag.replace(/_/g, ' ')} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.04)',
                              color: 'text.primary',
                              fontWeight: 500
                            }} 
                          />
                        ))}
                      </Box>
                </Box>
              </Box>
            </Grid>
  
            <Grid item xs={8} md={3}>
              <Box sx={{ textAlign: { xs: 'left', md: 'center' }, borderLeft: { md: '1px solid rgba(255,255,255,0.1)' }, pl: { md: 3 } }}>
                <Typography variant="subtitle2" color="warning.main" fontWeight={600}> {/* Changed to warning.main */}
                  {emissionSavings} kg CO2e
                </Typography>
                <Typography variant="caption" color="text.secondary">{emissionPercent} vs avg</Typography>
              </Box>
            </Grid>
  
            <Grid item xs={4} md={2}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', md: 'flex-end' }, alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" color="success.main" fontWeight={700}>{price}</Typography>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                </Box>
  
                <Button variant="contained" size="medium" color="primary" sx={{ borderRadius: 24, px: 2, py: 1, fontWeight: 600, minWidth: 90 }}>
                  Select
                </Button>
  
                <Typography component="span" sx={{ ml: 1, fontSize: 16, color: 'primary.light', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>
                  {expanded ? '▲' : '▼'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
  
        {/* Detailed Timeline View (Expansion) */}
        {expanded && (
          <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Outbound Flight */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'primary.light', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
              <FlightTakeoffIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Outbound • {dayjs(departureLeg.departure).format('dddd, MMM D')}
            </Typography>
            {renderDetailedItinerary({ legs: [departureLeg] })}
  
            {/* Return Flight for round trips */}
            {returnLeg && (
              <>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'primary.light', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                  <FlightLandIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Return • {dayjs(returnLeg.departure).format('dddd, MMM D')}
                </Typography>
                {renderDetailedItinerary({ legs: [returnLeg] })}
              </>
            )}
  
            <Divider sx={{ my: 3 }} />
  
            {/* Fare Policy from actual data */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                <AttachMoneyIcon sx={{ mr: 0.5, verticalAlign: 'middle', color: 'success.main' }} /> Fare Conditions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color={itinerary.farePolicy?.isChangeAllowed ? 'success.main' : 'error.main'}>
                    {itinerary.farePolicy?.isChangeAllowed ? '✓ Changes Allowed' : '✗ No Changes'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color={itinerary.farePolicy?.isCancellationAllowed ? 'success.main' : 'error.main'}>
                    {itinerary.farePolicy?.isCancellationAllowed ? '✓ Cancellation Allowed' : '✗ No Cancellation'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color={itinerary.farePolicy?.isPartiallyRefundable ? 'warning.main' : 'text.secondary'}>
                    {itinerary.farePolicy?.isPartiallyRefundable ? '⚠️ Partial Refund' : 'Non-refundable'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color={itinerary.isSelfTransfer ? 'error.main' : 'success.main'}>
                    {itinerary.isSelfTransfer ? '⚠️ Self Transfer' : 'Protected Transfer'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
  
            {/* Footer Notes */}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, p: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
              Disclaimer: Prices are a total estimated cost for {itinerary.legs.length === 2 ? 'round-trip' : 'one-way'} travel. Fare rules and baggage allowances may vary by carrier.
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };


// The rest of the App component remains the same.
const App = () => {
    // --- All states remain the same ---
    const [tripType, setTripType] = React.useState("round");
    const [passengers, setPassengers] = React.useState(1);
    const [cabinClass, setCabinClass] = React.useState("economy");
    const [departure, setDeparture] = React.useState(INITIAL_LONDON);
    const [destination, setDestination] = React.useState(INITIAL_NEW_YORK);
    const [departureDate, setDepartureDate] = React.useState(dayjs().add(1, 'day'));
    const [returnDate, setReturnDate] = React.useState(dayjs().add(8, "day"));
  
    const [departureOptions, setDepartureOptions] = React.useState([]);
    const [destinationOptions, setDestinationOptions] = React.useState([]);
    const [loadingDeparture, setLoadingDeparture] = React.useState(false);
    const [loadingDestination, setLoadingDestination] = React.useState(false);
  
    const [isSearching, setIsSearching] = React.useState(false);
    const [flightResults, setFlightResults] = React.useState(null);
    const [searchParams, setSearchParams] = React.useState(null);
  
  
    const fetchAirportSuggestions = async (
      query,
      setOptionsState,
      setLoadingState
    ) => {
      if (query.length < 2) {
        setOptionsState([]);
        return;
      }
  
      setLoadingState(true);
  
      try {
        const apiResponse = await searchAirports(query);
        
        const formattedData = apiResponse.data.map((item) => ({
          skyId: item.navigation.relevantFlightParams?.skyId || item.navigation.entityId,
          entityId: item.navigation.entityId,
          localizedName: item.navigation.localizedName,
          suggestionTitle: item.presentation.suggestionTitle,
          subtitle: item.presentation.subtitle,
        }));
  
        setOptionsState(formattedData);
      } catch (error) {
        console.error("Airport search failed:", error);
        setOptionsState([]);
      } finally {
        setLoadingState(false);
      }
    };
  
  
    const handleSearch = async () => {
      if (!departure || !destination || !departureDate || !departure.skyId || !departure.entityId) {
        alert("Please select both Departure and Destination locations with valid data.");
        return;
      }
  
      const params = {
        origId: departure.skyId,
        destId: destination.skyId,
        origEId: departure.entityId,
        destEId: destination.entityId,
        date: departureDate.format("YYYY-MM-DD"),
        cabinClass: cabinClass,
        adults: passengers.toString(),
        returnDate: tripType === "round" && returnDate ? returnDate.format("YYYY-MM-DD") : undefined,
      };
  
      console.log("Calling API with parameters:", params);
      setSearchParams(params);
      setIsSearching(true);
      setFlightResults(null);
  
      try {
        const apiResponse = await searchFlights(params);
        setFlightResults(apiResponse);
      } catch (error) {
        console.error("Flight search failed:", error);
        setFlightResults({ status: false, error: "Flight search failed. Check console for details." });
      } finally {
        setIsSearching(false);
      }
    };
  
    const datePickerGridSize = 3;
  
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Container maxWidth="lg">
            {/* Hero Section */}
            <Box textAlign="center" mt={4}>
              <img
                src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg"
                alt="Travel Hero Illustration"
                style={{ width: "100%", maxWidth: "500px", height: "auto" }}
              />
              <Typography
                style={{ marginTop: "-100px" }}
                variant="h2"
                component="h1"
                gutterBottom
              >
                Flights
              </Typography>
            </Box>
  
            <Container maxWidth="lg">
              {/* Search Form (Unchanged) */}
              <Box
                sx={{
                  bgcolor: "background.paper",
                  padding: 4,
                  borderRadius: 2,
                  boxShadow: 3,
                  mb: 4,
                }}
              >
                <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField select size="small" fullWidth label="Trip" value={tripType} onChange={(e) => setTripType(e.target.value)} name="tripType" SelectProps={{ native: true }}>
                      <option value="oneway">One-way</option>
                      <option value="round">Round-trip</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField select size="small" fullWidth label="Passengers" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} name="passengers" SelectProps={{ native: true }} sx={{ minWidth: 90 }}>
                      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (<option key={n} value={n}>{n}</option>))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField select size="small" fullWidth label="Cabin" value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} name="cabinClass" SelectProps={{ native: true }}>
                      <option value="economy">Economy</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First</option>
                    </TextField>
                  </Grid>
                </Grid>
                <Box sx={{ width: "100%", borderBottom: "1px solid rgba(255,255,255,0.12)", my: 2 }} />
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  {/* DEPARTURE Autocomplete */}
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl sx={{ minWidth: 245 }}>
                      <Autocomplete
                        options={departureOptions} loading={loadingDeparture}
                        getOptionLabel={(option) => option.suggestionTitle || option.localizedName || ""}
                        isOptionEqualToValue={(option, value) => option.skyId === value.skyId}
                        value={departure} onChange={(event, newValue) => { setDeparture(newValue); }}
                        onInputChange={(event, newInputValue) => { fetchAirportSuggestions(newInputValue, setDepartureOptions, setLoadingDeparture); }}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} key={option.skyId}><Box><Typography variant="body1" fontWeight="bold">{option.suggestionTitle}</Typography><Typography variant="caption" color="text.secondary">{option.subtitle}</Typography></Box></Box>
                        )}
                        renderInput={(params) => (<TextField {...params} label="Departure" InputProps={{ ...params.InputProps, endAdornment: (<React.Fragment>{loadingDeparture ? (<CircularProgress color="inherit" size={20} />) : null}{params.InputProps.endAdornment}</React.Fragment>), }} />)}
                      />
                    </FormControl>
                  </Grid>
  
                  {/* DESTINATION Autocomplete */}
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl sx={{ minWidth: 245 }}>
                      <Autocomplete
                        options={destinationOptions} loading={loadingDestination}
                        getOptionLabel={(option) => option.suggestionTitle || option.localizedName || ""}
                        isOptionEqualToValue={(option, value) => option.skyId === value.skyId}
                        value={destination} onChange={(event, newValue) => { setDestination(newValue); }}
                        onInputChange={(event, newInputValue) => { fetchAirportSuggestions(newInputValue, setDestinationOptions, setLoadingDestination); }}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} key={option.skyId}><Box><Typography variant="body1" fontWeight="bold">{option.suggestionTitle}</Typography><Typography variant="caption" color="text.secondary">{option.subtitle}</Typography></Box></Box>
                        )}
                        renderInput={(params) => (<TextField {...params} label="Destination" InputProps={{ ...params.InputProps, endAdornment: (<React.Fragment>{loadingDestination ? (<CircularProgress color="inherit" size={20} />) : null}{params.InputProps.endAdornment}</React.Fragment>), }} />)}
                      />
                    </FormControl>
                  </Grid>
  
                  {/* Departure Date Picker */}
                  <Grid item xs={12} sm={6} md={datePickerGridSize}>
                    <DatePicker label="Date" minDate={dayjs().add(1, 'day')} value={departureDate} onChange={(newValue) => setDepartureDate(newValue)} slotProps={{ textField: { fullWidth: true } }} />
                  </Grid>
  
                  {/* Return Date Picker - VISIBLE BUT RESERVING SPACE */}
                  <Grid item xs={12} sm={6} md={datePickerGridSize} sx={{ visibility: tripType === "oneway" ? "hidden" : "visible" }}>
                    <DatePicker label="Return Date" minDate={departureDate} value={returnDate} onChange={(newValue) => setReturnDate(newValue)} slotProps={{ textField: { fullWidth: true } }} />
                  </Grid>
                </Grid>
  
                {/* Search Button */}
                <div style={{ marginTop: "30px", textAlign: "center" }}>
                  <Button variant="search" size="large" startIcon={isSearching ? (<CircularProgress size={24} color="inherit" />) : (<SearchIcon />)} onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? "Searching..." : "Search Flights"}
                  </Button>
                </div>
              </Box>
  
              {/* --- FLIGHT SEARCH RESULTS SECTION --- */}
              {isSearching && (
                <Box textAlign="center" my={4}>
                  <CircularProgress color="primary" />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Searching for the best flights...
                  </Typography>
                </Box>
              )}
  
              {flightResults && !isSearching && (
                <Box mt={4}>
                  {flightResults.status === false && flightResults.error ? (
                    <Paper sx={{ p: 3, backgroundColor: 'red', color: 'white' }}>
                      <Typography variant="h6">Error:</Typography>
                      <Typography>{flightResults.error}</Typography>
                    </Paper>
                  ) : (
                    <>
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        Best Itineraries ({flightResults.data?.context?.totalResults || 0} results found)
                      </Typography>
  
                      {flightResults.data?.itineraries?.length > 0
                        ? flightResults.data.itineraries.slice(0, 5).map((itinerary, index) => (
                            <FlightItineraryCard key={index} itinerary={itinerary} />
                          ))
                        : <Typography>No flight itineraries found for these parameters.</Typography>
                      }
                    </>
                  )}
                </Box>
              )}
              {/* --- END FLIGHT SEARCH RESULTS SECTION --- */}
            </Container>
          </Container>
        </LocalizationProvider>
      </ThemeProvider>
    );
  };
  
export default App;