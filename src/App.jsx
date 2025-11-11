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
  const [departureDate, setDepartureDate] = React.useState(
    dayjs().add(1, "day")
  );
  const [returnDate, setReturnDate] = React.useState(dayjs().add(8, "day"));
  const [departureOptions, setDepartureOptions] = React.useState([]);
  const [destinationOptions, setDestinationOptions] = React.useState([]);
  const [loadingDeparture, setLoadingDeparture] = React.useState(false);
  const [loadingDestination, setLoadingDestination] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [flightResults, setFlightResults] = React.useState({
    status: true,
    timestamp: 1762865319225,
    sessionId: "4ec35238-03b1-4f25-a5db-3ac50dd78247",
    data: {
      context: {
        status: "incomplete",
        sessionId:
          "KLUv_SCP7QMA8kgeHqC7AaP-H4XeFb_67-69ezfAa5G9UybAKCvrj51aDo0TIICx1IbtYbXS8vywTYbvnl90z-1l678eTROlFIDhl4VVGfG3qZRwUjudJXWTF9vP8b3Kk9Lrt9rkCIj4LaO17dXpTO2b_Fp6dtQbS-_n9X4yMMNTAAI0BAA=",
        totalResults: 10,
      },
      itineraries: [
        {
          id: "13548-2511150255--31939-1-10413-2511151315|10413-2511261515--31939-1-13548-2511270720",
          price: {
            raw: 1103.5,
            formatted: "$1,104",
            pricingOptionId: "qhsLaUFI5DYG",
          },
          legs: [
            {
              id: "13548-2511150255--31939-1-10413-2511151315",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 860,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T02:55:00",
              arrival: "2025-11-15T13:15:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150255-2511150500--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T02:55:00",
                  arrival: "2025-11-15T05:00:00",
                  durationInMinutes: 245,
                  flightNumber: "621",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511150805-2511151315--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T08:05:00",
                  arrival: "2025-11-15T13:15:00",
                  durationInMinutes: 430,
                  flightNumber: "39",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511261515--31939-1-13548-2511270720",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 725,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T15:15:00",
              arrival: "2025-11-27T07:20:00",
              timeDeltaInDays: 1,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511261515-2511262335--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T15:15:00",
                  arrival: "2025-11-26T23:35:00",
                  durationInMinutes: 380,
                  flightNumber: "40",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511270200-2511270720--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-27T02:00:00",
                  arrival: "2025-11-27T07:20:00",
                  durationInMinutes: 200,
                  flightNumber: "628",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          tags: ["second_cheapest", "shortest"],
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.999,
        },
        {
          id: "13548-2511150255--31939-1-10413-2511151315|10413-2511260835--31939-1-13548-2511270720",
          price: {
            raw: 1103.5,
            formatted: "$1,104",
            pricingOptionId: "nIENzoAaMX0z",
          },
          legs: [
            {
              id: "13548-2511150255--31939-1-10413-2511151315",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 860,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T02:55:00",
              arrival: "2025-11-15T13:15:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150255-2511150500--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T02:55:00",
                  arrival: "2025-11-15T05:00:00",
                  durationInMinutes: 245,
                  flightNumber: "621",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511150805-2511151315--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T08:05:00",
                  arrival: "2025-11-15T13:15:00",
                  durationInMinutes: 430,
                  flightNumber: "39",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511260835--31939-1-13548-2511270720",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 1125,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T08:35:00",
              arrival: "2025-11-27T07:20:00",
              timeDeltaInDays: 1,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511260835-2511261655--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T08:35:00",
                  arrival: "2025-11-26T16:55:00",
                  durationInMinutes: 380,
                  flightNumber: "42",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511270200-2511270720--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-27T02:00:00",
                  arrival: "2025-11-27T07:20:00",
                  durationInMinutes: 200,
                  flightNumber: "628",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          tags: ["third_cheapest"],
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.627623,
        },
        {
          id: "13548-2511150850--31939-1-10413-2511152030|10413-2511261515--31939-1-13548-2511270720",
          price: {
            raw: 1146.59,
            formatted: "$1,147",
            pricingOptionId: "1gLE04pJzjHh",
          },
          legs: [
            {
              id: "13548-2511150850--31939-1-10413-2511152030",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 940,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T08:50:00",
              arrival: "2025-11-15T20:30:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150850-2511151055--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T08:50:00",
                  arrival: "2025-11-15T10:55:00",
                  durationInMinutes: 245,
                  flightNumber: "629",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511151520-2511152030--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T15:20:00",
                  arrival: "2025-11-15T20:30:00",
                  durationInMinutes: 430,
                  flightNumber: "37",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511261515--31939-1-13548-2511270720",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 725,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T15:15:00",
              arrival: "2025-11-27T07:20:00",
              timeDeltaInDays: 1,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511261515-2511262335--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T15:15:00",
                  arrival: "2025-11-26T23:35:00",
                  durationInMinutes: 380,
                  flightNumber: "40",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511270200-2511270720--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-27T02:00:00",
                  arrival: "2025-11-27T07:20:00",
                  durationInMinutes: 200,
                  flightNumber: "628",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          tags: ["third_shortest"],
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.617922,
        },
        {
          id: "13548-2511150255--31939-1-10413-2511151315|10413-2511262200--31939-1-13548-2511280720",
          price: {
            raw: 1077.02,
            formatted: "$1,078",
            pricingOptionId: "AsWdXezjbCuc",
          },
          legs: [
            {
              id: "13548-2511150255--31939-1-10413-2511151315",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 860,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T02:55:00",
              arrival: "2025-11-15T13:15:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150255-2511150500--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T02:55:00",
                  arrival: "2025-11-15T05:00:00",
                  durationInMinutes: 245,
                  flightNumber: "621",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511150805-2511151315--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T08:05:00",
                  arrival: "2025-11-15T13:15:00",
                  durationInMinutes: 430,
                  flightNumber: "39",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511262200--31939-1-13548-2511280720",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 1760,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T22:00:00",
              arrival: "2025-11-28T07:20:00",
              timeDeltaInDays: 2,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511262200-2511270620--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T22:00:00",
                  arrival: "2025-11-27T06:20:00",
                  durationInMinutes: 380,
                  flightNumber: "38",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511280200-2511280720--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-28T02:00:00",
                  arrival: "2025-11-28T07:20:00",
                  durationInMinutes: 200,
                  flightNumber: "628",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          tags: ["cheapest"],
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.615649,
        },
        {
          id: "13548-2511150255--31939-1-10413-2511151315|10413-2511262200--31939-1-13548-2511280110",
          price: {
            raw: 1106.11,
            formatted: "$1,107",
            pricingOptionId: "vM-qGBFGJnmf",
          },
          legs: [
            {
              id: "13548-2511150255--31939-1-10413-2511151315",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 860,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T02:55:00",
              arrival: "2025-11-15T13:15:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150255-2511150500--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T02:55:00",
                  arrival: "2025-11-15T05:00:00",
                  durationInMinutes: 245,
                  flightNumber: "621",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511150805-2511151315--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T08:05:00",
                  arrival: "2025-11-15T13:15:00",
                  durationInMinutes: 430,
                  flightNumber: "39",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511262200--31939-1-13548-2511280110",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 1390,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T22:00:00",
              arrival: "2025-11-28T01:10:00",
              timeDeltaInDays: 2,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511262200-2511270620--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T22:00:00",
                  arrival: "2025-11-27T06:20:00",
                  durationInMinutes: 380,
                  flightNumber: "38",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511271950-2511280110--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-27T19:50:00",
                  arrival: "2025-11-28T01:10:00",
                  durationInMinutes: 200,
                  flightNumber: "620",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.608826,
        },
        {
          id: "13548-2511150255--31939-1-10413-2511151315|10413-2511260835--31939-1-13548-2511270110",
          price: {
            raw: 1247.81,
            formatted: "$1,248",
            pricingOptionId: "tzu0tKzMB8Ad",
          },
          legs: [
            {
              id: "13548-2511150255--31939-1-10413-2511151315",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 860,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T02:55:00",
              arrival: "2025-11-15T13:15:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150255-2511150500--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T02:55:00",
                  arrival: "2025-11-15T05:00:00",
                  durationInMinutes: 245,
                  flightNumber: "621",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511150805-2511151315--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T08:05:00",
                  arrival: "2025-11-15T13:15:00",
                  durationInMinutes: 430,
                  flightNumber: "39",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511260835--31939-1-13548-2511270110",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 755,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T08:35:00",
              arrival: "2025-11-27T01:10:00",
              timeDeltaInDays: 1,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511260835-2511261655--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T08:35:00",
                  arrival: "2025-11-26T16:55:00",
                  durationInMinutes: 380,
                  flightNumber: "42",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511261950-2511270110--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-26T19:50:00",
                  arrival: "2025-11-27T01:10:00",
                  durationInMinutes: 200,
                  flightNumber: "620",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          tags: ["second_shortest"],
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.591221,
        },
        {
          id: "13548-2511150850--31939-1-10413-2511152030|10413-2511260835--31939-1-13548-2511270720",
          price: {
            raw: 1146.59,
            formatted: "$1,147",
            pricingOptionId: "j9vsY9wg82I8",
          },
          legs: [
            {
              id: "13548-2511150850--31939-1-10413-2511152030",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 940,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T08:50:00",
              arrival: "2025-11-15T20:30:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150850-2511151055--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T08:50:00",
                  arrival: "2025-11-15T10:55:00",
                  durationInMinutes: 245,
                  flightNumber: "629",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511151520-2511152030--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T15:20:00",
                  arrival: "2025-11-15T20:30:00",
                  durationInMinutes: 430,
                  flightNumber: "37",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511260835--31939-1-13548-2511270720",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 1125,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T08:35:00",
              arrival: "2025-11-27T07:20:00",
              timeDeltaInDays: 1,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511260835-2511261655--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T08:35:00",
                  arrival: "2025-11-26T16:55:00",
                  durationInMinutes: 380,
                  flightNumber: "42",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511270200-2511270720--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-27T02:00:00",
                  arrival: "2025-11-27T07:20:00",
                  durationInMinutes: 200,
                  flightNumber: "628",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.571078,
        },
        {
          id: "13548-2511150850--31939-1-10413-2511152030|10413-2511262200--31939-1-13548-2511280720",
          price: {
            raw: 1120.11,
            formatted: "$1,121",
            pricingOptionId: "2c5SggtyMVYN",
          },
          legs: [
            {
              id: "13548-2511150850--31939-1-10413-2511152030",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 940,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T08:50:00",
              arrival: "2025-11-15T20:30:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150850-2511151055--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T08:50:00",
                  arrival: "2025-11-15T10:55:00",
                  durationInMinutes: 245,
                  flightNumber: "629",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511151520-2511152030--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T15:20:00",
                  arrival: "2025-11-15T20:30:00",
                  durationInMinutes: 430,
                  flightNumber: "37",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511262200--31939-1-13548-2511280720",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 1760,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T22:00:00",
              arrival: "2025-11-28T07:20:00",
              timeDeltaInDays: 2,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511262200-2511270620--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T22:00:00",
                  arrival: "2025-11-27T06:20:00",
                  durationInMinutes: 380,
                  flightNumber: "38",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511280200-2511280720--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-28T02:00:00",
                  arrival: "2025-11-28T07:20:00",
                  durationInMinutes: 200,
                  flightNumber: "628",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.565759,
        },
        {
          id: "13548-2511150850--31939-1-10413-2511161400|10413-2511261515--31939-1-13548-2511270720",
          price: {
            raw: 1106.11,
            formatted: "$1,107",
            pricingOptionId: "GAZWGCtZXgRq",
          },
          legs: [
            {
              id: "13548-2511150850--31939-1-10413-2511161400",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 1990,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T08:50:00",
              arrival: "2025-11-16T14:00:00",
              timeDeltaInDays: 1,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150850-2511151055--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T08:50:00",
                  arrival: "2025-11-15T10:55:00",
                  durationInMinutes: 245,
                  flightNumber: "629",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511160850-2511161400--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-16T08:50:00",
                  arrival: "2025-11-16T14:00:00",
                  durationInMinutes: 430,
                  flightNumber: "43",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511261515--31939-1-13548-2511270720",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 725,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T15:15:00",
              arrival: "2025-11-27T07:20:00",
              timeDeltaInDays: 1,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511261515-2511262335--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T15:15:00",
                  arrival: "2025-11-26T23:35:00",
                  durationInMinutes: 380,
                  flightNumber: "40",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511270200-2511270720--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-27T02:00:00",
                  arrival: "2025-11-27T07:20:00",
                  durationInMinutes: 200,
                  flightNumber: "628",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.564358,
        },
        {
          id: "13548-2511150850--31939-1-10413-2511152030|10413-2511262200--31939-1-13548-2511280110",
          price: {
            raw: 1149.2,
            formatted: "$1,150",
            pricingOptionId: "XbROPR8kZpgF",
          },
          legs: [
            {
              id: "13548-2511150850--31939-1-10413-2511152030",
              origin: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              destination: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              durationInMinutes: 940,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-15T08:50:00",
              arrival: "2025-11-15T20:30:00",
              timeDeltaInDays: 0,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "13548-11089-2511150850-2511151055--31939",
                  origin: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-15T08:50:00",
                  arrival: "2025-11-15T10:55:00",
                  durationInMinutes: 245,
                  flightNumber: "629",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-10413-2511151520-2511152030--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  departure: "2025-11-15T15:20:00",
                  arrival: "2025-11-15T20:30:00",
                  durationInMinutes: 430,
                  flightNumber: "37",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
            {
              id: "10413-2511262200--31939-1-13548-2511280110",
              origin: {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
                displayCode: "CDG",
                city: "Paris",
                country: "France",
                isHighlighted: false,
              },
              destination: {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
                displayCode: "LHE",
                city: "Lahore",
                country: "Pakistan",
                isHighlighted: false,
              },
              durationInMinutes: 1390,
              stopCount: 1,
              isSmallestStops: false,
              departure: "2025-11-26T22:00:00",
              arrival: "2025-11-28T01:10:00",
              timeDeltaInDays: 2,
              carriers: {
                marketing: [
                  {
                    id: -31939,
                    alternateId: "QR",
                    logoUrl:
                      "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
                    name: "Qatar Airways",
                    allianceId: 0,
                  },
                ],
                operationType: "fully_operated",
              },
              segments: [
                {
                  id: "10413-11089-2511262200-2511270620--31939",
                  origin: {
                    flightPlaceId: "CDG",
                    displayCode: "CDG",
                    parent: {
                      flightPlaceId: "PARI",
                      displayCode: "PAR",
                      name: "Paris",
                      type: "City",
                    },
                    name: "Paris Charles de Gaulle",
                    type: "Airport",
                    country: "France",
                  },
                  destination: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  departure: "2025-11-26T22:00:00",
                  arrival: "2025-11-27T06:20:00",
                  durationInMinutes: 380,
                  flightNumber: "38",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
                {
                  id: "11089-13548-2511271950-2511280110--31939",
                  origin: {
                    flightPlaceId: "DOH",
                    displayCode: "DOH",
                    parent: {
                      flightPlaceId: "DOHA",
                      displayCode: "DOH",
                      name: "Doha",
                      type: "City",
                    },
                    name: "Hamad International",
                    type: "Airport",
                    country: "Qatar",
                  },
                  destination: {
                    flightPlaceId: "LHE",
                    displayCode: "LHE",
                    parent: {
                      flightPlaceId: "LHEA",
                      displayCode: "LHE",
                      name: "Lahore",
                      type: "City",
                    },
                    name: "Lahore",
                    type: "Airport",
                    country: "Pakistan",
                  },
                  departure: "2025-11-27T19:50:00",
                  arrival: "2025-11-28T01:10:00",
                  durationInMinutes: 200,
                  flightNumber: "620",
                  marketingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                  operatingCarrier: {
                    id: -31939,
                    name: "Qatar Airways",
                    alternateId: "QR",
                    allianceId: 0,
                    displayCode: "",
                  },
                },
              ],
            },
          ],
          isSelfTransfer: false,
          isProtectedSelfTransfer: false,
          farePolicy: {
            isChangeAllowed: false,
            isPartiallyChangeable: false,
            isCancellationAllowed: false,
            isPartiallyRefundable: false,
          },
          fareAttributes: {},
          isMashUp: false,
          hasFlexibleOptions: false,
          score: 0.556058,
        },
      ],
      messages: [],
      filterStats: {
        duration: {
          min: 860,
          max: 1990,
          multiCityMin: 1585,
          multiCityMax: 2715,
        },
        airports: [
          {
            city: "Lahore",
            airports: [
              {
                id: "LHE",
                entityId: "128667890",
                name: "Lahore",
              },
            ],
          },
          {
            city: "Paris",
            airports: [
              {
                id: "CDG",
                entityId: "95565041",
                name: "Paris Charles de Gaulle",
              },
            ],
          },
        ],
        carriers: [
          {
            id: -31939,
            alternateId: "QR",
            logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/QR.png",
            name: "Qatar Airways",
            allianceId: 0,
          },
        ],
        stopPrices: {
          direct: {
            isPresent: false,
          },
          one: {
            isPresent: true,
            formattedPrice: "$1,078",
          },
          twoOrMore: {
            isPresent: false,
          },
        },
        alliances: [],
      },
      flightsSessionId: "4ec35238-03b1-4f25-a5db-3ac50dd78247",
      destinationImageUrl:
        "https://content.skyscnr.com/m/3719e8f4a5daf43d/original/Flights-Placeholder.jpg",
    },
  });

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">
          <Box textAlign="center" mt={4}>
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

                {/* Departure Date Picker */}
                <Grid item xs={12} sm={6} md={datePickerGridSize}>
                  <DatePicker
                    label="Date"
                    minDate={dayjs().add(1, "day")}
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
                            Prices include required taxes + fees for{" "}
                            {passengers} passengers. Optional charges and bag
                            fees may apply.
                          </Typography>
                        </div>
                        <div>Sorting here</div>
                      </Grid>
                    </div>

                    {flightResults.data?.itineraries?.length > 0 ? (
                      flightResults.data.itineraries.map((itinerary, index) => (
                        <FlightItineraryCard
                          key={index}
                          itinerary={itinerary}
                        />
                      ))
                    ) : (
                      <Typography>
                        No flight itineraries found for these parameters.
                      </Typography>
                    )}
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
