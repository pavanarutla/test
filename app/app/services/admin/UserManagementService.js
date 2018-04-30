app.service('AdminUserManagementService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        getAllRoles: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/system-roles').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getAllPermissions: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/system-permissions').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getAllUsers: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/users').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getRoleDetails: function(roleId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/role-details/' + roleId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);