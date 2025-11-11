import axios from "axios";

// const API_KEY = import.meta.env.VITE_API_KEY;
const API_KEY = "fec23d52f1mshb76998ba9832087p12a9d7jsn98620aa23fde";
// const API_HOST = import.meta.env.VITE_API_HOST;
const API_HOST = "sky-scrapper.p.rapidapi.com";

const apiClient = axios.create({
  baseURL: `https://${API_HOST}/api/v1/flights`,
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  },
});

const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

export const getNearByAirport = async ({ lat, long }) =>
  fetchFromAPI("/getNearByAirports", {
    lat,
    lng: long,
    locale: "en-US",
  });

export const searchAirports = async (query) =>
  fetchFromAPI("/searchAirport", {
    query,
    locale: "en-US",
  });

export const searchFlights = async ({
  origId,
  destId,
  origEId,
  destEId,
  date,
  cabinClass,
  adults,
  returnDate,
}) => {
  return fetchFromAPI("/searchFlights", {
    originSkyId: origId,
    destinationSkyId: destId,
    originEntityId: origEId,
    destinationEntityId: destEId,
    date,
    returnDate,
    cabinClass: cabinClass,
    adults,
    sortBy: "best",
    currency: "USD",
    market: "en-US",
    countryCode: "US",
    limit: '20',
  });
};
