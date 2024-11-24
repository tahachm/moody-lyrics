import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// Configure recoil-persist
const { persistAtom } = recoilPersist();

// Atom for storing the user ID
export const userIdState = atom<string | null>({
  key: "userIdState", // Unique key for the atom
  default: null, // Default value
  effects_UNSTABLE: [persistAtom], // Add persistAtom to persist state
});


export const isAuthenticatedState = atom<boolean>({
  key: "isAuthenticatedState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
