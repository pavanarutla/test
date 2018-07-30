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
        },
        shortlistPackage: function(packages){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/shortlist-metro-package', packages).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getShortlistPackages: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/shortlisted-metro-packages').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        deleteShortlistedMetroPackage: function(pkgId){
          var dfd = $q.defer();
          $http.delete(config.apiPath + '/shortlisted-metro-package/' + pkgId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);