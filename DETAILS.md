# One Time Message (OTM)
Bu repo, “one-time message” (tek seferlik okunabilen mesaj) deneyimi sunan bir uygulamadır.

Özet akış:
- Gönderen mesajı **tarayıcıda şifreler**.
- Backend, sadece **şifreli payload** saklar ve bir `id` döner.
- Alıcı `id` ile payload’ı çeker, **client-side decrypt** eder.
- Decrypt **başarılıysa** (MAGIC_PREFIX doğrulanır), mesaj gösterilir ve ardından backend’de **silinir (burn-after-read)**.

## Klasör yapısı
- `frontend/`: React + Vite SPA (MUI, React Router, Zustand)
- `backend/`: Node.js (ESM) Express API + MySQL

## Güvenlik modeli (kısaca)
Bu uygulama, “backend plaintext görmesin” prensibiyle tasarlanmıştır.

- Plaintext mesaj **asla backend’e gönderilmez**.
- Backend sadece `encryptedData` (ciphertext) saklar.
- Anahtar türetme: Kullanıcı “secret” (password veya URL fragment’ten gelen secret) verir, frontend bunu **PBKDF2** ile AES anahtarına çevirir.
- Mesaj bütünlüğü/”doğru şifre” doğrulaması:
  - Encrypt ederken plaintext’in başına `OTM_SECURE_MSG::` (MAGIC_PREFIX) eklenir.
  - Decrypt sonrası bu prefix yoksa, “yanlış secret / bozuk veri” kabul edilir ve **mesaj silinmez**.

Önemli notlar:
- URL fragment (`#...`) sunucuya gönderilmez; ancak link’i ele geçiren biri secret’ı da alır. Bu mod, pratikte “şifre” gibi değil “paylaşılan anahtar (secret)” gibi davranır.
- `PBKDF2` salt şu an statik. Üretim için per-message salt (ve iteration arttırma) daha doğru olur.

## Nasıl çalışır? (detaylı akış)
### 1) Sender (Mesaj oluşturma)
Kod: `frontend/src/pages/SenderPage.jsx`
1. Kullanıcı mesajı girer.
2. Secret seçimi:
   - Password varsa secret = password
   - Password yoksa secret = `generateKey()` ile üretilen random string
3. AES key türetme:
   - `key = deriveKeyFromPassword(secret)` (PBKDF2)
4. Encrypt:
   - `encryptMessage(message, key)`
   - Encrypt ederken plaintext’e MAGIC_PREFIX eklenir.
5. Backend’e kaydet:
   - `POST /` body: `{ encryptedData, expiresAt }`
   - Response: `{ id }`
6. Paylaşılacak link:
   - Password yoksa: `/${id}#<secret>`
   - Password varsa: `/${id}` (alıcı password’ü manuel girecek)

### 2) Receiver (Link ile okuma) — `/:id`
Kod: `frontend/src/pages/ReceiverPageQuery.jsx`
1. Sayfa `id` parametresi ile açılır.
2. Secret kaynağı:
   - URL hash varsa `#<secret>` → otomatik decrypt denenir.
   - Hash yoksa kullanıcıdan password istenir.
3. Payload çekme:
   - `GET /:id` → `{ encryptedData, expiresAt, createdAt }`
4. AES key türetme:
   - `key = deriveKeyFromPassword(secret)`
5. Decrypt:
   - `decryptMessage(encryptedData, key)`
   - MAGIC_PREFIX doğrulanır.
6. Prefix valid ise:
   - Plaintext UI’da gösterilir.
   - Ardından burn tetiklenir: `DELETE /:id`
   - Burn başarısız olursa “silent retry” (sessiz tekrar deneme) uygulanır.
7. Prefix invalid ise:
   - “Wrong password / invalid key” hatası gösterilir.
   - **DELETE çağrılmaz** (mesaj gerçek alıcı tarafından henüz okunmadı varsayımı).

### 3) Receiver (Manuel ekran) — `/receiver`
Kod: `frontend/src/pages/ReceiverPage.jsx`
- Kullanıcı `id` ve password girerek aynı consume akışını çalıştırır.

## Kripto yardımcıları
Kod: `frontend/src/utils/crypto.js`
- `generateKey()`
  - Password yokken URL fragment’e koymak için random “secret” üretir.
- `deriveKeyFromPassword(passwordOrSecret)`
  - PBKDF2 ile 256-bit key türetir.
- `encryptMessage(message, key)`
  - `OTM_SECURE_MSG::` prefix ekler, AES encrypt eder.
- `decryptMessage(encryptedMessage, key)`
  - AES decrypt eder, MAGIC_PREFIX kontrol eder.
  - Prefix yoksa `null` döner.

## Frontend state yönetimi (Zustand)
### Sender store
Kod: `frontend/src/store/useSenderStore.js`
- Backend’e “create message” çağrısını yönetir.
- State:
  - `status: idle | sending | sent | error`
  - `error`, `lastId`

### Receiver store
Kod: `frontend/src/store/useReceiverStore.js`
- Backend’den mesajı çekme + decrypt + (valid ise) burn işlemlerini yönetir.
- State:
  - `status: idle | loading | decrypting | ready | error`
  - `burnStatus: idle | deleting | deleted | error`
  - `encryptedData`, `expiresAt`, `error`

Plaintext neden store’da değil?
- Plaintext “global state”te durmasın diye **component-local state** olarak tutulur (daha güvenli ve daha az sızıntı yüzeyi).

## Backend API
Kod: `backend/server.js`

### Veritabanı
- Tablo: `messages`
  - `id` (UUID)
  - `encrypted_text` (LONGTEXT)
  - `expires_at` (DATETIME, null olabilir)
  - `created_at` (DATETIME)

Not: `expires_at` daha önce yoksa backend startup sırasında `ALTER TABLE` ile eklemeyi dener.

### Endpoint’ler
- `POST /`
  - Body: `{ encryptedData: string, expiresAt?: string }`
  - 201 Response: `{ id: string }`
- `GET /:id`
  - 200 Response: `{ encryptedData: string, expiresAt: string|null, createdAt: string }`
  - 404: bulunamadı / daha önce silinmiş
  - 410: expired (backend mesajı siler)
- `DELETE /:id`
  - 200 Response: `{ ok: true }`
  - 404: zaten silinmiş

### CORS
- Env: `CORS_ORIGIN` (virgülle birden fazla origin verilebilir)
- Örnek: `CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173`

## Ortam değişkenleri
### Backend (`backend/.env`)
Minimum:
- `PORT=3001`
- `CORS_ORIGIN=http://localhost:5173`
- `DB_USER=...`
- `DB_PASSWORD=...`

Opsiyonel:
- `DB_HOST=localhost`
- `DB_NAME=otm_db`

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL=http://localhost:3001`

## Lokal geliştirme (dev)
Ayrı terminallerde:

Backend:
```sh
cd backend
npm install
npm run dev
```

Frontend:
```sh
cd frontend
npm install
npm run dev
```

Lint:
```sh
cd frontend
npm run lint
```

## Kullanım senaryoları
### Şifresiz (linkte secret var)
1. `/sender` → password boş bırak.
2. Link: `/${id}#<secret>` oluşur.
3. Link açılınca otomatik decrypt denenir.

### Şifreli (secret paylaşımı ayrı kanal)
1. `/sender` → password gir.
2. Link: `/${id}` oluşur.
3. Alıcı sayfada password girer (veya `/receiver` ekranında id+password girer).

## Yaygın sorunlar / Troubleshooting
- CORS hatası:
  - Backend `CORS_ORIGIN` değeri, frontend’in origin’i ile eşleşmeli.
- 404 “Message not found or destroyed”:
  - Mesaj daha önce okunmuş ve silinmiş olabilir.
  - `id` yanlış olabilir.
- 410 “Message expired”:
  - `expiresAt` geçmişe düştü ve backend mesajı silmiş olabilir.
- Wrong password / invalid key:
  - MAGIC_PREFIX doğrulanamadı → secret yanlış veya ciphertext bozuk.

## Bilinen limitler / İyileştirme fikirleri
- PBKDF2 salt statik. Üretimde per-message salt + daha yüksek iteration önerilir.
- “True one-time guarantee” tamamen frontend’e bağlı (valid read sonrası DELETE). Daha güçlü garanti için backend’de transactional consume endpoint tasarlanabilir; ama bu proje gereksinimi gereği “yanlış şifre giren mesajı yakmasın” davranışı önceliklidir.
- Secret URL fragment ile taşınıyorsa link ele geçirilince mesaj açılabilir; bu kaçınılmazdır.

## Repo notları
- `backend/` klasörü git’te untracked olabilir; ekip çalışmasında backend değişikliklerinin kaybolmaması için repo’ya dahil edilmesi önerilir.
