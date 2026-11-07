
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aduan extends Model
{
    protected $table = 'aduan';

    protected $primaryKey = 'aduan_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'jenis_aduan_id',
        'prioritas',
        'text',
    ];

    // Relasi ke tabel users
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke tabel jenis_aduan
    public function jenisAduan(): BelongsTo
    {
        return $this->belongsTo(
            JenisAduan::class,
            'jenis_aduan_id',
            'jenis_aduan_id'
        );
    }
}
