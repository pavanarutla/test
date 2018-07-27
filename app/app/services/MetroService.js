app.factory('MetroService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        getMetroCorridors: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/metro-corridors').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getMetroPackages: function(corridorId){
          if(!corridorId){
            corrData = "";
          }
          else{
            corrData = "?corridor_id=" + corridorId;
          }
          var dfd = $q.defer();
          $http.get(config.apiPath + '/metro-packages' + corrData).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);