app.factory('ContactService', ['$http', '$q', 'config', function($http, $q, config){
return {
feedBackData: function(feed){
      var dfd = $q.defer();
      $http.post(config.apiPath + '/feedbackdata', feed).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getfeedBackData: function(){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/getfeedBackData').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    contactNumber: function(result){
      var dfd = $q.defer();
      $http.post(config.apiPath + '/contactNumber', result).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    subscribeData: function(email){
      var dfd = $q.defer();
      $http.post(config.apiPath + '/subscribeData', email).success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    },
    getsubscribeData: function(){
      var dfd = $q.defer();
      $http.get(config.apiPath + '/getsubscribeData').success(dfd.resolve).error(dfd.reject);
      return dfd.promise;
    }
}
}]);
