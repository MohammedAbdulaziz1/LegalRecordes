<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PrimaryCase extends Model
{
    use SoftDeletes;

    protected $table = 'case_registration';
    
    protected $primaryKey = 'assigned_case_registration_request_id';
    
    public $incrementing = true;

    protected $fillable = [
        'first_instance_judgment',
        'judgment_status',
        'case_date',
        'case_number',
        'session_date',
        'court_number',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'case_date' => 'date',
            'session_date' => 'date',
        ];
    }

    /**
     * Get the user that owns the case.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the appeal cases for this primary case.
     */
    public function appealCases(): HasMany
    {
        return $this->hasMany(AppealCase::class, 'assigned_case_registration_request_id', 'assigned_case_registration_request_id');
    }
}
