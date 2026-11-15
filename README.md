# EcoHabbit - Dokumentasi Information Systems

Penyusun: Aqib Khoiruzaman (System Analyst dan UI/UX Designer). Versi dokumen: **v0.1 (draft Fase 1)**. Revisi dicatat di [CHANGELOG](CHANGELOG.md).

| # | Dokumen | Isi |
|---|---|---|
| 1 | [Kebutuhan Sistem](01-kebutuhan-sistem.md) | Aktor, kebutuhan fungsional dan non-fungsional, batasan, asumsi, keterlacakan |
| 2 | [Use Case](02-use-case/use-case.md) | Diagram (`.svg`, `.drawio`) dan spesifikasi ringkas |
| 3 | [ERD](03-erd/erd.md) dan [Kamus Data](03-erd/data-dictionary.md) | Rancangan basis data (Mermaid) |
| 4 | [Pemetaan Layar](04-ui-ux/mapping-layar.md) dan [User Flow](04-ui-ux/user-flow.md) | Fitur ke frame Figma, alur layar |

## Cara menyunting diagram

- **ERD dan user flow:** blok Mermaid di berkas `.md`; GitHub merendernya otomatis. Edit teksnya langsung.
- **Use case:** buka `02-use-case/use-case.drawio` di [diagrams.net](https://app.diagrams.net), edit, lalu ekspor SVG dan timpa `use-case.svg`.
- Untuk menyunting Mermaid secara visual, tempel kodenya ke [mermaid.live](https://mermaid.live).

## Aturan repositori

Kredensial (kunci object storage dan sejenisnya) tidak boleh masuk repositori. Simpan di `.env` dan daftarkan di `.gitignore`.
