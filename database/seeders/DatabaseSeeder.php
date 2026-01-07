<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PrimaryCase;
use App\Models\AppealCase;
use App\Models\SupremeCourtCase;
use App\Models\ArchiveLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create base user with a plain password (AuthController compares raw strings)
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => 'password', // keep plain to match AuthController check
                'email_verified_at' => now(),
            ]
        );

        // Seed primary cases
        $primaryCases = collect([
            [
                'first_instance_judgment' => 'حكم لصالح المدعي',
                'case_date' => '2024-01-15',
                'case_number' => 4512,
                'session_date' => '2024-02-10',
                'court_number' => 3,
            ],
            [
                'first_instance_judgment' => 'قضية قيد النظر',
                'case_date' => '2024-02-05',
                'case_number' => 4588,
                'session_date' => '2024-03-01',
                'court_number' => 5,
            ],
            [
                'first_instance_judgment' => 'حكم ضد المدعي',
                'case_date' => '2024-03-12',
                'case_number' => 4601,
                'session_date' => '2024-04-08',
                'court_number' => 2,
            ],
        ])->map(function ($data) use ($admin) {
            return PrimaryCase::create(array_merge($data, ['user_id' => $admin->id]));
        });

        // Seed an appeal linked to the first primary case
        $appeal = AppealCase::create([
            'appeal_number' => 542,
            'appeal_date' => '2024-04-15',
            'appeal_court_number' => 1,
            'appeal_judgment' => 'استئناف قيد النظر',
            'appealed_by' => 'شركة الأمل للمقاولات',
            'assigned_case_registration_request_id' => $primaryCases->first()->assigned_case_registration_request_id,
            'user_id' => $admin->id,
        ]);

        // Seed a supreme court case linked to the appeal
        $supreme = SupremeCourtCase::create([
            'supreme_date' => '2024-05-20',
            'supreme_case_number' => 2101,
            'appeal_request_id' => $appeal->appeal_request_id,
            'user_id' => $admin->id,
        ]);

        // Archive logs to show history
        foreach ($primaryCases as $case) {
            ArchiveLog::create([
                'case_type' => 'primary',
                'case_id' => $case->assigned_case_registration_request_id,
                'action' => 'seeded',
                'description' => 'Seeded primary case example data',
                'new_data' => $case->toArray(),
                'user_id' => $admin->id,
            ]);
        }

        ArchiveLog::create([
            'case_type' => 'appeal',
            'case_id' => $appeal->appeal_request_id,
            'action' => 'seeded',
            'description' => 'Seeded appeal case example data',
            'new_data' => $appeal->toArray(),
            'user_id' => $admin->id,
        ]);

        ArchiveLog::create([
            'case_type' => 'supreme',
            'case_id' => $supreme->supreme_request_id,
            'action' => 'seeded',
            'description' => 'Seeded supreme court case example data',
            'new_data' => $supreme->toArray(),
            'user_id' => $admin->id,
        ]);
    }
}
