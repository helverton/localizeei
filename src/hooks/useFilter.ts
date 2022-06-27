import { useContext } from "react";
import { FilterContext } from "@/contexts/FilterContext";

export function useFilter() {
  const value = useContext(FilterContext)

  return value;
}
