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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// --- Date Picker Imports ---
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
// ---------------------------

// 💡 IMPORT YOUR REAL API FUNCTIONS HERE
// Assuming your provided functions are in a file named 'apis.js'
import { searchAirports, searchFlights } from "./apis"; 

// --- MOCK LOCATION PLACEHOLDERS (For initial state only, real data will replace them) ---
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
    },
    primary: {
      main: "#8ab4f8",
    },
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

const App = () => {
  // --- Search Input States ---
  const [tripType, setTripType] = React.useState("round");
  const [passengers, setPassengers] = React.useState(1);
  const [cabinClass, setCabinClass] = React.useState("economy");
  const [departure, setDeparture] = React.useState(INITIAL_LONDON);
  const [destination, setDestination] = React.useState(INITIAL_NEW_YORK);
  const [departureDate, setDepartureDate] = React.useState(
    dayjs().add(1, 'day') // Default to tomorrow or a valid date
  );
  const [returnDate, setReturnDate] = React.useState(dayjs().add(8, "day"));

  // Autocomplete state
  const [departureOptions, setDepartureOptions] = React.useState([]);
  const [destinationOptions, setDestinationOptions] = React.useState([]);
  const [loadingDeparture, setLoadingDeparture] = React.useState(false);
  const [loadingDestination, setLoadingDestination] = React.useState(false);

  // --- Search Results States ---
  const [isSearching, setIsSearching] = React.useState(false);
  const [flightResults, setFlightResults] = React.useState(null);
  const [searchParams, setSearchParams] = React.useState(null);

  /**
   * ✈️ REAL API CALL: Fetches airport suggestions using the provided searchAirports function.
   */
  const fetchAirportSuggestions = async (
    query,
    setOptionsState,
    setLoadingState
  ) => {
    // 1. Clear options if query is too short or empty
    if (query.length < 2) {
      setOptionsState([]);
      return;
    }

    setLoadingState(true);

    try {
      const apiResponse = await searchAirports(query);
      
      // Map the response data to the desired format for the Autocomplete component
      const formattedData = apiResponse.data.map((item) => ({
        // Use relevantFlightParams for specific IDs if available, otherwise use entity IDs
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


  /**
   * ✈️ REAL API CALL: Performs the flight search using the provided searchFlights function.
   */
  const handleSearch = async () => {
    if (!departure || !destination || !departureDate || !departure.skyId || !departure.entityId) {
      alert("Please select both Departure and Destination locations with valid data.");
      return;
    }

    // 1. Construct the Parameters
    const params = {
      origId: departure.skyId,
      destId: destination.skyId,
      origEId: departure.entityId,
      destEId: destination.entityId,
      date: departureDate.format("YYYY-MM-DD"),
      // The API you provided doesn't explicitly show a return date parameter, 
      // so we'll pass the core required ones. For a round trip, 
      // you would typically need a separate search or a dedicated parameter.
      // For this implementation, we focus on the searchFlights signature you provided.
      cabinClass: cabinClass,
      adults: passengers.toString(),
    };

    console.log("Calling API with parameters:", params);
    setSearchParams(params); // Save parameters for display
    setIsSearching(true);
    setFlightResults(null);

    try {
      // 2. Call the REAL API function
      const apiResponse = await searchFlights(params);

      // 3. Set Results
      setFlightResults(apiResponse);
    } catch (error) {
      console.error("Flight search failed:", error);
      setFlightResults({ status: false, error: "Flight search failed. Check console for details." });
    } finally {
      setIsSearching(false);
    }
  };

  // --- Utility Render Functions (Modified to handle real-time date/time parsing) ---

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  const renderFlightLeg = (leg, index) => (
    <Box
      key={index}
      sx={{
        p: 2,
        borderRadius: 1,
        border: "1px solid rgba(255,255,255,0.1)",
        my: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
      }}
    >
      <Typography variant="body2" color="primary" fontWeight="bold">
        {index === 0 ? "Outbound Leg" : "Return Leg"} ({leg.stopCount} stop
        {leg.stopCount !== 1 ? "s" : ""})
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            **{dayjs(leg.departure).format("HH:mm")}** ({leg.origin.displayCode})
            <br />
            {leg.origin.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            **{dayjs(leg.arrival).format("HH:mm")}** ({leg.destination.displayCode})
            <br />
            {leg.destination.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">
            {leg.carriers.marketing[0]?.name || 'Unknown Carrier'} | Duration:{" "}
            {formatDuration(leg.durationInMinutes)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const renderFlightItinerary = (itinerary) => {
    return (
      <Paper elevation={4} sx={{ my: 3, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Price */}
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <AttachMoneyIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" color="primary">
                {itinerary.price?.formatted || 'Price N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {itinerary.tags?.join(" | ").toUpperCase() || 'BEST MATCH'}
              </Typography>
            </Box>
          </Grid>
          {/* Legs */}
          <Grid item xs={12} md={9}>
            {itinerary.legs.map(renderFlightLeg)}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const datePickerGridSize = 3;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">
          {/* Hero Section (Unchanged) */}
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
            <Box
              sx={{
                bgcolor: "background.paper",
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
                mb: 4,
              }}
            >
              {/* Trip, Passengers, Cabin Selections (Unchanged) */}
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-start"
              >
                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    label="Trip"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    name="tripType"
                    SelectProps={{ native: true }}
                  >
                    <option value="oneway">One-way</option>
                    <option value="round">Round-trip</option>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    label="Passengers"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    name="passengers"
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 90 }}
                  >
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    label="Cabin"
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    name="cabinClass"
                    SelectProps={{ native: true }}
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First</option>
                  </TextField>
                </Grid>
              </Grid>

              <Box
                sx={{
                  width: "100%",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  my: 2,
                }}
              />

              {/* Autocomplete Fields and Date Pickers */}
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                {/* DEPARTURE Autocomplete */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={{ minWidth: 245 }}>
                    <Autocomplete
                      options={departureOptions}
                      loading={loadingDeparture}
                      getOptionLabel={(option) =>
                        option.suggestionTitle || option.localizedName || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.skyId === value.skyId
                      }
                      value={departure}
                      onChange={(event, newValue) => {
                        setDeparture(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        // Call REAL API function
                        fetchAirportSuggestions(
                          newInputValue,
                          setDepartureOptions,
                          setLoadingDeparture
                        );
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.skyId}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {option.suggestionTitle}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {option.subtitle}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Departure"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingDeparture ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* DESTINATION Autocomplete */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={{ minWidth: 245 }}>
                    <Autocomplete
                      options={destinationOptions}
                      loading={loadingDestination}
                      getOptionLabel={(option) =>
                        option.suggestionTitle || option.localizedName || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.skyId === value.skyId
                      }
                      value={destination}
                      onChange={(event, newValue) => {
                        setDestination(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        // Call REAL API function
                        fetchAirportSuggestions(
                          newInputValue,
                          setDestinationOptions,
                          setLoadingDestination
                        );
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.skyId}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {option.suggestionTitle}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {option.subtitle}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Destination"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingDestination ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Departure Date Picker */}
                <Grid item xs={12} sm={6} md={datePickerGridSize}>
                  <DatePicker
                    label="Date"
                    minDate={dayjs().add(1, 'day')}
                    value={departureDate}
                    onChange={(newValue) => setDepartureDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                {/* Return Date Picker - VISIBLE BUT RESERVING SPACE */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={datePickerGridSize}
                  sx={{
                    visibility: tripType === "oneway" ? "hidden" : "visible",
                  }}
                >
                  <DatePicker
                    label="Return Date"
                    minDate={departureDate}
                    value={returnDate}
                    onChange={(newValue) => setReturnDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>

              {/* Search Button */}
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <Button
                  variant="search"
                  size="large"
                  startIcon={
                    isSearching ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <SearchIcon />
                    )
                  }
                  onClick={handleSearch}
                  disabled={isSearching}
                >
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
                <Typography variant="h4" gutterBottom>
                  ✈️ Search Results
                </Typography>

                {flightResults.status === false && flightResults.error ? (
                  <Paper sx={{ p: 3, backgroundColor: 'red', color: 'white' }}>
                    <Typography variant="h6">Error:</Typography>
                    <Typography>{flightResults.error}</Typography>
                    <Typography variant="caption">
                      Please check the API key, host, and request limits.
                    </Typography>
                  </Paper>
                ) : (
                  <>
                    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
                      <Typography variant="subtitle1" color="primary">
                        **Search Parameters Used:**
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            **Origin/Dest:** {searchParams.origId} $\rightarrow$ {searchParams.destId}
                          </Typography>
                          <Typography variant="body2">
                            **Date:** {searchParams.date}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            **Trip Type:** {tripType === 'round' ? 'Round-trip' : 'One-way'}
                          </Typography>
                          <Typography variant="body2">
                            **Details:** {searchParams.adults} Adult(s), {searchParams.cabinClass}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>

                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Best Itineraries ({flightResults.data?.context?.totalResults || 0} results found)
                    </Typography>

                    {flightResults.data?.itineraries?.length > 0
                      ? flightResults.data.itineraries.slice(0, 3).map((itinerary, index) => (
                          renderFlightItinerary(itinerary)
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