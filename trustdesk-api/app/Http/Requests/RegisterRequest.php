<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'min:2', 'max:100'],
            'email'    => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => [
                'required', 'string', 'min:8', 'max:128',
                'regex:/[A-Z]/',      // At least one uppercase
                'regex:/[a-z]/',      // At least one lowercase
                'regex:/[0-9]/',      // At least one digit
                'regex:/[@$!%*#?&]/', // At least one special character
                'confirmed',
            ],
            'password_confirmation' => ['required_with:password', 'string'],
            'language' => ['sometimes', 'string', 'in:fr,en,ar'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $allowed = array_keys($this->rules());
            $extra = array_diff_key($this->all(), array_flip($allowed));
            foreach (array_keys($extra) as $key) {
                $validator->errors()->add($key, "The {$key} field is unexpected and not allowed.");
            }
        });
    }

    public function messages(): array
    {
        return [
            'password.regex' => 'Password must contain uppercase, lowercase, digit, and special character.',
            'email.unique'   => 'An account with this email already exists.',
        ];
    }
}
