import { useContext } from "react";
import { ProfileContext } from "@/contexts/ProfileContext";

export function useProfile() {
  const value = useContext(ProfileContext)

  return value;
}
