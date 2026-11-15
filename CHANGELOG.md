# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versi IS docs tidak mengikuti versi rilis aplikasi — revisi per sprint/fase.

---

## [Unreleased]

### Planned Decisions (Fase 2)
- Tetapkan aturan XP dan poin: nilai per jenis sampah, multiplier streak/challenge, siapa yang define angka
- Klarifikasi `challenges.level_id`: apakah challenge exclusive untuk 1 level, atau berlaku untuk level minimum ke atas (impak ke ERD)
- Tentukan flow progress challenge: user pilih challenge aktif saat submit, atau sistem auto-match berdasarkan challenge yang diikuti
- Klarifikasi scope validasi `redemptions.code`: apakah ada alur merchant scan kode, atau cukup tampil di UI user
- Klarifikasi field `events`: apakah perlu batasan level peserta atau flag is_public untuk Fase 2

### Planned (Fase 2)
- Selaraskan ERD dengan migration Fullstack setelah stack dikonfirmasi
- Tetapkan target waktu deteksi AI per foto (NFR-05) setelah uji dari tim ML dan Infra
- Lengkapi layar admin dan alur AI detection di Figma (mapping-layar.md)
- Tambah alur error AI di sequence diagram user-flow.md (confidence rendah, tidak ada deteksi)
- Tambah composite unique constraint `(user_id, module_id)` di kamus data `module_completions`

---

## [0.1.0] — 2026-11-16

Dokumen awal IS disusun dari notes tim dan Project Plan.

### Added
- **Kebutuhan Sistem** (`01-kebutuhan-sistem.md`): 26 kebutuhan fungsional (MoSCoW), 6 non-fungsional, matriks RBAC 3 aktor, batasan scope, keterlacakan FR → UC → tabel
- **Use Case** (`02-use-case/`): diagram drawio + SVG, spesifikasi ringkas 13 UC user dan 8 UC admin, alur lengkap UC-U07 (catat pemilahan sampah)
- **ERD** (`03-erd/erd.md`): 14 tabel, relasi Mermaid
- **Kamus Data** (`03-erd/data-dictionary.md`): tipe kolom, kunci, constraint, keterangan per kolom
- **Pemetaan Layar** (`04-ui-ux/mapping-layar.md`): mapping fitur ke frame Figma, daftar 11 layar yang belum dirancang (prioritas tinggi–rendah)
- **User Flow** (`04-ui-ux/user-flow.md`): flowchart alur utama aplikasi, sequence diagram UC-U07 (web app → backend → object storage → AI → DB), alur penukaran reward

### Decisions
- Platform web responsif mobile-first
- Event dibuat oleh user berdasarkan `levels.can_create_event`
- XP dan poin dipisah: XP penentu level, poin untuk reward
- Leaderboard tanpa tabel tersendiri (order by `users.total_xp`)
- RBAC: `users.role` enum `user|admin`, cukup untuk dua role saat ini
- Foto disimpan sebagai `image_key` di object storage, bukan URL tetap
- Backend tidak memakai BaaS/PaaS; seluruh komponen dikelola sendiri

---

## Roadmap Revisi

| Versi | Fase | Rencana |
|---|---|---|
| 0.2.0 | Fase 2 | Selaraskan ERD; tetapkan XP/poin; lengkap layar admin & alur AI |
| 0.3.0 | Fase 3 | Update sesuai temuan implementasi dan uji |
| 1.0.0 | Fase 4 | Finalisasi dokumen |
