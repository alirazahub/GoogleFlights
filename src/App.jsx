import React from "react";
import {
  Typography,
  Box,
  Container,
  CssBaseline,
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import darkTheme from "./theme";
import { searchAirports, searchFlights } from "./apis";
import FlightItineraryCard from "./components/FlightItineraryCard";
import { INITIAL_LONDON, INITIAL_NEW_YORK } from "./utils/itineraryUtils.js";

const App = () => {
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