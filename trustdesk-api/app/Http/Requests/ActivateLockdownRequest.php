<?php

namespace App\Http\Requests;

use App\Models\EmergencyLockdown;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * OWASP A03:2021 – Injection Prevention
 * Validates emergency lockdown activation payload.
 * Minimal data accepted to reduce attack surface on this critical endpoint.
 */
class ActivateLockdownRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_id'    => ['nullable', 'integer', 'exists:devices,id'],
            'trigger_type' => ['sometimes', 'string', Rule::in(EmergencyLockdown::TRIGGER_TYPES)],
            'latitude'     => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'    => ['nullable', 'numeric', 'between:-180,180'],
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
