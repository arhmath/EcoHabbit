<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\LevelSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LevelSeeder::class);
    }

    private function payload(array $override = []): array
    {
        return array_merge([
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'password' => 'Rahasia123',
            'password_confirmation' => 'Rahasia123',
        ], $override);
    }

    public function test_register_membuat_user_role_user_level_1(): void
    {
        $res = $this->postJson('/api/v1/register', $this->payload());

        $res->assertCreated()
            ->assertJsonPath('data.user.role', 'user')
            ->assertJsonPath('data.user.level.level_number', 1)
            ->assertJsonStructure(['data' => ['token']]);
    }

    public function test_register_tidak_bisa_memilih_role_admin(): void
    {
        $this->postJson('/api/v1/register', $this->payload(['role' => 'admin', 'total_xp' => 9999]))
            ->assertCreated()
            ->assertJsonPath('data.user.role', 'user')
            ->assertJsonPath('data.user.total_xp', 0);
    }

    public function test_login_berhasil_dan_gagal(): void
    {
        $this->postJson('/api/v1/register', $this->payload());

        $this->postJson('/api/v1/login', ['email' => 'budi@example.com', 'password' => 'Rahasia123'])
            ->assertOk()->assertJsonStructure(['data' => ['token']]);

        $this->postJson('/api/v1/login', ['email' => 'budi@example.com', 'password' => 'salah'])
            ->assertStatus(401);
    }

    public function test_me_butuh_token_dan_logout_mencabutnya(): void
    {
        $this->getJson('/api/v1/me')->assertUnauthorized();

        $token = $this->postJson('/api/v1/register', $this->payload())->json('data.token');

        $this->withToken($token)->getJson('/api/v1/me')
            ->assertOk()->assertJsonPath('data.email', 'budi@example.com');

        $this->withToken($token)->postJson('/api/v1/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_rbac_user_biasa_ditolak_admin_diizinkan(): void
    {
        $token = $this->postJson('/api/v1/register', $this->payload())->json('data.token');
        $this->withToken($token)->getJson('/api/v1/admin/ping')->assertForbidden();

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        $adminToken = $admin->createToken('test')->plainTextToken;

        $this->withToken($adminToken)->getJson('/api/v1/admin/ping')->assertOk();
    }

    public function test_ganti_password_butuh_password_lama(): void
    {
        $token = $this->postJson('/api/v1/register', $this->payload())->json('data.token');

        $this->withToken($token)->putJson('/api/v1/profile/password', [
            'current_password' => 'salah',
            'password' => 'BaruBaru123',
            'password_confirmation' => 'BaruBaru123',
        ])->assertUnprocessable();

        $this->withToken($token)->putJson('/api/v1/profile/password', [
            'current_password' => 'Rahasia123',
            'password' => 'BaruBaru123',
            'password_confirmation' => 'BaruBaru123',
        ])->assertOk();
    }
}
