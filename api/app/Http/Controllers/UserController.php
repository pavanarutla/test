<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;
use App\Models\Marker;
use App\Models\User;

class UserController extends Controller
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

	public function authenticate(Request $request)
  {
    if ($request->isJson()) {
        $input = $request->json()->all();
    } else {
        $input = $request->all();
    }
    $this->validate($request, [
      'email' => 'required',
      'password' => 'required'
    ]);
    $user = User::where('email', $input['email'])->first();
    if(md5($input['password'].$user->salt) == strtolower($user->password)){
      $apikey = base64_encode(str_random(40));
      $startDate = time();
      $exp_date = date('Y-m-d H:i:s', strtotime('+1 day', $startDate));
      User::where('email', $input['email'])->update(['api_key' => "$apikey", 'api_key_expire' => "$exp_date"]);
      return response()->json(['status' => 'success','api_key' => $apikey]);
    }
    else{
      return response()->json(['status' => 'fail'], 401);
    }
  }
}


