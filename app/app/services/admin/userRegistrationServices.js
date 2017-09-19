
app.factory('RegistrationService', 
['$http', '$q', 'config', 
  function($http, $q, config){
  
    return {
        getUsers: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/users').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAgencies: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/agencies').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
      }
    }
}]);