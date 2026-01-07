<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppealCase extends Model
{
    use SoftDeletes;

    protected $table = 'appeal';
    
    protected $primaryKey = 'appeal_request_id';
    
    public $incrementing = true;

    protected $fillable = [
        'appeal_number',
        'appeal_date',
        'appeal_court_number',
        'appeal_judgment',
        'appealed_by',
        'assigned_case_registration_request_id',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'appeal_date' => 'date',
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
     * Get the primary case that this appeal case belongs to.
     */
    public function primaryCase(): BelongsTo
    {
        return $this->belongsTo(PrimaryCase::class, 'assigned_case_registration_request_id', 'assigned_case_registration_request_id');
    }

    /**
     * Get the supreme court cases for this appeal case.
     */
    public function supremeCourtCases(): HasMany
    {
        return $this->hasMany(SupremeCourtCase::class, 'appeal_request_id', 'appeal_request_id');
    }
}
