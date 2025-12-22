import { create } from "zustand";

import { createMessage } from "../api/otmApi";

const useSenderStore = create((set) => ({
  status: "idle", // idle | sending | sent | error
  error: null,
  lastId: null,

  reset: () => set({ status: "idle", error: null, lastId: null }),

  createEncryptedMessage: async ({ encryptedData, expiresAt }) => {
    set({ status: "sending", error: null });

    try {
      const { id } = await createMessage({ encryptedData, expiresAt });
      set({ status: "sent", lastId: id });
      return { id };
    } catch (err) {
      set({ status: "error", error: err?.message || "Failed to create message" });
      return null;
    }
  },
}));

export default useSenderStore;
