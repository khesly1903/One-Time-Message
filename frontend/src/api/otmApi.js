const getBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw) {
    throw new Error("VITE_API_BASE_URL is not set");
  }
  return raw.replace(/\/$/, "");
};

const requestJson = async (path, { method = "GET", body } = {}) => {
  const url = `${getBaseUrl()}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const createMessage = async ({ encryptedData, expiresAt }) => {
  const data = await requestJson("/", {
    method: "POST",
    body: { encryptedData, expiresAt },
  });

  // tolerate older responses
  const id = data?.id;
  if (!id) throw new Error("Create message response did not include id");
  return { id };
};

export const getMessage = async (id) => {
  const data = await requestJson(`/${encodeURIComponent(id)}`);

  // tolerate older backend field names
  const encryptedData = data?.encryptedData ?? data?.encrypted_text;
  const expiresAt = data?.expiresAt ?? data?.expires_at;

  if (!encryptedData) {
    throw new Error("Message response did not include encryptedData");
  }

  return { encryptedData, expiresAt };
};

export const deleteMessage = async (id) => {
  await requestJson(`/${encodeURIComponent(id)}`, { method: "DELETE" });
  return { ok: true };
};
