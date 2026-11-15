# Changelog

## [Unreleased]

### Planned Decisions (Fase 2)
- Tetapkan aturan XP dan poin: nilai per jenis sampah, multiplier streak/challenge
- Klarifikasi `challenges.level_id`: exclusive untuk 1 level, atau berlaku untuk level minimum ke atas
- Tentukan flow progress challenge: user pilih challenge aktif saat submit, atau sistem auto-match
- Klarifikasi scope validasi `redemptions.code`: ada alur merchant scan kode, atau cukup tampil di UI user
- Klarifikasi field `events`: perlu batasan level peserta atau flag is_public

### Planned (Fase 2)
- Selaraskan ERD dengan migration Fullstack setelah stack dikonfirmasi
- Tetapkan target waktu deteksi AI per foto setelah uji dari tim ML dan Infra
- Lengkapi layar admin dan alur AI detection di Figma
- Tambah alur error AI di sequence diagram (confidence rendah, tidak ada deteksi)
- Tambah composite unique constraint `(user_id, module_id)` di `module_completions`

---

## [0.1.0] - 2026-11-16

### Added
- Kebutuhan sistem: 26 FR (MoSCoW), 6 NFR, matriks RBAC 3 aktor, batasan scope, keterlacakan FR ke UC ke tabel
- Use case: spesifikasi ringkas 13 UC user dan 8 UC admin, alur lengkap UC-U07
- ERD: 14 tabel, relasi, kamus data lengkap
- UI/UX: mapping frame Figma, sequence diagram pemilahan sampah, alur penukaran reward, daftar layar yang belum dirancang

### Decisions
- Platform web responsif mobile-first
- Event dibuat oleh user berdasarkan `levels.can_create_event`
- XP dan poin dipisah: XP penentu level, poin untuk reward
- Leaderboard tanpa tabel tersendiri (order by `users.total_xp`)
- RBAC: `users.role` enum `user|admin`, cukup untuk dua role saat ini
- Foto disimpan sebagai `image_key` di object storage, bukan URL tetap
- Backend tidak memakai BaaS/PaaS; seluruh komponen dikelola sendiri
