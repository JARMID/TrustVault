<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'max:128'],
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
}
