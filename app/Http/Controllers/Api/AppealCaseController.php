<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppealCase;
use App\Models\ArchiveLog;
use Illuminate\Http\Request;

class AppealCaseController extends Controller
{
    public function index(Request $request)
    {
        $query = AppealCase::with('user', 'primaryCase');

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('appeal_number', 'like', '%' . $request->search . '%')
                  ->orWhere('appeal_judgment', 'like', '%' . $request->search . '%')
                  ->orWhere('appealed_by', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = $request->get('per_page', 10);
        $cases = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $cases->items(),
            'meta' => [
                'current_page' => $cases->currentPage(),
                'total' => $cases->total(),
                'per_page' => $cases->perPage(),
                'last_page' => $cases->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'appeal_number' => 'required|integer',
            'appeal_date' => 'required|date',
            'appeal_court_number' => 'required|integer',
            'appeal_judgment' => 'required|string',
            'appealed_by' => 'required|string',
            'assigned_case_registration_request_id' => 'required|exists:case_registration,assigned_case_registration_request_id',
        ]);

        $validated['user_id'] = $request->user()->id;

        $case = AppealCase::create($validated);

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'appeal',
            'case_id' => $case->appeal_request_id,
            'action' => 'created',
            'user_id' => $request->user()->id,
            'new_data' => $case->toArray(),
        ]);

        return response()->json(['data' => $case], 201);
    }

    public function show($id)
    {
        $case = AppealCase::with('user', 'primaryCase', 'supremeCourtCases')->findOrFail($id);
        return response()->json(['data' => $case]);
    }

    public function update(Request $request, $id)
    {
        $case = AppealCase::findOrFail($id);
        $oldData = $case->toArray();

        $validated = $request->validate([
            'appeal_number' => 'sometimes|integer',
            'appeal_date' => 'sometimes|date',
            'appeal_court_number' => 'sometimes|integer',
            'appeal_judgment' => 'sometimes|string',
            'appealed_by' => 'sometimes|string',
            'assigned_case_registration_request_id' => 'sometimes|exists:case_registration,assigned_case_registration_request_id',
        ]);

        $case->update($validated);

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'appeal',
            'case_id' => $case->appeal_request_id,
            'action' => 'updated',
            'user_id' => $request->user()->id,
            'old_data' => $oldData,
            'new_data' => $case->toArray(),
        ]);

        return response()->json(['data' => $case]);
    }

    public function destroy(Request $request, $id)
    {
        $case = AppealCase::findOrFail($id);
        $oldData = $case->toArray();

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'appeal',
            'case_id' => $case->appeal_request_id,
            'action' => 'deleted',
            'user_id' => $request->user()->id,
            'old_data' => $oldData,
        ]);

        $case->delete();

        return response()->json(['data' => ['success' => true]]);
    }
}
