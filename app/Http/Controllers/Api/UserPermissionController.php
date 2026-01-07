<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;

class UserPermissionController extends Controller
{
    public function index()
    {
        $users = User::with('permissions')->paginate(10);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    public function show($id)
    {
        $user = User::with('permissions')->findOrFail($id);
        
        // Format permissions data
        $permissions = [];
        foreach ($user->permissions as $permission) {
            $permissions[$permission->slug] = $permission->pivot->permissions_data ?? ['enabled' => true];
        }

        return response()->json([
            'data' => [
                'user' => $user,
                'permissions' => $permissions,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'permissions' => 'required|array',
        ]);

        // Sync permissions
        foreach ($request->permissions as $slug => $data) {
            $permission = Permission::where('slug', $slug)->first();
            if ($permission) {
                $user->permissions()->syncWithoutDetaching([
                    $permission->id => ['permissions_data' => $data],
                ]);
            }
        }

        return response()->json([
            'data' => [
                'success' => true,
                'permissions' => $request->permissions,
            ],
        ]);
    }
}
