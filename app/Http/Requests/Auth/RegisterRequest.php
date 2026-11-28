<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Sengaja tidak ada field role/level_id/xp/points: semuanya diatur server
        return [
            'name'        => ['required', 'string', 'max:100'],
            'email'       => ['required', 'string', 'email:rfc', 'max:255', 'unique:users,email'],
            'password'    => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'device_name' => ['nullable', 'string', 'max:100'],
        ];
    }
}
