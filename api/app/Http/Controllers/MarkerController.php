<?php

namespace App\Http\Controllers;

use Illuminate\Database\DatabaseManager;

class MarkerController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Resolve dependencies out of container
        /** @var DatabaseManager $db */
        $db = app('db');
        $accountsDatabase = $db->connection('accounts');
        $contentDatabase = $db->connection('content');
    }

    public function getMarkers(){
        return response()->json(['name' => 'Abigail', 'state' => 'CA']);
    }

    public function getLatest()
    {
        // Look up 3 newest users and 3 newest blog posts
        $threeNewestUsers = $accountsDatabase->select("SELECT * FROM users ORDER BY created_at DESC LIMIT 3");
        $threeLatestPosts = $contentDatabase->select("SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 3");
        return [
            "new_users" => $threeNewestUsers,
            "new_posts" => $threeLatestPosts,
        ];
    }

}
