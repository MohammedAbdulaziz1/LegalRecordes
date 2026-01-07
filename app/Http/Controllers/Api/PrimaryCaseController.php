<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrimaryCase;
use App\Models\ArchiveLog;
use Illuminate\Http\Request;

class PrimaryCaseController extends Controller
{
    public function index(Request $request)
    {
        $query = PrimaryCase::with('user');

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('case_number', 'like', '%' . $request->search . '%')
                  ->orWhere('first_instance_judgment', 'like', '%' . $request->search . '%');
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
            'first_instance_judgment' => 'required|string',
            'case_date' => 'required|date',
            'case_number' => 'required|integer',
            'session_date' => 'required|date',
            'court_number' => 'required|integer',
        ]);

        $validated['user_id'] = $request->user()->id;

        $case = PrimaryCase::create($validated);

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'primary',
            'case_id' => $case->assigned_case_registration_request_id,
            'action' => 'created',
            'user_id' => $request->user()->id,
            'new_data' => $case->toArray(),
        ]);

        return response()->json(['data' => $case], 201);
    }

    public function show($id)
    {
        $case = PrimaryCase::with('user', 'appealCases')->findOrFail($id);
        return response()->json(['data' => $case]);
    }

    public function update(Request $request, $id)
    {
        $case = PrimaryCase::findOrFail($id);
        $oldData = $case->toArray();

        $validated = $request->validate([
            'first_instance_judgment' => 'sometimes|string',
            'case_date' => 'sometimes|date',
            'case_number' => 'sometimes|integer',
            'session_date' => 'sometimes|date',
            'court_number' => 'sometimes|integer',
        ]);

        $case->update($validated);

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'primary',
            'case_id' => $case->assigned_case_registration_request_id,
            'action' => 'updated',
            'user_id' => $request->user()->id,
            'old_data' => $oldData,
            'new_data' => $case->toArray(),
        ]);

        return response()->json(['data' => $case]);
    }

    public function destroy(Request $request, $id)
    {
        $case = PrimaryCase::findOrFail($id);
        $oldData = $case->toArray();

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'primary',
            'case_id' => $case->assigned_case_registration_request_id,
            'action' => 'deleted',
            'user_id' => $request->user()->id,
            'old_data' => $oldData,
        ]);

        $case->delete();

        return response()->json(['data' => ['success' => true]]);
    }
}
