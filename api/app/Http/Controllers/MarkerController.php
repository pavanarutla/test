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
		// $this->middleware('auth', ['only' => [
			// 'saveMarkers'
		// ]]);
	}

	public function getMarkers(){
		$markers = Marker::all();
		// echo '<pre>';var_dump(config()->all()); echo '</pre>';die;
		return response()->json($markers);
	}

	public function saveMarker(Request $request){
		if ($request->isJson()) {
        $input = $request->json()->all();
    } else {
        $input = $request->all();
    }
		$marker_obj = new Marker;
		// $marker_obj->adStrength = $input['adStrength'];
		// $marker_obj->address = $input['address'];
		// $marker_obj->areaName = $input['areaName'];
		// $marker_obj->company = $input['company'];
		// $marker_obj->direction = $input['direction'];
		// $marker_obj->hoardingCost = $input['hoardingCost'];
		// $marker_obj->image = $input['image'];
		// $marker_obj->impressions = $input['impressions'];
		$marker_obj->lat = $input['lat'];
		// $marker_obj->lighting = $input['lighting'];
		$marker_obj->lng = $input['lng'];
		// $marker_obj->mapSymbol = $input['mapSymbol'];
		// $marker_obj->panelSize = $input['panelSize'];
		// $marker_obj->type  = $input['type'];
		// $marker_obj->save();
		return response()->json(["message" => "Marker saved successfully."]);
	}

	public function saveMarkersBulk(Request $request){
		if ($request->isJson()) {
			$input = $request->json()->all();
		} else {
			$input = $request->all();
		}
		try{
			Marker::saveBulkMarkers($input);
			return response()->json(["message" => "Mediums added successfully."]);
		}
		catch(Exception $ex){
			return response()->json(["message" => "Failed to add mediums to database. Please try again."]);
		}
	}
}
