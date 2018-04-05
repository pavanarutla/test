app.service('AdminUserService', 
['$http', '$q', 'config', 
  function($http, $q, config){
    return {
      getUsers: function(role){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/users').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getOwners: function(role){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/owners').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAgency: function(role){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/agency').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAdmins: function(role){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/admins').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAgencies: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/agencies').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }, 
      saveUser: function(user){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/user', user).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveAgency: function(agency){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/agencyByAdmin', agency).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      activateUser: function(userMID){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/activate-user/' + userMID).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      deleteUser: function(userMID){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/delete-user/' + userMID).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
       updateUserData: function(userMID, obj){
        var dfd = $q.defer();
        $http.put(config.apiPath + '/update-user/' + userMID, obj).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getPermissions: function(role){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/permissions/'+ role).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
     }, 
      getPermissionsByUsers: function(userid){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/userpermissions/'+ userid).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
    },
    }
}]);