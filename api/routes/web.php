<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app){
    return view('test');
});

$app->group(['prefix' => 'api'], function () use ($app){
    /* Markers */
    $app->get('markers', ['uses' => 'MarkerController@getMarkers']);
    $app->post('markers', ['uses' => 'MarkerController@saveMarkers']);
    
    /* Authentication */
    $app->post('auth', ['uses' => 'UserController@authenticate']);
});