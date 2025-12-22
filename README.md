# One Time Message (OTM)

This project is an application designed to securely share short-lived messages that are intended to be read only once.

Core idea:
- The message is **encrypted on the sender’s device**.
- The server (backend) **stores only encrypted data**.
- The message is **decrypted on the recipient’s device**.
- If decryption is truly successful (i.e. the message is opened with the **correct key**), the message is **deleted from the server (burn-after-read)**.

## Project Goal

The project targets a common real-world need:
- Sending “one-time” sensitive information (tokens, passwords, notes, short messages).
- Ensuring that no readable plaintext copy is ever created on the server during the sharing process.
- Even if the link/ID is compromised, the server (and its logs / database) never sees the plaintext.

This project is not a “chat” application; it focuses on the **secure storage and one-time consumption** of messages rather than continuous communication.

## Zero-Knowledge Architecture Approach

In this project, “zero-knowledge” means:
- The backend **cannot cryptographically know** the message content.
- The server does not have access to the key required to decrypt the message.
- Since no plaintext exists on the server side, even if the server is compromised, the database will contain **only ciphertext**.

The server’s role in this architecture is limited to:
- Storing the encrypted payload
- Returning it via an `id`
- Deleting it after a valid read occurs

This shifts security away from “trusting the server” toward a model that **assumes the server should not be trusted**.

## End-to-End Encryption (E2EE) Model

In this application, E2EE is interpreted as follows:
- The message is encrypted on the sender’s device.
- Decryption happens only on the recipient’s device.
- The intermediate server cannot read the message content.

Important nuance:
- If the secret (password/key) is embedded in the link (via a `#fragment`), anyone who obtains the link can decrypt the message. In this case, security relies on link secrecy.
- If the secret is shared via a separate channel (e.g. the recipient manually enters the password), the message may remain protected even if the link itself is leaked.

In short, the project provides an end-to-end encrypted experience where the server does not know the message, but **who can read the message depends on how the secret is shared**.

## How Is “Burn-After-Read” Defined?

“Read” does not simply mean that the page was opened.

In this project, burn-after-read depends on the following condition:
- After decryption, if the expected “verification marker” (`MAGIC_PREFIX`) is present in the content, this indicates that the message was decrypted with the **correct secret**.
- In this case, the message is displayed to the user and then deleted from the server.
- If `MAGIC_PREFIX` is missing, the secret is likely incorrect, and the message is **not deleted** (because the real recipient has not read it).

This approach prevents a message from being accidentally destroyed by someone repeatedly trying incorrect passwords.

## Storage Duration / Expiry

Messages may also have an expiration time:
- Once expired, the message becomes inaccessible on the backend.
- The goal is to prevent messages from being stored indefinitely, even if they are never read.

## Security Scope and Intentional Limitations

- The project provides strong privacy by ensuring that plaintext never exists on the server.
- However, unauthorized access may still occur if link/secret sharing is poorly managed (e.g. leakage of a fragment-based link).
- Instead of a strict “exactly-once guarantee” (atomic consumption), the system follows a “delete after valid read” model, intentionally avoiding message destruction on incorrect password attempts.