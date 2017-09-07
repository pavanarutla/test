app.factory('ContactService', ['$http', '$q', 'config', function($http, $q, config){
return {
feedBackData: function(feed){
      var dfd = $q.defer();
      $http.post(config.apiPath + '/feedbackdata', feed).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    contactNumber: function(result){
      var dfd = $q.defer();
      $http.post(config.apiPath + '/contactNumber', result).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    }
}
}]);
