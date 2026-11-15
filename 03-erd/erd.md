# 03 - Entity Relationship Diagram

Versi v0.1 (draft)
Kamus data: [data-dictionary.md](data-dictionary.md).

> Draft. Nama tabel, tipe, dan konvensi harus diselaraskan dengan migration tim Fullstack sebelum dipakai sebagai acuan implementasi (asumsi A-03).

```mermaid
erDiagram
    users ||--o{ user_challenges : "mengikuti"
    users ||--o{ waste_submissions : "mencatat"
    users ||--|| streaks : "memiliki"
    users ||--o{ point_transactions : "riwayat"
    users ||--o{ redemptions : "menukar"
    users ||--o{ module_completions : "menyelesaikan"
    users ||--o{ events : "membuat"
    users ||--o{ challenges : "admin membuat"
    users ||--o{ rewards : "admin membuat"
    users ||--o{ event_participants : "mendaftar"
    levels ||--o{ users : "tingkat"
    levels ||--o{ level_modules : "memiliki"
    levels ||--o{ challenges : "untuk"
    level_modules ||--o{ module_completions : "diselesaikan"
    challenges ||--o{ user_challenges : "diikuti"
    challenges ||--o{ waste_submissions : "terkait"
    waste_submissions ||--|{ waste_detections : "hasil deteksi"
    rewards ||--o{ redemptions : "ditukar"
    events ||--o{ event_participants : "peserta"

    users {
        bigint id PK
        string name
        string email UK
        string password_hash
        enum role "user | admin"
        bigint level_id FK
        int total_xp
        int points_balance
        string avatar_url
        datetime created_at
    }
    levels {
        bigint id PK
        tinyint level_number UK "1 sampai 5"
        string name
        int min_xp
        bool can_create_event
        text description
    }
    level_modules {
        bigint id PK
        bigint level_id FK
        string title
        text content
        int order_no
    }
    module_completions {
        bigint id PK
        bigint user_id FK
        bigint module_id FK
        text reflection_text
        datetime completed_at
    }
    challenges {
        bigint id PK
        bigint level_id FK
        string title
        text description
        enum target_waste_class "nullable"
        int target_count
        int xp_reward
        int point_reward
        bool is_ad_hoc
        bool is_active
        datetime start_at
        datetime end_at
        bigint created_by FK
    }
    user_challenges {
        bigint id PK
        bigint user_id FK
        bigint challenge_id FK
        int progress
        enum status "joined | completed | expired"
        datetime joined_at
        datetime completed_at
    }
    waste_submissions {
        bigint id PK
        bigint user_id FK
        bigint challenge_id FK "nullable"
        string image_key
        enum status "pending | confirmed | rejected"
        int xp_awarded
        int points_awarded
        datetime submitted_at
        datetime confirmed_at
    }
    waste_detections {
        bigint id PK
        bigint submission_id FK
        enum waste_class "kertas | plastik | kaca | kardus | organik | lainnya"
        int quantity
        decimal confidence
        bool is_corrected
    }
    streaks {
        bigint id PK
        bigint user_id FK, UK
        int current_streak
        int longest_streak
        date last_activity_date
    }
    point_transactions {
        bigint id PK
        bigint user_id FK
        enum type "earn | redeem | adjust"
        int amount
        string source_type
        bigint source_id
        datetime created_at
    }
    rewards {
        bigint id PK
        string title
        text description
        enum type "voucher | reward"
        int point_cost
        int stock
        bool is_active
        bigint created_by FK
    }
    redemptions {
        bigint id PK
        bigint user_id FK
        bigint reward_id FK
        int points_spent
        string code
        enum status "issued | used | cancelled"
        datetime redeemed_at
    }
    events {
        bigint id PK
        bigint created_by FK
        string title
        text description
        string location
        datetime event_date
        int capacity
        enum status "active | cancelled"
    }
    event_participants {
        bigint id PK
        bigint event_id FK
        bigint user_id FK
        datetime registered_at
    }
```

## Notes Rancangan

- **RBAC sederhana:** role disimpan sebagai kolom `users.role` (`user` atau `admin`), cukup untuk dua role pada notes. Bila role bertambah, pindahkan ke tabel `roles`.
- **XP dan poin dipisah:** `total_xp` menentukan level; `points_balance` dipakai untuk reward (sesuai kebutuhan admin memantau XP dan poin). Semua perubahan poin dicatat di `point_transactions` (ledger), sehingga saldo bisa diaudit.
- **Deteksi AI menjadi baris per kelas:** satu foto menghasilkan banyak baris `waste_detections` (jenis dan jumlah). `is_corrected` menandai jumlah yang diubah user, berguna untuk evaluasi model.
- **Leaderboard tidak punya tabel:** dihitung dari `users.total_xp` (atau dari `point_transactions` per periode) dengan indeks pada kolom tersebut.
- **Streak mingguan/bulanan:** `streaks` menyimpan streak berjalan; ringkasan mingguan dan bulanan dihitung dari `waste_submissions`.
- **Event oleh user:** `events.created_by` mengacu ke `users`; hak membuat event ditentukan `levels.can_create_event` (asumsi A-01 dan A-04).
- **Foto disimpan sebagai kunci objek** (`image_key`) di object storage, bukan URL tetap, agar bisa dibuat tautan sementara.
- **Aturan XP/poin belum dibakukan** (A-05): nilai ada di `challenges` dan hasil akhirnya di `waste_submissions`, tidak dikodekan keras.
