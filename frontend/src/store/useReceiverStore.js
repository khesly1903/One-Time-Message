import { create } from "zustand";

import { deleteMessage, getMessage } from "../api/otmApi";
import { decryptMessage, deriveKeyFromPassword } from "../utils/crypto";

const burnMessage = async (id) => {
  await deleteMessage(id);
  return true;
};

const useReceiverStore = create((set) => ({
  status: "idle", // idle | loading | decrypting | ready | error
  burnStatus: "idle", // idle | deleting | deleted | error
  encryptedData: null,
  expiresAt: null,
  error: null,

  reset: () =>
    set({
      status: "idle",
      burnStatus: "idle",
      encryptedData: null,
      expiresAt: null,
      error: null,
    }),

  consumeMessage: async ({ id, secret }) => {
    set({ status: "loading", burnStatus: "idle", error: null });

    try {
      const { encryptedData, expiresAt } = await getMessage(id);
      set({ encryptedData, expiresAt, status: "decrypting" });

      const key = deriveKeyFromPassword(secret);
      const plaintext = decryptMessage(encryptedData, key);

      if (!plaintext) {
        set({ status: "error", error: "Wrong password / invalid key" });
        return null;
      }

      set({ status: "ready", error: null, burnStatus: "deleting" });

      try {
        const ok = await burnMessage(id);
        set({ burnStatus: ok ? "deleted" : "error" });
      } catch (error) {
        console.log("error from", error);
        set({ burnStatus: "error" });
      }

      return plaintext;
    } catch (err) {
      set({
        status: "error",
        error: err?.message || "Failed to load message",
      });
      return null;
    }
  },
}));

export default useReceiverStore;
