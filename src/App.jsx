import React from "react";
import {
  Typography,
  Box,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  TextField,
  Button, // Import Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Import Search Icon

// --- Date Picker Imports ---
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
// ---------------------------

// 1. Define the Dark Theme
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
  // Ensure the DatePicker input styles match the dark theme
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "background.paper", // Match Select background
          },
        },
      },
    },
    // Define a custom style for the Search button
    MuiButton: {
      variants: [
        {
          props: { variant: "search" },
          style: {
            // Background color close to the image's blue
            backgroundColor: "#8ab4f8",
            color: "#202124", // Dark text for contrast
            "&:hover": {
              backgroundColor: "#6c9ce3", // Slightly darker blue on hover
            },
            borderRadius: 24, // Rounded corners
            padding: "12px 30px", // Larger padding
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", // Subtle shadow
          },
        },
      ],
    },
  },
});

const locations = [
  { value: "en", label: "New York (EN)", icon: "🇺🇸" },
  { value: "es", label: "Madrid (ES)", icon: "🇪🇸" },
  { value: "fr", label: "Paris (FR)", icon: "🇫🇷" },
  { value: "de", label: "Berlin (DE)", icon: "🇩🇪" },
  { value: "zh", label: "Beijing (ZH)", icon: "🇨🇳" },
];

const App = () => {
  // Flight fields
  const [departure, setDeparture] = React.useState("en");
  const [destination, setDestination] = React.useState("es");

  // New state variables for dates using dayjs
  const [departureDate, setDepartureDate] = React.useState(dayjs()); // Set to today
  const [returnDate, setReturnDate] = React.useState(dayjs().add(7, "day")); // Set to one week later

  // Reusable render function for location Select
  const renderSelectedValue = (selectedValue) => {
    const item = locations.find((item) => item.value === selectedValue);
    if (!item) return null;
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: 8 }}>{item.icon}</span>
        {item.label}
      </Box>
    );
  };

  const handleDepartureChange = (event) => {
    setDeparture(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  // New function for search action
  const handleSearch = () => {
    console.log("Searching for flights...");
    // Add your search logic here
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* LocalizationProvider must wrap the date components */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">
          <img
            src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg"
            alt="Travel Hero Illustration"
          />

          <Typography
            textAlign={"center"}
            style={{ marginTop: "-100px" }}
            variant="h2"
            component="h1"
            gutterBottom
          >
            Flights
          </Typography>

          <Container maxWidth="lg">
            <Box
              sx={{
                bgcolor: "background.paper",
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 100 }}>
                      <InputLabel id="trip-type-label">Trip</InputLabel>
                      <Select
                        labelId="trip-type-label"
                        defaultValue="round"
                        label="Trip"
                        name="tripType"
                      >
                        <MenuItem value="oneway">One-way</MenuItem>
                        <MenuItem value="round">Round-trip</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 100 }}>
                      <InputLabel id="passengers-label">Passengers</InputLabel>
                      <Select
                        labelId="passengers-label"
                        defaultValue={1}
                        label="Passengers"
                        name="passengers"
                      >
                        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                          <MenuItem key={n} value={n}>
                            {n}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 140 }}>
                      <InputLabel id="cabin-label">Cabin</InputLabel>
                      <Select
                        labelId="cabin-label"
                        defaultValue="economy"
                        label="Cabin"
                        name="cabinClass"
                      >
                        <MenuItem value="economy">Economy</MenuItem>
                        <MenuItem value="premium">Premium Economy</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                        <MenuItem value="first">First</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </>
              <Box
                sx={{
                  width: "100%",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  my: 2,
                }}
              />
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={{ minWidth: 245 }}>
                    <InputLabel id="departure-select-label">
                      Departure
                    </InputLabel>
                    <Select
                      value={departure}
                      label="Departure"
                      onChange={handleDepartureChange}
                      renderValue={renderSelectedValue}
                    >
                      {locations.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={{ minWidth: 245 }}>
                    <InputLabel id="destination-select-label">
                      Destination
                    </InputLabel>
                    <Select
                      value={destination}
                      label="Destination"
                      onChange={handleDestinationChange}
                      renderValue={renderSelectedValue}
                    >
                      {locations.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

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
              {/* --------------------- */}
            </Box>
          </Container>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
