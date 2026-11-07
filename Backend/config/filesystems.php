<?php

return [
    //Default Filesystem Disk 
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        // Disk untuk menyimpan file secara lokal 
        'local' => [
            'driver' => 'local',
            // Disk untuk menyimpan file secara lokal 
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],
        // path: storage/app/public setting di .env FILESYSTEM_DISK=public 
        'public' => [
            'driver' => 'local',
            // Disk untuk menyimpan file yang dapat diakses secara publik 
            'root' => storage_path('app/public'),
            // URL untuk mengakses file yang disimpan di disk publik 
            'url' => env('APP_URL') . '/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],
    // symbolic link 
    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
