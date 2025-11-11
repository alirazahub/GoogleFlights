import React, { useMemo, useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  FormControl,
  Grid,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { searchAirports, searchFlights, getNearByAirport, setApiKey } from "../apis";
import FlightItineraryCard from "../components/FlightItineraryCard";
import { DEPART, DEST } from "../utils/itineraryUtils.js";

const SearchPage = () => {
  const [tripType, setTripType] = useState("round");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("economy");
  const [departure, setDeparture] = useState(DEPART);
  const [destination, setDestination] = useState(DEST);
  const [departureDate, setDepartureDate] = useState(dayjs().add(1, "day"));
  const [returnDate, setReturnDate] = useState(dayjs().add(8, "day"));
  const [departureOptions, setDepartureOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [loadingDeparture, setLoadingDeparture] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const INITIAL_VISIBLE = 3;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const [flightResults, setFlightResults] = useState(null);
  const [sortField, setSortField] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");

  const [snack, setSnack] = useState({ open: false, message: "", severity: "error", showChangeKey: false });
  const showSnack = (message, severity = "error", showChangeKey = false) => setSnack({ open: true, message, severity, showChangeKey });
  const closeSnack = (event, reason) => {
    if (reason === "clickaway") return;
    setSnack((s) => ({ ...s, open: false, showChangeKey: false }));
  };

  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem("rapidapi_key") || "");

  const handleSaveApiKey = () => {
    const key = (apiKeyInput || "").trim();
    if (!key) {
      showSnack("Please enter a valid API key.", "warning");
      return;
    }
    try {
      setApiKey(key);
      localStorage.setItem("rapidapi_key", key);
      setApiKeyModalOpen(false);
      showSnack("API key updated — new key will be used for subsequent requests.", "success");
    } catch (err) {
      console.error("Failed to set API key", err);
      showSnack("Failed to update API key.", "error");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("rapidapi_key");
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [flightResults, sortField, sortOrder]);

  const sortedItineraries = useMemo(() => {
    const list = (flightResults?.data?.itineraries || []).slice();
    const safeNumber = (v) => (typeof v === "number" && !Number.isNaN(v) ? v : Number.MAX_SAFE_INTEGER);

    const getPrice = (it) => safeNumber(it?.price?.raw);
    const getDeparture = (it) => {
      try {
        const firstLeg = (it.legs && it.legs[0]) || null;
        return firstLeg && firstLeg.departure ? dayjs(firstLeg.departure).valueOf() : Number.MAX_SAFE_INTEGER;
      } catch (e) {
        return Number.MAX_SAFE_INTEGER;
      }
    };
    const getArrival = (it) => {
      try {
        const legs = it.legs || [];
        const last = legs[legs.length - 1] || null;
        return last && last.arrival ? dayjs(last.arrival).valueOf() : Number.MAX_SAFE_INTEGER;
      } catch (e) {
        return Number.MAX_SAFE_INTEGER;
      }
    };
    const getDuration = (it) => {
      try {
        if (!Array.isArray(it.legs)) return Number.MAX_SAFE_INTEGER;
        let total = 0;
        for (const l of it.legs) {
          total += Number(l?.durationInMinutes || 0);
        }
        return safeNumber(total);
      } catch (e) {
        return Number.MAX_SAFE_INTEGER;
      }
    };

    list.sort((a, b) => {
      let va = 0;
      let vb = 0;
      switch (sortField) {
        case "price":
          va = getPrice(a);
          vb = getPrice(b);
          break;
        case "departure":
          va = getDeparture(a);
          vb = getDeparture(b);
          break;
        case "arrival":
          va = getArrival(a);
          vb = getArrival(b);
          break;
        case "duration":
          va = getDuration(a);
          vb = getDuration(b);
          break;
        default:
          va = getPrice(a);
          vb = getPrice(b);
      }
      if (va < vb) return -1;
      if (va > vb) return 1;
      return 0;
    });

    if (sortOrder === "desc") list.reverse();
    return list;
  }, [flightResults, sortField, sortOrder]);

  const fetchAirportSuggestions = async (query, setOptionsState, setLoadingState) => {
    if (query.length < 2) {
      setOptionsState([]);
      return;
    }

    setLoadingState(true);

    try {
      const apiResponse = await searchAirports(query);

      const apiMessage = apiResponse?.message || apiResponse?.data?.message;
      if (apiMessage) {
        if (apiMessage.includes("You have exceeded the MONTHLY quota")) showSnack(apiMessage, "error", true);
        else showSnack(apiMessage, "warning");
        setOptionsState([]);
        return;
      }

      const formattedData = (apiResponse.data || []).map((item) => ({
        skyId: item.navigation?.relevantFlightParams?.skyId || item.navigation?.entityId,
        entityId: item.navigation?.entityId,
        localizedName: item.navigation?.localizedName,
        suggestionTitle: item.presentation?.suggestionTitle,
        subtitle: item.presentation?.subtitle,
      }));

      setOptionsState(formattedData);
    } catch (error) {
      console.error("Airport search failed:", error);
      const msg = error?.response?.data?.message || error?.message || "Airport search failed.";
  if (msg.includes("You have exceeded the MONTHLY quota")) showSnack(msg, "error", true);
  else showSnack(msg, "warning");
      setOptionsState([]);
    } finally {
      setLoadingState(false);
    }
  };

  const handleUseNearby = async () => {
    if (!navigator.geolocation) {
      showSnack("Geolocation is not supported by your browser.", "warning");
      return;
    }

    setLoadingDeparture(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const apiResponse = await getNearByAirport({ lat: latitude, long: longitude });

          const apiMessage = apiResponse?.message || apiResponse?.data?.message;
          if (apiMessage) {
            if (apiMessage.includes("You have exceeded the MONTHLY quota")) showSnack(apiMessage, "error", true);
            else showSnack(apiMessage, "warning");
            setLoadingDeparture(false);
            return;
          }

          const respData = apiResponse?.data || apiResponse || {};
          let candidates = [];
          if (respData.current) {
            candidates.push(respData.current);
            if (Array.isArray(respData.nearby)) candidates = candidates.concat(respData.nearby);
            if (Array.isArray(respData.recent)) candidates = candidates.concat(respData.recent);
          } else if (Array.isArray(respData)) candidates = respData;
          else if (Array.isArray(respData.data)) candidates = respData.data;

          const mapped = candidates.map((item) => {
            const nav = item.navigation || item || {};
            const pres = item.presentation || {};
            return {
              skyId:
                nav.relevantFlightParams?.skyId || nav.entityId || nav.skyId || nav.id || pres.code || item.code || null,
              entityId: nav.entityId || nav.id || item.entityId || item.id || null,
              localizedName: nav.localizedName || pres.city || item.city || pres.name || item.name || "",
              suggestionTitle:
                pres.suggestionTitle || (item.name && item.code ? `${item.name} (${item.code})` : item.name) || item.name || "",
              subtitle: pres.subtitle || `${item.country || nav.country || ""}`.trim() || "",
            };
          });

          const seen = new Set();
          const formatted = [];
          for (const it of mapped) {
            const key = it.skyId || it.entityId || JSON.stringify(it);
            if (!key) continue;
            if (seen.has(key)) continue;
            seen.add(key);
            formatted.push(it);
          }

          if (formatted.length === 0) {
            showSnack("No nearby airports found.", "info");
            setLoadingDeparture(false);
            return;
          }

          setDepartureOptions(formatted);
          setDeparture(formatted[0]);
        } catch (err) {
          console.error("Nearby airport lookup failed", err);
          const msg = err?.response?.data?.message || err?.message || "Failed to fetch nearby airports.";
          if (msg.includes("You have exceeded the MONTHLY quota")) showSnack(msg, "error", true);
          else showSnack(msg, "error");
        } finally {
          setLoadingDeparture(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        showSnack("Unable to retrieve your location.", "warning");
        setLoadingDeparture(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  // Fetch nearby airports on mount
  useEffect(() => {
    // only run once on mount
    handleUseNearby();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    if (!departure || !destination || !departureDate || !departure.skyId || !departure.entityId) {
      showSnack("Please select both Departure and Destination locations with valid data.", "warning");
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
      const apiMessage = apiResponse?.message || apiResponse?.data?.message;
      if (apiMessage) {
        if (apiMessage.includes("You have exceeded the MONTHLY quota")) showSnack(apiMessage, "error", true);
        else showSnack(apiMessage, "warning");
        setFlightResults(null);
      } else {
        setFlightResults(apiResponse);
      }
    } catch (error) {
      console.error("Flight search failed:", error);
  const msg = error?.response?.data?.message || error?.message || "Flight search failed. Check console for details.";
  if (msg.includes("You have exceeded the MONTHLY quota")) showSnack(msg, "error", true);
  else showSnack(msg, "error");
      setFlightResults({ status: false, error: msg });
    } finally {
      setIsSearching(false);
    }
  };

  const datePickerGridSize = 3;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <Box textAlign="center">
          <img
            src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg"
            alt="Travel Hero Illustration"
          />
          <Typography style={{ marginTop: "-100px" }} fontSize={"3rem"} gutterBottom>
            Flights
          </Typography>
        </Box>

        <Container maxWidth="lg">
          <Box sx={{ bgcolor: "background.paper", padding: 4, borderRadius: 2, boxShadow: 3, mb: 4 }}>
            <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <TextField select size="small" fullWidth label="Trip" value={tripType} onChange={(e) => setTripType(e.target.value)} name="tripType" SelectProps={{ native: true }}>
                  <option value="oneway">One-way</option>
                  <option value="round">Round-trip</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <TextField select size="small" fullWidth label="Passengers" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} name="passengers" SelectProps={{ native: true }} sx={{ minWidth: 90 }}>
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
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
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FormControl sx={{ minWidth: 245, flex: 1 }}>
                    <Autocomplete
                      options={departureOptions}
                      loading={loadingDeparture}
                      getOptionLabel={(option) => option.suggestionTitle || option.localizedName || ""}
                      isOptionEqualToValue={(option, value) => option.skyId === value.skyId}
                      value={departure}
                      onChange={(event, newValue) => setDeparture(newValue)}
                      onInputChange={(event, newInputValue) => fetchAirportSuggestions(newInputValue, setDepartureOptions, setLoadingDeparture)}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.skyId}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {option.suggestionTitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
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
                              <>
                                {loadingDeparture ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  {/* Nearby airports fetched automatically on mount */}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl sx={{ minWidth: 245 }}>
                  <Autocomplete
                    options={destinationOptions}
                    loading={loadingDestination}
                    getOptionLabel={(option) => option.suggestionTitle || option.localizedName || ""}
                    isOptionEqualToValue={(option, value) => option.skyId === value.skyId}
                    value={destination}
                    onChange={(event, newValue) => setDestination(newValue)}
                    onInputChange={(event, newInputValue) => fetchAirportSuggestions(newInputValue, setDestinationOptions, setLoadingDestination)}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.skyId}>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {option.suggestionTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
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
                            <>
                              {loadingDestination ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={datePickerGridSize}>
                <DatePicker label="Date" minDate={dayjs().add(1, "day")} value={departureDate} onChange={(newValue) => setDepartureDate(newValue)} slotProps={{ textField: { fullWidth: true } }} />
              </Grid>
              <Grid item xs={12} sm={6} md={datePickerGridSize} sx={{ visibility: tripType === "oneway" ? "hidden" : "visible" }}>
                <DatePicker label="Return Date" minDate={departureDate} value={returnDate} onChange={(newValue) => setReturnDate(newValue)} slotProps={{ textField: { fullWidth: true } }} />
              </Grid>
            </Grid>

            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <Button variant="search" size="small" startIcon={isSearching ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />} onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search Flights"}
              </Button>
            </div>
          </Box>

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
                <Paper sx={{ p: 3, backgroundColor: "red", color: "white" }}>
                  <Typography variant="h6">Error:</Typography>
                  <Typography>{flightResults.error}</Typography>
                </Paper>
              ) : (
                <>
                  <div style={{ mb: 2 }}>
                    <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                      <div>
                        <Typography fontSize={{ xs: 18, sm: 24, md: 30 }} fontWeight={500}>
                          All Flights
                        </Typography>

                        <Typography fontSize={{ xs: 10, sm: 12, md: 14 }} fontWeight={400} color="#9aa0a6" mb={{ xs: 0.5, sm: 1 }}>
                          Prices include required taxes + fees for {passengers} passengers. Optional charges and bag fees may apply.
                        </Typography>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <InputLabel id="sort-by-label">Sort by</InputLabel>
                          <Select labelId="sort-by-label" value={sortField} label="Sort by" onChange={(e) => setSortField(e.target.value)}>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="departure">Departure time</MenuItem>
                            <MenuItem value="arrival">Arrival time</MenuItem>
                            <MenuItem value="duration">Duration</MenuItem>
                          </Select>
                        </FormControl>
                        <IconButton size="small" onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))} title={sortOrder === "asc" ? "Ascending" : "Descending"}>
                          {sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        </IconButton>
                      </div>
                    </Grid>
                  </div>

                  {sortedItineraries?.length > 0 ? (
                    <>
                      {sortedItineraries.slice(0, visibleCount).map((itinerary, index) => (
                        <FlightItineraryCard key={itinerary?.id || index} itinerary={itinerary} />
                      ))}

                      {sortedItineraries.length > INITIAL_VISIBLE && (
                        <Box style={{ border: "1px solid rgba(255,255,255,0.4)", padding: 12 }} textAlign="center">
                          <div style={{ display: "flex", alignContent: "center", cursor: "pointer" }} onClick={() => setVisibleCount((v) => (v >= sortedItineraries.length ? INITIAL_VISIBLE : Math.min(sortedItineraries.length, v + 10)))}>
                            <div style={{ marginLeft: 10 }}>{visibleCount >= sortedItineraries.length ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}</div>
                            <div style={{ marginLeft: 30 }}>{visibleCount >= sortedItineraries.length ? "Show less" : "View more flights"}</div>
                          </div>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Typography>No flight itineraries found for these parameters.</Typography>
                  )}
                </>
              )}
            </Box>
          )}
        </Container>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={6000} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
          action={
            snack.showChangeKey ? (
              <Button color="inherit" size="small" onClick={() => setApiKeyModalOpen(true)}>
                Change API Key
              </Button>
            ) : null
          }
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <Dialog open={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)}>
        <DialogTitle>Update RapidAPI Key</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Enter a RapidAPI key to replace the current key. This will be used for subsequent requests.
          </Typography>
          <TextField label="API Key" fullWidth value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApiKeyModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveApiKey}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default SearchPage;
