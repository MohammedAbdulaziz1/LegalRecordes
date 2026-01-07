<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupremeCourtCase extends Model
{
    use SoftDeletes;

    protected $table = 'supreme_court';
    
    protected $primaryKey = 'supreme_request_id';
    
    public $incrementing = true;

    protected $fillable = [
        'supreme_date',
        'supreme_case_number',
        'appeal_request_id',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'supreme_date' => 'date',
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
     * Get the appeal case that this supreme court case belongs to.
     */
    public function appealCase(): BelongsTo
    {
        return $this->belongsTo(AppealCase::class, 'appeal_request_id', 'appeal_request_id');
    }
}
