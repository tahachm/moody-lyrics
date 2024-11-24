import { atom } from "recoil";

// Atom for storing the user ID
export const userIdState = atom<string | null>({
  key: "userIdState", // Unique key for the atom
  default: null, // Default value
});

// Add other atoms here as needed
