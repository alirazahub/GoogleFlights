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
  CircularProgress, // For loading state
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// --- Date Picker Imports ---
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
// ---------------------------

// --- SAMPLE DATA (Copied from API response) ---
const SAMPLE_API_DATA = [
  {
    presentation: {
      title: "New York",
      suggestionTitle: "New York (Any)",
      subtitle: "United States",
    },
    navigation: {
      entityId: "27537542",
      entityType: "CITY",
      localizedName: "New York",
      relevantFlightParams: {
        skyId: "NYCA",
        entityId: "27537542",
        flightPlaceType: "CITY",
        localizedName: "New York",
      },
    },
  },
  {
    presentation: {
      title: "New York Newark",
      suggestionTitle: "New York Newark (EWR)",
      subtitle: "United States",
    },
    navigation: {
      entityId: "95565059",
      entityType: "AIRPORT",
      localizedName: "New York Newark",
      relevantFlightParams: {
        skyId: "EWR",
        entityId: "95565059",
        flightPlaceType: "AIRPORT",
        localizedName: "New York Newark",
      },
    },
  },
  {
    presentation: {
      title: "New York John F. Kennedy",
      suggestionTitle: "New York John F. Kennedy (JFK)",
      subtitle: "United States",
    },
    navigation: {
      entityId: "95565058",
      entityType: "AIRPORT",
      localizedName: "New York John F. Kennedy",
      relevantFlightParams: {
        skyId: "JFK",
        entityId: "95565058",
        flightPlaceType: "AIRPORT",
        localizedName: "New York John F. Kennedy",
      },
    },
  },
  {
    presentation: {
      title: "New York LaGuardia",
      suggestionTitle: "New York LaGuardia (LGA)",
      subtitle: "United States",
    },
    navigation: {
      entityId: "95565057",
      entityType: "AIRPORT",
      localizedName: "New York LaGuardia",
      relevantFlightParams: {
        skyId: "LGA",
        entityId: "95565057",
        flightPlaceType: "AIRPORT",
        localizedName: "New York LaGuardia",
      },
    },
  },
];
// ---------------------------------------------

// 1. Define the Dark Theme (Unchanged from previous response)
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
  // Flight fields
  const [departure, setDeparture] = React.useState(null);
  const [destination, setDestination] = React.useState(null);

  // New state variables for Autocomplete options
  const [departureOptions, setDepartureOptions] = React.useState([]);
  const [destinationOptions, setDestinationOptions] = React.useState([]);
  const [loadingDeparture, setLoadingDeparture] = React.useState(false);
  const [loadingDestination, setLoadingDestination] = React.useState(false);

  // Date variables
  const [departureDate, setDepartureDate] = React.useState(dayjs());
  const [returnDate, setReturnDate] = React.useState(dayjs().add(7, "day"));

  /**
   * ✈️ SIMULATED API CALL: Uses hardcoded sample data instead of axios.
   * This function simulates the network delay and returns the static results
   * when the user types 'new' (case-insensitive).
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

    // 2. Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3. Define the response data based on the query (for demonstration purposes)
    const rawData = query.toLowerCase().includes("new")
      ? SAMPLE_API_DATA // Return full list if 'new' is typed
      : []; // Return empty list otherwise

    // 4. Map the response data to the desired format
    const formattedData = rawData.map((item) => ({
      skyId:
        item.navigation.relevantFlightParams?.skyId || item.navigation.entityId,
      localizedName: item.navigation.localizedName,
      suggestionTitle: item.presentation.suggestionTitle,
      subtitle: item.presentation.subtitle,
    }));

    // 5. Update state
    setOptionsState(formattedData);
    setLoadingState(false);
  };

  const handleSearch = () => {
    if (!departure || !destination) {
      alert("Please select both Departure and Destination locations.");
      return;
    }

    console.log("Searching for flights with parameters:");
    console.log("Departure:", departure.skyId, departure.localizedName);
    console.log("Destination:", destination.skyId, destination.localizedName);
    console.log("Departure Date:", departureDate.format("YYYY-MM-DD"));
    console.log("Return Date:", returnDate.format("YYYY-MM-DD"));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">
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
                    defaultValue="round"
                    name="tripType"
                    // Use <option> tags for native select within TextField
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
                    defaultValue={1}
                    name="passengers"
                    SelectProps={{ native: true }}
                    sx={{minWidth:90}}
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
                    defaultValue="economy"
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
                      // Keying by skyId ensures distinct selection even if titles are similar
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
                        // Call the SIMULATED fetch function
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
                        // Call the SIMULATED fetch function
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

                {/* Date Pickers (Unchanged) */}
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="Date"
                    value={departureDate}
                    onChange={(newValue) => setDepartureDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="Return Date"
                    value={returnDate}
                    onChange={(newValue) => setReturnDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>

              {/* Search Button (Unchanged) */}
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <Button
                  variant="search"
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </Box>
          </Container>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
