# EcoHabbit

> Aplikasi web gamifikasi untuk membangun kebiasaan memilah dan mendaur ulang sampah.
> Pengguna mencatat pemilahan harian dengan foto; model AI (object detection multilabel, 6 kelas) mengenali jenis sampah, lalu sistem memberi XP dan poin untuk naik level dan menukar reward.

---

## Tim & Area Kerja

| Tim | Folder | Status |
|---|---|---|
| Information Systems (IS) | `01-kebutuhan-sistem.md`, `02-use-case/`, `03-erd/`, `04-ui-ux/` | ✅ Draft v0.1 |
| Fullstack | _(belum)_ | 🔜 Fase 2 |
| Machine Learning | _(belum)_ | 🔜 Fase 2 |
| Infrastructure | _(belum)_ | 🔜 Fase 2 |

> [!NOTE]
> Repo ini adalah monorepo utama EcoHabbit. Tiap tim berkontribusi di folder atau branch masing-masing. Konvensi folder dan branch strategy dibahas sebelum Fase 2 dimulai.

---

## Dokumentasi IS (Information Systems)

| # | Dokumen | Isi |
|---|---|---|
| 1 | [Kebutuhan Sistem](01-kebutuhan-sistem.md) | Aktor, FR/NFR (MoSCoW), RBAC, batasan, keterlacakan |
| 2 | [Use Case](02-use-case/use-case.md) | Diagram + spesifikasi ringkas (21 use case) |
| 3 | [ERD](03-erd/erd.md) + [Kamus Data](03-erd/data-dictionary.md) | 14 tabel, relasi, tipe kolom |
| 4 | [Pemetaan Layar](04-ui-ux/mapping-layar.md) + [User Flow](04-ui-ux/user-flow.md) | Figma mapping, sequence diagram, alur layar |

Versi dokumen IS: **v0.1 (draft Fase 1)** · Revisi dicatat di [CHANGELOG](CHANGELOG.md)

---

## Cara Berkontribusi ke Dokumen IS

- **ERD & User Flow:** edit blok Mermaid di file `.md`, preview di [mermaid.live](https://mermaid.live)
- **Use Case Diagram:** buka `02-use-case/use-case.drawio` di [diagrams.net](https://app.diagrams.net), edit, ekspor SVG, timpa `use-case.svg`
- Semua revisi penting dicatat di CHANGELOG dengan nomor versi dan alasan perubahan

---

## Stack Ringkas

| Komponen | Keterangan |
|---|---|
| Platform | Web responsif, mobile-first |
| Backend | REST API, dikelola sendiri (tidak memakai BaaS/PaaS) |
| Object Storage | S3-compatible, kredensial via `.env` |
| AI | Model object detection multilabel, 6 kelas sampah |
| Database | Relasional (konvensi mengikuti migration Fullstack) |
