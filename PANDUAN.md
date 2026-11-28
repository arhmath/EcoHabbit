# Paket Sanctum + RBAC + Profil

## 1. Salin file
Ekstrak isi zip ke root proyek (C:\laragon\www\ecohabit), pilih "Replace" untuk routes/api.php.
File baru: app/Models/Level.php, app/Http/{Controllers/Api/V1,Middleware,Requests,Resources}/..., tests/Feature/AuthTest.php, postman/.
File ditimpa: routes/api.php.

## 2. Edit manual 2 file yang sudah ada

### app/Models/User.php
a) Tambahkan di bagian use:
    use Laravel\Sanctum\HasApiTokens;
    use Illuminate\Database\Eloquent\Relations\BelongsTo;
b) Tambahkan HasApiTokens ke daftar trait di dalam class (jika belum ada):
    use HasApiTokens, HasFactory, Notifiable;
c) Tambahkan relasi di dalam class:
    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }
d) Pastikan $fillable HANYA name, email, password (role, level_id, total_xp, points_balance jangan dimasukkan).

### bootstrap/app.php
Tambahkan di atas file:
    use Illuminate\Http\Request;
Lalu di withMiddleware dan withExceptions:
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request, \Throwable $e) => $request->is('api/*') || $request->expectsJson()
        );
    })
(supaya error di /api/* selalu JSON, termasuk 401 dan 422).

## 3. Jalankan
    php artisan storage:link
    php artisan route:list --path=api
    php artisan serve
Tes dengan Postman: import postman/EcoHabit.postman_collection.json.
Header wajib di Postman: Accept: application/json (sudah ada di koleksi).

## 4. Uji otomatis (opsional)
phpunit.xml bawaan memakai SQLite in-memory. Aktifkan extension=pdo_sqlite dan extension=sqlite3 di php.ini, lalu:
    php artisan test
