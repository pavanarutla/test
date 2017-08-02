<?php

namespace App\Http\Controllers;

use Illuminate\Database\DatabaseManager;
use App\Models\Marker;
use App\User;

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
        // $db = app('db');
        // $accountsDatabase = $db->connection('accounts');
        // $contentDatabase = $db->connection('content');
    }

	public function getMarkers(){
		// $user = new User;
		// $user->name = "mridul";
		// $user->email = "mridulkashyap57@gmail.com";
		// $user->save();
		$markers = Marker::all();
		return response()->json($markers);
	}

	public function saveMarkers(){
		$markers = [
				[ 'lat'=> 17.4574279, 'lng'=> 78.3119675 ],
				[ 'lat'=> 17.4474262, 'lng'=> 78.3319602 ],
				[ 'lat'=> 17.4364212, 'lng'=> 78.3619627 ],
				[ 'lat'=> 17.4444225, 'lng'=> 78.3219245 ],
				[ 'lat'=> 17.4494139, 'lng'=> 78.3289475 ],
				[ 'lat'=> 17.4414189, 'lng'=> 78.3299765 ],
				[ 'lat'=> 17.4354819, 'lng'=> 78.3279135 ]
		];
		foreach($markers as $marker){
			$marker_obj = new Marker;
			$marker_obj->lat = $marker['lat'];
			$marker_obj->lng = $marker['lng'];
			$marker_obj->save();
		}
	}

    public function getLatest()
    {
        // Look up 3 newest users and 3 newest blog posts
        $threeNewestUsers = $accountsDatabase->select("SELECT * FROM users ORDER BY created_at DESC LIMIT 3");
        // $threeLatestPosts = $contentDatabase->select("SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 3");
        return [
            "new_users" => $threeNewestUsers,
            // "new_posts" => $threeLatestPosts,
        ];
    }

}
