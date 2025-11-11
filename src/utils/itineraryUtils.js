import dayjs from "dayjs";

export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}hr ${m}min`;
};

export const hasOvernight = (itinerary) => {
  try {
    for (const leg of itinerary.legs || []) {
      for (let i = 0; i < (leg.segments || []).length; i++) {
        const seg = leg.segments[i];
        if (dayjs(seg.arrival).day() !== dayjs(seg.departure).day()) return true;
        if (i < leg.segments.length - 1) {
          const next = leg.segments[i + 1];
          const minutes = dayjs(next.departure).diff(dayjs(seg.arrival), "minute");
          if (minutes > 6 * 60) return true;
        }
      }
    }
  } catch (e) {
    // swallow and return false if API shape unexpected
    console.error("hasOvernight check failed", e);
  }
  return false;
};

export default { formatDuration, hasOvernight };

export const INITIAL_LONDON = {
  skyId: "LOND",
  entityId: "27544008",
  localizedName: "London (Any)",
  suggestionTitle: "London (Any)",
  subtitle: "United Kingdom",
};

export const INITIAL_NEW_YORK = {
  skyId: "NYCA",
  entityId: "27537542",
  localizedName: "New York (Any)",
  suggestionTitle: "New York (Any)",
  subtitle: "United States",
};