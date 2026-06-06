<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunitySignalRequest;
use App\Models\CommunitySignal;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * CommunitySignalController — Community-driven threat reporting.
 * Users within a 5km radius can see and verify each other's signals.
 */
class CommunitySignalController extends Controller
{
    /**
     * List nearby community signals (within radius_km, default 5km).
     * Uses Haversine formula for geo distance filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'latitude'  => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'radius_km' => ['sometimes', 'numeric', 'min:1', 'max:50'],
        ]);

        $lat = $request->input('latitude');
        $lng = $request->input('longitude');
        $radius = $request->input('radius_km', 5);

        // Haversine formula for nearby signals
        $signals = CommunitySignal::selectRaw("
                community_signals.*,
                (6371 * acos(
                    cos(radians(?)) * cos(radians(latitude))
                    * cos(radians(longitude) - radians(?))
                    + sin(radians(?)) * sin(radians(latitude))
                )) AS distance_km
            ", [$lat, $lng, $lat])
            ->where('is_false_positive', false)
            ->having('distance_km', '<=', $radius)
            ->orderBy('distance_km')
            ->orderByDesc('created_at')
            ->paginate(min((int) $request->input('per_page', 20), 50));

        return response()->json($signals);
    }

    /**
     * Report a new community signal.
     */
    public function store(StoreCommunitySignalRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        $signal = CommunitySignal::create($validated);

        AuditService::log('community.signal_created', 'community_signal', $signal->id, [
            'type' => $signal->type,
        ]);

        return response()->json([
            'message' => 'Community alert reported.',
            'signal'  => $signal,
        ], 201);
    }

    /**
     * Verify/confirm a community signal (boosts confidence score).
     * Each user can only confirm once per signal.
     */
    public function confirm(Request $request, int $id): JsonResponse
    {
        $signal = CommunitySignal::findOrFail($id);

        // Prevent self-confirmation
        if ($signal->user_id === $request->user()->id) {
            return response()->json(['message' => 'Cannot verify your own signal.'], 422);
        }

        // Boost confidence score (capped at 100)
        $signal->update([
            'confidence_score' => min($signal->confidence_score + 10, 100),
        ]);

        AuditService::log('community.signal_confirmed', 'community_signal', $signal->id);

        return response()->json([
            'message' => 'Signal verified. Confidence boosted.',
            'signal'  => $signal->fresh(),
        ]);
    }

    /**
     * Moderate a signal (agents only) — mark as verified or false positive.
     */
    public function moderate(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isAgent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $signal = CommunitySignal::findOrFail($id);

        $request->validate([
            'action' => ['required', 'string', 'in:verify,reject'],
        ]);

        if ($request->input('action') === 'verify') {
            $signal->update([
                'is_verified'  => true,
                'moderated_by' => $request->user()->id,
            ]);
        } else {
            $signal->update([
                'is_false_positive' => true,
                'moderated_by'      => $request->user()->id,
            ]);
        }

        AuditService::log('community.signal_moderated', 'community_signal', $signal->id, [
            'action' => $request->input('action'),
        ]);

        return response()->json([
            'message' => 'Signal moderated.',
            'signal'  => $signal->fresh(),
        ]);
    }
}
