import { useContext } from "react";
import { CardContext } from "@/contexts/CardContext";

export function useCard() {
  const value = useContext(CardContext)

  return value;
}
