<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupremeCourtCase;
use App\Models\ArchiveLog;
use Illuminate\Http\Request;

class SupremeCourtCaseController extends Controller
{
    public function index(Request $request)
    {
        $query = SupremeCourtCase::with('user', 'appealCase');

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('supreme_case_number', 'like', '%' . $request->search . '%');
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
            'supreme_date' => 'required|date',
            'supreme_case_number' => 'required|integer',
            'appeal_request_id' => 'required|exists:appeal,appeal_request_id',
        ]);

        $validated['user_id'] = $request->user()->id;

        $case = SupremeCourtCase::create($validated);

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'supreme',
            'case_id' => $case->supreme_request_id,
            'action' => 'created',
            'user_id' => $request->user()->id,
            'new_data' => $case->toArray(),
        ]);

        return response()->json(['data' => $case], 201);
    }

    public function show($id)
    {
        $case = SupremeCourtCase::with('user', 'appealCase')->findOrFail($id);
        return response()->json(['data' => $case]);
    }

    public function update(Request $request, $id)
    {
        $case = SupremeCourtCase::findOrFail($id);
        $oldData = $case->toArray();

        $validated = $request->validate([
            'supreme_date' => 'sometimes|date',
            'supreme_case_number' => 'sometimes|integer',
            'appeal_request_id' => 'sometimes|exists:appeal,appeal_request_id',
        ]);

        $case->update($validated);

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'supreme',
            'case_id' => $case->supreme_request_id,
            'action' => 'updated',
            'user_id' => $request->user()->id,
            'old_data' => $oldData,
            'new_data' => $case->toArray(),
        ]);

        return response()->json(['data' => $case]);
    }

    public function destroy(Request $request, $id)
    {
        $case = SupremeCourtCase::findOrFail($id);
        $oldData = $case->toArray();

        // Log to archive
        ArchiveLog::create([
            'case_type' => 'supreme',
            'case_id' => $case->supreme_request_id,
            'action' => 'deleted',
            'user_id' => $request->user()->id,
            'old_data' => $oldData,
        ]);

        $case->delete();

        return response()->json(['data' => ['success' => true]]);
    }
}
