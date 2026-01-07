<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrimaryCase;
use App\Models\AppealCase;
use App\Models\SupremeCourtCase;
use App\Models\ArchiveLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function statistics(Request $request)
    {
        $primaryCount = PrimaryCase::count();
        $appealCount = AppealCase::count();
        $supremeCount = SupremeCourtCase::count();
        
        // Get pending cases (you can adjust this logic based on your status field)
        $pendingCount = PrimaryCase::where('first_instance_judgment', 'LIKE', '%قيد%')->count();
        
        // Get recent cases (last 5)
        $recentCases = PrimaryCase::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($case) {
                return [
                    'id' => $case->assigned_case_registration_request_id,
                    'case_number' => $case->case_number,
                    'judgment' => $case->first_instance_judgment,
                    'date' => $case->case_date,
                    'updated_at' => $case->updated_at,
                ];
            });
        
        // Get recent archive logs
        $recentActivity = ArchiveLog::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'case_type' => $log->case_type,
                    'case_id' => $log->case_id,
                    'action' => $log->action,
                    'user_name' => $log->user->name ?? 'Unknown',
                    'created_at' => $log->created_at,
                ];
            });

        return response()->json([
            'data' => [
                'statistics' => [
                    'primary_cases' => $primaryCount,
                    'appeal_cases' => $appealCount,
                    'supreme_cases' => $supremeCount,
                    'pending_cases' => $pendingCount,
                ],
                'recent_cases' => $recentCases,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}

