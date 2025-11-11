import dayjs from "dayjs";

export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} hr ${m} min`;
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
    console.error("hasOvernight check failed", e);
  }
  return false;
};

export default { formatDuration, hasOvernight };

export const DEST = {
  skyId: "DXB",
  entityId: "95673506",
  localizedName: "Dubai",
  suggestionTitle: "Dubai (DXB)",
  subtitle: "United Arab Emirates",
};

export const DEPART = {
  skyId: "LHE",
  entityId: "128667890",
  localizedName: "Lahore",
  suggestionTitle: "Lahore (LHE)",
  subtitle: "Pakistan",
};
