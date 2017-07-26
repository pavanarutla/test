app.service('GMarkerSrvc', ['$http', '$q', '$log', function($http, $q, $log) {
    
    // this.create = function(domElement, options) {
    //     if(options == undefined){
    //         var options = {
    //             center: new google.maps.LatLng(17.4574, 78.3720),
    //             zoom: 13,
    //             disableDefaultUI: true    
    //         }
    //     }
    //     this.map = new google.maps.Map(
    //         domElement, options
    //     );
    //     this.places = new google.maps.places.PlacesService(this.map);
    // }

    this.getMarkers = function() {
      var deferred = $q.defer();
      $http.get('api/markers').success(function(data) {
        deferred.resolve(data);
      }).error(function(msg, code) {
        deferred.reject(msg);
        $log.error(msg, code);
      });
      return deferred.promise;
    }
}]);