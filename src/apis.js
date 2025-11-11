import axios from "axios";

let API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
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

export const setApiKey = (newKey) => {
  if (!newKey) return;
  API_KEY = newKey;
  if (apiClient && apiClient.defaults && apiClient.defaults.headers) {
    apiClient.defaults.headers["x-rapidapi-key"] = newKey;
  }
};
