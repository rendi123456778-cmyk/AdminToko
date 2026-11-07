
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisAduan extends Model
{
    protected $table = 'jenis_aduan';

    protected $primaryKey = 'jenis_aduan_id';

    public $timestamps = false;

    protected $fillable = [
        'jenis',
    ];

    // Relasi ke tabel aduan
    public function aduan()
    {
        return $this->hasMany(
            Aduan::class,
            'jenis_aduan_id',
            'jenis_aduan_id'
        );
    }
}
