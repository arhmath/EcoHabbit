# 04b - User Flow

Versi v0.1 (draft).

## Alur Utama Aplikasi

Use case diagram menjawab "siapa bisa melakukan apa"; user flow menjawab "urutan layar yang dilalui". Alur di bawah mengikuti fitur pada notes tim.

```mermaid
flowchart TD
    A([Buka aplikasi]) --> B[Splash dan layar pembuka]
    B --> C{Sudah punya akun?}
    C -- Belum --> D[Registrasi]
    D --> E[Login]
    C -- Sudah --> E
    E --> F{Role}
    F -- user --> G[Dashboard user]
    F -- admin --> H[Dashboard admin]

    G --> G1[Catat pemilahan sampah]
    G --> G2[Challenge]
    G --> G3[Level dan modul pengantar]
    G --> G4[Leaderboard]
    G --> G5[Reward dan penukaran]
    G --> G6[Komunitas]
    G --> G7[Profil]
    G6 --> G61[Daftar event]
    G6 --> G62{Level memenuhi syarat?}
    G62 -- Ya --> G63[Buat event]
    G62 -- Tidak --> G6

    H --> H1[Kelola challenge dan tantangan dadakan]
    H --> H2[Pantau skor XP dan poin]
    H --> H3[Kelola voucher dan reward]
    H --> H4[Pantau event komunitas]
    H --> H5[Profil admin]
```

## Alur Pencatatan Pemilahan Sampah (UC-U07)

Komponen mengikuti arsitektur Infrastructure: web app, backend, object storage, dan layanan klasifikasi.

```mermaid
sequenceDiagram
    actor U as User
    participant W as Web App
    participant B as Backend
    participant S as Object Storage
    participant M as Layanan Klasifikasi (AI)
    participant D as Database

    U->>W: Pilih foto sampah
    W->>B: Unggah foto
    B->>B: Validasi tipe dan ukuran
    alt File tidak valid
        B-->>W: Tolak, tampilkan pesan
    else File valid
        B->>S: Simpan foto
        B->>M: Minta deteksi
        M-->>B: Kelas, jumlah, confidence
        B->>D: Simpan pemilahan (pending) dan deteksi
        B-->>W: Tampilkan hasil deteksi
        U->>W: Tinjau, koreksi jumlah, konfirmasi
        W->>B: Konfirmasi
        B->>D: Set confirmed, hitung XP dan poin
        B->>D: Perbarui streak, progres challenge, level
        B-->>W: Ringkasan hasil
    end
```

## Alur Penukaran Reward (UC-U10)

```mermaid
flowchart LR
    A[Buka katalog reward] --> B[Pilih reward]
    B --> C{Poin cukup dan stok ada?}
    C -- Tidak --> D[Tampilkan penolakan] --> A
    C -- Ya --> E[Konfirmasi penukaran]
    E --> F[Kurangi poin dan catat transaksi]
    F --> G[Terbitkan kode penukaran]
```
