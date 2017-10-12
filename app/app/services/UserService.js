app.service('UserService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        logout: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/logout').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getAllUsers: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/users').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        registerUser: function(user){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/user', user).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);