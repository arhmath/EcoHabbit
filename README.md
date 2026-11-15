# EcoHabbit

Kamu punya sampah. Kamu pilah. Kamu foto. AI tahu itu plastik, kardus, atau organik, dan kamu dapat poin.

Itu intinya. Tapi ada lebih dari itu.

EcoHabbit adalah aplikasi web berbasis gamifikasi untuk membangun kebiasaan memilah dan mendaur ulang sampah. Pengguna mencatat pemilahan harian dengan foto; model AI (object detection multilabel, 6 kelas) mengenali jenis sampah secara otomatis, lalu sistem memberikan XP dan poin sebagai penghargaan.

EcoHabbit mengubah rutinitas memilah sampah jadi sesuatu yang terasa worth it: ada level yang naik, streak yang sayang diputus, challenge yang bikin penasaran, dan reward yang bisa ditukar. Bukan cuma aplikasi pencatat. Ini tentang kebiasaan yang terbentuk sedikit demi sedikit, setiap hari.

---

## Cara Kerjanya

Foto sampah yang sudah dipilah → model AI deteksi jenisnya (kertas, plastik, kaca, kardus, organik, atau lainnya) → kamu konfirmasi → XP dan poin masuk.

XP naik level (1 sampai 5), makin tinggi makin berat tantangannya. Poin bisa ditukar reward. Streak harian jadi alasan buat konsisten. Leaderboard jadi alasan buat kompetitif.

Admin bisa bikin challenge reguler atau tantangan dadakan. User di level tertentu bisa bikin event komunitas sendiri.

---

## Tech Stack

| Komponen | Keterangan |
|---|---|
| Platform | Web responsif, mobile-first |
| Backend | REST API, self-hosted |
| Database | Relasional |
| Object Storage | S3-compatible |
| AI | Object detection multilabel, 6 kelas sampah |
