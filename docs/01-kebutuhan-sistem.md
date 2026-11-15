# 01 - Dokumen Kebutuhan Sistem EcoHabbit

| | |
|---|---|
| Versi | v0.1 (draft Fase 1) |
| Penyusun | Aqib Khoiruzaman (Information Systems) |
| Status | Draft. Direvisi per sprint, lihat [CHANGELOG](CHANGELOG.md) |

## 1. Gambaran Sistem

EcoHabbit adalah aplikasi web berbasis gamifikasi untuk membangun kebiasaan memilah dan mendaur ulang sampah. Pengguna mencatat pemilahan sampah harian dengan foto; model AI (object detection multilabel) mengenali jenis dan jumlah sampah, lalu sistem memberi XP dan poin. XP menaikkan level (1 sampai 5), poin ditukar dengan reward. Komunitas dan event mendorong keterlibatan.

## 2. Aktor

| Aktor | Deskripsi |
|---|---|
| User | Pengguna terdaftar yang memilah sampah, mengikuti challenge, menukar reward, dan berpartisipasi di komunitas |
| Admin | Pengelola konten dan pemantau: challenge, reward, event, statistik |
| Model AI (aktor sistem) | Layanan klasifikasi yang mendeteksi jenis dan jumlah sampah dari foto |

Otorisasi bersifat role-based (RBAC): satu akun memiliki satu role (`user` atau `admin`). Pembatasan akses halaman dan endpoint mengikuti role ini.

### 2.1 Matriks Hak Akses (RBAC)

Tanda ✓ berarti boleh, tanda - berarti ditolak. Pengunjung adalah orang yang belum login. Matriks disusun dari pembagian Admin dan User pada notes tim.

| Fitur | Pengunjung | User | Admin |
|---|---|---|---|
| Registrasi | ✓ | - | - |
| Login | ✓ | ✓ | ✓ |
| Dashboard user (ringkasan aktivitas) | - | ✓ | - |
| Dashboard admin (statistik) | - | - | ✓ |
| Profil sendiri (lihat, ubah) | - | ✓ | ✓ |
| Modul pengantar level | - | ✓ | - |
| Challenge: lihat dan ikuti | - | ✓ | - |
| Challenge: buat, ubah, nonaktifkan, tantangan dadakan | - | - | ✓ |
| Catat pemilahan sampah (unggah dan konfirmasi deteksi AI) | - | ✓ | - |
| Streak, level, skor milik sendiri | - | ✓ | - |
| Pantau skor XP dan poin semua user | - | - | ✓ |
| Leaderboard | - | ✓ | - |
| Reward: lihat katalog dan tukar | - | ✓ | - |
| Reward dan voucher: tambah, ubah, nonaktifkan | - | - | ✓ |
| Event: lihat dan daftar | - | ✓ | - |
| Event: buat (hanya bila level memenuhi syarat) | - | ✓ | - |
| Event: pantau dan batalkan | - | - | ✓ |

Aturan tambahan:
- **Kepemilikan data:** user hanya dapat mengakses data miliknya sendiri (pemilahan, penukaran, profil, riwayat poin). Penegakannya di backend, bukan hanya dengan menyembunyikan menu di antarmuka.
- **Penolakan:** akses tanpa login diarahkan ke halaman login; akses ke fitur yang bukan haknya ditolak (HTTP 403) dan dicatat.
- **Pembuatan akun admin:** registrasi publik hanya menghasilkan role `user`. Akun admin dibuat lewat seeder atau oleh admin lain (asumsi A-06).

## 3. Kebutuhan Fungsional

Prioritas memakai MoSCoW: **M**ust, **S**hould, **C**ould. ID dipakai sebagai referensi silang ke use case dan ERD.

### 3.1 Autentikasi dan otorisasi

| ID | Kebutuhan | Aktor | Prioritas |
|---|---|---|---|
| FR-01 | Sistem menyediakan registrasi akun untuk user | User | M |
| FR-02 | Sistem menyediakan login untuk user dan admin | User, Admin | M |
| FR-03 | Sistem membatasi akses halaman dan data berdasarkan role | Semua | M |
| FR-04 | Sistem menampilkan splash screen dan layar pembuka saat pertama dibuka | User | S |

### 3.2 Dashboard dan profil

| ID | Kebutuhan | Aktor | Prioritas |
|---|---|---|---|
| FR-05 | Dashboard user menampilkan ringkasan aktivitas: jumlah sampah didaur ulang, streak mingguan/bulanan, ringkasan mingguan | User | M |
| FR-06 | User dapat melihat dan mengubah profil | User | M |
| FR-07 | Admin dapat melihat dan mengubah profil admin | Admin | S |
| FR-08 | Dashboard admin menampilkan statistik (pengguna, pemilahan, challenge, redeem) | Admin | M |

### 3.3 Pemilahan sampah dan AI

| ID | Kebutuhan | Aktor | Prioritas |
|---|---|---|---|
| FR-09 | User mengunggah foto sampah untuk dicatat sebagai pemilahan | User | M |
| FR-10 | Model AI mendeteksi jenis dan jumlah sampah dalam satu foto, dengan 6 kelas: kertas, plastik, kaca, kardus, organik, lainnya | Model AI | M |
| FR-11 | User melihat hasil deteksi dan mengonfirmasi atau mengoreksi jumlah sebelum disimpan | User | M |
| FR-12 | Sistem menyimpan pemilahan terkonfirmasi dan memberikan XP serta poin | Sistem | M |
| FR-13 | Aktivitas pemilahan harian dirangkum per level pada Activity Summary | User | S |

### 3.4 Gamifikasi

| ID | Kebutuhan | Aktor | Prioritas |
|---|---|---|---|
| FR-14 | Sistem menghitung streak harian user dan menampilkannya | Sistem, User | M |
| FR-15 | Sistem menaikkan level user (1 sampai 5) berdasarkan XP; tiap level lebih sulit dari sebelumnya | Sistem | M |
| FR-16 | Setiap level memiliki modul pengantar sebagai refleksi diri yang dapat diikuti user | User | S |
| FR-17 | User melihat leaderboard | User | M |
| FR-18 | User melihat daftar challenge, mengikuti, dan memantau progresnya | User | M |
| FR-19 | Admin membuat, mengubah, dan menonaktifkan challenge, termasuk tantangan dadakan | Admin | M |
| FR-20 | Admin memantau skor XP dan poin user | Admin | S |

### 3.5 Reward

| ID | Kebutuhan | Aktor | Prioritas |
|---|---|---|---|
| FR-21 | Admin mengelola voucher dan reward (judul, biaya poin, stok, status) | Admin | M |
| FR-22 | User melihat katalog reward dan menukar poin dengan reward | User | M |
| FR-23 | Sistem mencatat semua perubahan poin dalam riwayat transaksi poin | Sistem | M |

### 3.6 Komunitas

| ID | Kebutuhan | Aktor | Prioritas |
|---|---|---|---|
| FR-24 | User melihat daftar event dan mendaftar ke event | User | M |
| FR-25 | User pada level tertentu dapat membuat event | User | S |
| FR-26 | Admin memantau event dan dapat membatalkannya | Admin | S |

## 4. Kebutuhan Non-Fungsional

| ID | Kebutuhan | Keterangan |
|---|---|---|
| NFR-01 | Aplikasi web responsif, desain mobile-first | Acuan layar: frame Figma ukuran mobile |
| NFR-02 | Password disimpan sebagai hash; sesi aman; akses dibatasi RBAC | Terkait FR-03 |
| NFR-03 | Unggahan foto divalidasi (tipe dan ukuran) sebelum diproses | Ambang ukuran ditetapkan bersama Fullstack |
| NFR-04 | Seluruh trafik publik melalui HTTPS | Ditangani tim Infrastructure |
| NFR-05 | Waktu deteksi AI per foto dapat diterima untuk penggunaan interaktif | **Target angka belum ditetapkan.** Perlu hasil uji dari tim Machine Learning dan Infrastructure |
| NFR-06 | Perubahan poin dapat ditelusuri (audit trail) | Terkait FR-23 |

## 5. Batasan

**Batasan Scope**
- Backend tidak memakai layanan managed (BaaS/PaaS seperti Supabase, Firebase, Vercel, Railway, Render). Seluruh komponen di-host dan dikelola sendiri.
- Penyimpanan objek memakai S3-compatible storage. Kredensial tidak boleh masuk ke repositori; simpan di `.env`.
- Model AI dilatih dari dataset yang disediakan (train 34.230, val 4.278, test 4.280 gambar).
- Event dibuat oleh user pada level tertentu dan dipantau admin.
- Platform web responsif, mobile oriented.
- Stack basis data relasional; ERD mengikuti konvensi migration yang dipakai tim Fullstack.

## 6. Di Luar Lingkup (v0.1)

- Fitur chat atau forum antar pengguna.
- Transaksi keuangan langsung; reward hanya berbasis poin.
- Aplikasi mobile native.

## 7. Keterlacakan

| Kebutuhan | Use case | Tabel utama |
|---|---|---|
| FR-01, FR-02, FR-03 | UC-U01, UC-U02, UC-A01 | `users` |
| FR-05, FR-14 | UC-U03, UC-U08 | `streaks`, `waste_submissions` |
| FR-09 sampai FR-12 | UC-U07 | `waste_submissions`, `waste_detections`, `point_transactions` |
| FR-15, FR-16 | UC-U05, UC-U08 | `levels`, `level_modules`, `module_completions` |
| FR-17 | UC-U09 | `users` (urut `total_xp`) |
| FR-18, FR-19 | UC-U06, UC-A04, UC-A05 | `challenges`, `user_challenges` |
| FR-21 sampai FR-23 | UC-U10, UC-A07 | `rewards`, `redemptions`, `point_transactions` |
| FR-24 sampai FR-26 | UC-U11 sampai UC-U13, UC-A08 | `events`, `event_participants` |
