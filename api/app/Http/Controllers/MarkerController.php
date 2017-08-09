<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\DatabaseManager;
use App\Models\Marker;
use App\Models\User;
use Auth;

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
		$this->middleware('auth', ['only' => [
			'saveMarkers'
		]]);
	}

	public function getMarkers(Request $request){
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
}
