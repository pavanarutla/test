<?php
return [
    
    'default' => 'accounts',
    'connections' => [
        'accounts' => [
            'driver'    => 'mysql',
            'host'      => 'localhost',
            'database'  => 'accounts',
            'username'  => 'root',
            'password'  => '',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
            'strict'    => false,
        ],
        // 'content' => [
        //     'driver'    => 'mongodb',
        //     'host'      => 'localhost',
        //     'database'  => 'content',
        //     'username'  => 'root',
        //     'password'  => 'secret',
        //     'charset'   => 'utf8',
        //     'collation' => 'utf8_unicode_ci',
        //     'prefix'    => '',
        //     'strict'    => false,
        // ],
    ],
];