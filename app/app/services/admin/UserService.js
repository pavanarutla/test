app.service('AdminUserService', 
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
      }, 
      saveUser: function(user){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/userByAdmin', user).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveAgency: function(agency){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/agencyByAdmin', agency).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }
    }
}]);