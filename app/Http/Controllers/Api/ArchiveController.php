<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArchiveLog;
use Illuminate\Http\Request;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        $query = ArchiveLog::with('user');

        if ($request->has('case_type')) {
            $query->where('case_type', $request->case_type);
        }

        if ($request->has('case_id')) {
            $query->where('case_id', $request->case_id);
        }

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        $perPage = $request->get('per_page', 20);
        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'total' => $logs->total(),
                'per_page' => $logs->perPage(),
                'last_page' => $logs->lastPage(),
            ],
        ]);
    }

    public function show($id)
    {
        $log = ArchiveLog::with('user')->findOrFail($id);
        return response()->json(['data' => $log]);
    }

    public function getCaseHistory(Request $request, $caseType, $caseId)
    {
        $logs = ArchiveLog::where('case_type', $caseType)
            ->where('case_id', $caseId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => [
                'entries' => $logs,
            ],
        ]);
    }
}
