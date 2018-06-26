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
        },
        isMailVerified: function(code){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/verify-email/' + code).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getProfile: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/user-profile').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        requestResetPassword: function(sendObj){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/request-reset-password', sendObj).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        resetPassword: function(resetPwdObj){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/reset-password', resetPwdObj).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        changePassword: function(resetPwdObj){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/change-password', resetPwdObj).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        completeRegistration: function(userData){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/complete-registration', userData).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);