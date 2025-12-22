import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create the store with persistence middleware
const useThemeStore = create(
  persist(
    (set) => ({
      mode: "dark",

      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === "dark" ? "light" : "dark",
        })),
    }),
    {
      // name of the item in the slocalStorage
      name: "theme-storage",
    }
  )
);

export default useThemeStore;
