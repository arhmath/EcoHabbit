# 04a - Pemetaan Fitur ke Layar Figma

Versi v0.1 (draft Fase 1). Dibuat dari daftar nama frame Figma (isi layar belum diverifikasi satu per satu). Tautan Figma: **[isi tautan Figma]**.

Desain Figma saat ini berasal dari proyek UINIC 2025 (aplikasi habit tracker hijau) yang dialihkan ke tema daur ulang sesuai notes tim. Karena itu sebagian layar masih memuat konten proyek asal.

## 1. Fitur notes yang sudah punya layar

| Fitur (notes) | Frame Figma | Catatan verifikasi |
|---|---|---|
| Splash Screen | Animasi 1 sampai 5, Slide Tampilan Awal 1 sampai 3 | |
| Autentikasi | Login Blank/Filed, Register Blank/Filed, transit in, transit log out | |
| User Dashboard | Dashboard, Progres | Cek: jumlah sampah, streak mingguan/bulanan, ringkasan mingguan |
| Profile | Profile | |
| Challenge Page | Tantangan, Pop Up Mulai Tantangan (2 frame) | Konten masih tema proyek asal |
| Level | Level | Modul pengantar belum terlihat |
| Reward dan Redeem | Hadiah & Eco-Poin, Hadiah dan Penukaran, Pop Up Penukaran, Penghargaan | |
| Community Page | Komunitas, Acara & Workshop | Form buat event belum terlihat |
| Input Pemilahan Sampah | Catat Pemilahan Sampah, Pop Up Pemilahan Sampah, Pilotingan Sampah Harian | Sebagian; alur AI belum ada |
| Streak, Score System | Kemungkinan di Dashboard atau Progres | Perlu dicek |

## 2. Layar yang belum ada (perlu dirancang)

| Prioritas | Layar | Kebutuhan | Use case |
|---|---|---|---|
| Tinggi | Unggah atau ambil foto sampah | FR-09 | UC-U07 |
| Tinggi | Hasil deteksi AI (6 kelas + jumlah) dan koreksi | FR-10, FR-11 | UC-U07 |
| Tinggi | Dashboard admin (statistik) | FR-08 | UC-A02 |
| Tinggi | Admin: daftar dan form challenge, tantangan dadakan | FR-19 | UC-A04, UC-A05 |
| Tinggi | Admin: form dan daftar voucher dan reward | FR-21 | UC-A07 |
| Sedang | Admin: pantau skor XP dan poin | FR-20 | UC-A06 |
| Sedang | Admin: pantau event | FR-26 | UC-A08 |
| Sedang | Leaderboard | FR-17 | UC-U09 |
| Sedang | Modul pengantar level (refleksi diri) | FR-16 | UC-U05 |
| Sedang | Form buat event (user, level tertentu) | FR-25 | UC-U13 |
| Rendah | Profil admin | FR-07 | UC-A03 |

## 3. Frame sisa proyek asal (perlu keputusan)

Frame berikut mengikuti tema habit tracker proyek asal dan belum tentu relevan pada versi daur ulang. Putuskan per frame: **hapus**, **pertahankan sebagai contoh isi challenge**, atau **adaptasi**.

| Frame | Keputusan |
|---|---|
| Panduan Kompos | [ ] |
| Catat Item Dihindari | [ ] |
| Menu Hemat Energi Rumah, Pop Up Mulai Tantangan Hemat Energi Rumah | [ ] |
| Menu Minimalisir Botol Plastik, Pop Up Mulai Tantangan Minimalisir Botol Plastik | [ ] |
| Bebas Kantong Plastik | [ ] |

Frame Kebijakan Privasi, Syarat & Ketentuan, dan Notifikasi tidak ada di notes tetapi tidak bertentangan; dipertahankan.

## 4. Catatan kebersihan berkas Figma

- Ada frame ganda bernama sama (Pop Up Pemilahan Sampah, Pop Up Penukaran, Hadiah dan Penukaran, Login/Register). Beri akhiran versi atau hapus yang usang.
- `Login Filed` dan `Regisetr Blank` salah ketik; `Filed` kemungkinan maksud `Filled`.
- Layer `image 5/6/7`, `Vector`, `Save` sebaiknya dirapikan ke dalam frame induknya.
