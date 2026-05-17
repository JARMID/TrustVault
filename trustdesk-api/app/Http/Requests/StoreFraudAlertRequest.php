<?php

namespace App\Http\Requests;

use App\Models\FraudAlert;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * OWASP A03:2021 – Injection Prevention
 * Strict schema-based validation for fraud alert submissions.
 * Rejects unexpected fields to prevent mass-assignment attacks.
 */
class StoreFraudAlertRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth handled by Sanctum middleware
    }

    public function rules(): array
    {
        return [
            'type'            => ['required', 'string', Rule::in(FraudAlert::TYPES)],
            'category'        => ['nullable', 'string', Rule::in(FraudAlert::CATEGORIES)],
            'description'     => ['nullable', 'string', 'max:2000'],
            'amount_involved' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'currency'        => ['sometimes', 'string', 'size:3'],
            'transaction_ref' => ['nullable', 'string', 'max:255'],
            'card_last4'      => ['nullable', 'string', 'size:4', 'regex:/^\d{4}$/'],
            'latitude'        => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'       => ['nullable', 'numeric', 'between:-180,180'],
            'priority'        => ['sometimes', 'string', Rule::in(FraudAlert::PRIORITIES)],
        ];
    }

    /**
     * Reject any fields not explicitly listed in rules().
     * Prevents mass-assignment attacks via unexpected fields.
     */
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
            'type.in'             => 'Invalid fraud alert type. Allowed: ' . implode(', ', FraudAlert::TYPES),
            'category.in'        => 'Invalid category. Allowed: ' . implode(', ', FraudAlert::CATEGORIES),
            'card_last4.regex'   => 'Card last4 must be exactly 4 digits.',
            'amount_involved.min' => 'Amount cannot be negative.',
            'latitude.between'   => 'Latitude must be between -90 and 90.',
            'longitude.between'  => 'Longitude must be between -180 and 180.',
            'description.max'    => 'Description cannot exceed 2000 characters.',
        ];
    }
}
