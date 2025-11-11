import React,{useMemo, useState} from "react";
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
} from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { searchAirports, searchFlights } from "../apis";
import FlightItineraryCard from "../components/FlightItineraryCard";
import { flightResultsFile, INITIAL_LONDON, INITIAL_NEW_YORK } from "../utils/itineraryUtils.js";

const SearchPage = () => {
  const [tripType, setTripType] = useState("round");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("economy");
  const [departure, setDeparture] = useState(INITIAL_LONDON);
  const [destination, setDestination] = useState(INITIAL_NEW_YORK);
  const [departureDate, setDepartureDate] = useState(
    dayjs().add(1, "day")
  );
  const [returnDate, setReturnDate] = useState(dayjs().add(8, "day"));
  const [departureOptions, setDepartureOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [loadingDeparture, setLoadingDeparture] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showAllFlights, setShowAllFlights] = useState(false);
  const [flightResults, setFlightResults] = useState(flightResultsFile);
  const [sortField, setSortField] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");

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
        skyId:
          item.navigation.relevantFlightParams?.skyId ||
          item.navigation.entityId,
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
    if (
      !departure ||
      !destination ||
      !departureDate ||
      !departure.skyId ||
      !departure.entityId
    ) {
      alert(
        "Please select both Departure and Destination locations with valid data."
      );
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
      returnDate:
        tripType === "round" && returnDate
          ? returnDate.format("YYYY-MM-DD")
          : undefined,
    };

    setIsSearching(true);
    setFlightResults(null);

    try {
      const apiResponse = await searchFlights(params);
      console.log(apiResponse);
      setFlightResults(apiResponse);
    } catch (error) {
      console.error("Flight search failed:", error);
      setFlightResults({
        status: false,
        error: "Flight search failed. Check console for details.",
      });
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

              <Grid item xs={12} sm={6} md={datePickerGridSize}>
                <DatePicker
                  label="Date"
                  minDate={dayjs().add(1, "day")}
                  value={departureDate}
                  onChange={(newValue) => setDepartureDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
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
                size="small"
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
                    <Grid
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <div>
                        <Typography fontSize={20} fontWeight={500}>
                          All Flights
                        </Typography>
                        <Typography
                          fontSize={12}
                          fontWeight={400}
                          color="#9aa0a6"
                        >
                          Prices include required taxes + fees for {passengers} passengers. Optional charges and bag
                          fees may apply.
                        </Typography>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <InputLabel id="sort-by-label">Sort by</InputLabel>
                          <Select
                            labelId="sort-by-label"
                            value={sortField}
                            label="Sort by"
                            onChange={(e) => setSortField(e.target.value)}
                          >
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="departure">Departure time</MenuItem>
                            <MenuItem value="arrival">Arrival time</MenuItem>
                            <MenuItem value="duration">Duration</MenuItem>
                          </Select>
                        </FormControl>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                          }
                          title={sortOrder === "asc" ? "Ascending" : "Descending"}
                        >
                          {sortOrder === "asc" ? (
                            <ArrowUpwardIcon />
                          ) : (
                            <ArrowDownwardIcon />
                          )}
                        </IconButton>
                      </div>
                    </Grid>
                  </div>

                  {sortedItineraries?.length > 0 ? (
                    <>
                      {(showAllFlights ? sortedItineraries : sortedItineraries.slice(0, 3)).map((itinerary, index) => (
                        <FlightItineraryCard key={itinerary?.id || index} itinerary={itinerary} />
                      ))}

                      {sortedItineraries.length > 3 && (
                        <Box style={{border: "1px solid rgba(255,255,255,0.4)", padding:12}} textAlign="center">
                          <div
                          style={{display:"flex", alignContent:'center', cursor:'pointer'}}
                            onClick={() => setShowAllFlights((s) => !s)}
                          >
                            <div style={{marginLeft:10}}>{showAllFlights ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}</div>
                            <div style={{marginLeft:30}}>{showAllFlights ? "Show less" : "View all flights"}</div>
                          </div>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Typography>
                      No flight itineraries found for these parameters.
                    </Typography>
                  )}
                </>
              )}
            </Box>
          )}
        </Container>
      </Container>
    </LocalizationProvider>
  );
};

export default SearchPage;
