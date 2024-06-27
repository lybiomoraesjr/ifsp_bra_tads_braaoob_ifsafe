import { useContext } from "react";
import { OccurrenceContext } from "@/contexts/OccurrenceContext";

export const useOccurrence = () => {
  const context = useContext(OccurrenceContext);

  return context;
};
