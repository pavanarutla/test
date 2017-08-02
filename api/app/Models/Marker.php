<?php 

namespace App\Models;

use Moloquent\Eloquent\Model as Moloquent;

class Marker extends Moloquent{
  private $lat;
  private $lng;
  protected $connection = 'content';
}