<?php 

namespace App\Http\Middleware;

class CorsMiddleware {
  public function handle($request, \Closure $next)
  {
    $response = $next($request);
    $response->header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, PATCH, DELETE');
    $response->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization');
    $response->header('Access-Control-Allow-Origin', '*');
    return $response;
  }
}