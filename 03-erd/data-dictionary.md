# Kamus Data

Versi v0.1 (draft Fase 1). Tipe bersifat umum untuk basis data relasional; sesuaikan dengan konvensi migration tim Fullstack. `PK` primary key, `FK` foreign key, `UK` unique, `Null` boleh kosong.

## users
Akun pengguna dan admin.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| name | varchar(100) | | tidak | Nama tampilan |
| email | varchar(150) | UK | tidak | Dipakai untuk login |
| password_hash | varchar(255) | | tidak | Hash password, bukan teks asli |
| role | enum(`user`,`admin`) | | tidak | Dasar RBAC |
| level_id | bigint | FK levels | tidak | Level saat ini; default level 1 |
| total_xp | int | | tidak | Akumulasi XP, penentu level dan leaderboard |
| points_balance | int | | tidak | Saldo poin untuk reward |
| avatar_url | varchar(255) | | ya | |
| created_at | datetime | | tidak | |

## levels
Level 1 sampai 5; tiap level lebih sulit.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| level_number | tinyint | UK | tidak | 1 sampai 5 |
| name | varchar(100) | | tidak | |
| min_xp | int | | tidak | XP minimum untuk mencapai level |
| can_create_event | boolean | | tidak | Hak membuat event (asumsi A-04) |
| description | text | | ya | |

## level_modules
Modul pengantar per level sebagai refleksi diri.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| level_id | bigint | FK levels | tidak | |
| title | varchar(150) | | tidak | |
| content | text | | tidak | Isi modul |
| order_no | int | | tidak | Urutan dalam level |

## module_completions
Penyelesaian modul oleh user.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| user_id | bigint | FK users | tidak | |
| module_id | bigint | FK level_modules | tidak | Unik bersama user_id |
| reflection_text | text | | ya | Jawaban refleksi diri |
| completed_at | datetime | | tidak | |

## challenges
Tantangan per level, termasuk tantangan dadakan.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| level_id | bigint | FK levels | tidak | Level yang dituju |
| title | varchar(150) | | tidak | |
| description | text | | ya | |
| target_waste_class | enum(6 kelas) | | ya | Kosong bila tidak terikat satu kelas |
| target_count | int | | tidak | Jumlah target |
| xp_reward | int | | tidak | |
| point_reward | int | | tidak | |
| is_ad_hoc | boolean | | tidak | Tantangan dadakan |
| is_active | boolean | | tidak | |
| start_at / end_at | datetime | | tidak | Masa berlaku |
| created_by | bigint | FK users | tidak | Admin pembuat |

## user_challenges
Keikutsertaan user pada challenge.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| user_id | bigint | FK users | tidak | Unik bersama challenge_id |
| challenge_id | bigint | FK challenges | tidak | |
| progress | int | | tidak | Jumlah tercapai terhadap `target_count` |
| status | enum(`joined`,`completed`,`expired`) | | tidak | |
| joined_at | datetime | | tidak | |
| completed_at | datetime | | ya | |

## waste_submissions
Satu kali pencatatan pemilahan (satu foto).

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| user_id | bigint | FK users | tidak | |
| challenge_id | bigint | FK challenges | ya | Bila dicatat untuk challenge |
| image_key | varchar(255) | | tidak | Kunci objek di object storage |
| status | enum(`pending`,`confirmed`,`rejected`) | | tidak | Dikonfirmasi user setelah deteksi |
| xp_awarded | int | | tidak | Terisi saat `confirmed` |
| points_awarded | int | | tidak | Terisi saat `confirmed` |
| submitted_at | datetime | | tidak | |
| confirmed_at | datetime | | ya | |

## waste_detections
Hasil deteksi per kelas untuk satu pemilahan.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| submission_id | bigint | FK waste_submissions | tidak | |
| waste_class | enum(`kertas`,`plastik`,`kaca`,`kardus`,`organik`,`lainnya`) | | tidak | 6 kelas model |
| quantity | int | | tidak | Jumlah (setelah koreksi user, bila ada) |
| confidence | decimal(5,4) | | ya | Skor keyakinan model |
| is_corrected | boolean | | tidak | Jumlah diubah user |

## streaks
Streak berjalan per user (1:1).

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| user_id | bigint | FK users, UK | tidak | |
| current_streak | int | | tidak | |
| longest_streak | int | | tidak | |
| last_activity_date | date | | ya | Dasar reset streak |

## point_transactions
Ledger perubahan poin.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| user_id | bigint | FK users | tidak | |
| type | enum(`earn`,`redeem`,`adjust`) | | tidak | |
| amount | int | | tidak | Negatif untuk pengurangan |
| source_type | varchar(50) | | tidak | Mis. `waste_submission`, `challenge`, `redemption` |
| source_id | bigint | | ya | Id sumber (polimorfik) |
| created_at | datetime | | tidak | |

## rewards
Katalog voucher dan reward.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| title | varchar(150) | | tidak | |
| description | text | | ya | |
| type | enum(`voucher`,`reward`) | | tidak | |
| point_cost | int | | tidak | |
| stock | int | | tidak | |
| is_active | boolean | | tidak | |
| created_by | bigint | FK users | tidak | Admin pembuat |

## redemptions
Penukaran reward.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| user_id | bigint | FK users | tidak | |
| reward_id | bigint | FK rewards | tidak | |
| points_spent | int | | tidak | Poin saat penukaran (harga bisa berubah) |
| code | varchar(50) | UK | tidak | Kode penukaran |
| status | enum(`issued`,`used`,`cancelled`) | | tidak | |
| redeemed_at | datetime | | tidak | |

## events
Event komunitas.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| created_by | bigint | FK users | tidak | User (level memenuhi syarat) |
| title | varchar(150) | | tidak | |
| description | text | | ya | |
| location | varchar(200) | | ya | |
| event_date | datetime | | tidak | |
| capacity | int | | ya | |
| status | enum(`active`,`cancelled`) | | tidak | Admin dapat membatalkan |

## event_participants
Pendaftaran event.

| Kolom | Tipe | Kunci | Null | Keterangan |
|---|---|---|---|---|
| id | bigint | PK | tidak | |
| event_id | bigint | FK events | tidak | Unik bersama user_id |
| user_id | bigint | FK users | tidak | |
| registered_at | datetime | | tidak | |
