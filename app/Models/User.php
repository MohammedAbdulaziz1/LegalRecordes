<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the primary cases for the user.
     */
    public function primaryCases()
    {
        return $this->hasMany(PrimaryCase::class, 'user_id');
    }

    /**
     * Get the appeal cases for the user.
     */
    public function appealCases()
    {
        return $this->hasMany(AppealCase::class, 'user_id');
    }

    /**
     * Get the supreme court cases for the user.
     */
    public function supremeCourtCases()
    {
        return $this->hasMany(SupremeCourtCase::class, 'user_id');
    }

    /**
     * Get the archive logs for the user.
     */
    public function archiveLogs()
    {
        return $this->hasMany(ArchiveLog::class);
    }

    /**
     * Get the permissions for the user.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')
            ->withPivot('permissions_data')
            ->withTimestamps();
    }
}
