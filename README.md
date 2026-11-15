# EcoHabbit

**EcoHabbit** adalah aplikasi web gamifikasi yang membantu pengguna membangun kebiasaan memilah dan mendaur ulang sampah secara konsisten.

Pengguna mencatat pemilahan harian dengan foto. Model AI mengenali jenis dan jumlah sampah secara otomatis — sistem lalu memberikan XP dan poin sebagai penghargaan. XP menaikkan level (1–5), poin dapat ditukar dengan reward. Challenge, leaderboard, dan event komunitas mendorong keterlibatan jangka panjang.

---

## Fitur Utama

- 📸 **Catat pemilahan sampah** — unggah foto, AI deteksi 6 kelas sampah (kertas, plastik, kaca, kardus, organik, lainnya), user konfirmasi hasilnya
- 🏆 **Gamifikasi** — XP, level, streak harian, leaderboard, challenge reguler dan dadakan
- 🎁 **Reward** — tukar poin dengan voucher dan hadiah
- 🌱 **Komunitas** — event yang bisa dibuat user (dengan syarat level tertentu) dan dipantau admin
- 🛠️ **Admin panel** — kelola challenge, reward, pantau statistik dan event

---

## Tech Stack

| Komponen | Keterangan |
|---|---|
| Platform | Web responsif, mobile-first |
| Backend | REST API, self-hosted (tidak memakai BaaS/PaaS) |
| Database | Relasional |
| Object Storage | S3-compatible, kredensial via `.env` |
| AI | Object detection multilabel, 6 kelas sampah |

---

## Dokumentasi

Dokumentasi Information Systems (IS) tersedia di repo ini sebagai referensi lintas tim.

| # | Dokumen | Isi |
|---|---|---|
| 1 | [Kebutuhan Sistem](01-kebutuhan-sistem.md) | Aktor, FR/NFR (MoSCoW), RBAC, batasan, keterlacakan |
| 2 | [Use Case](02-use-case/use-case.md) | Diagram + spesifikasi ringkas (21 use case) |
| 3 | [ERD](03-erd/erd.md) + [Kamus Data](03-erd/data-dictionary.md) | 14 tabel, relasi, tipe kolom |
| 4 | [Pemetaan Layar](04-ui-ux/mapping-layar.md) + [User Flow](04-ui-ux/user-flow.md) | Figma mapping, sequence diagram, alur layar |

Versi dokumen: **v0.1 (draft Fase 1)** · Revisi dicatat di [CHANGELOG](CHANGELOG.md)

---

## Berkontribusi

- **ERD & User Flow:** edit blok Mermaid di file `.md`, preview di [mermaid.live](https://mermaid.live)
- **Use Case Diagram:** buka `02-use-case/use-case.drawio` di [diagrams.net](https://app.diagrams.net), edit, ekspor SVG, timpa `use-case.svg`
- Semua revisi penting dicatat di CHANGELOG dengan nomor versi dan alasan perubahan
