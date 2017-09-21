
app.factory('CompanysService', 
['$http', '$q', 'config', 
  function($http, $q, config){
  
    return {
        getCompanyList: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/company').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getHoardingList: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/hoarding').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
      },
      saveCompany: function(data){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/saveCompanyList' , data ).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
      },
      saveHoardingList: function(data){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/saveHoardingList' , data ).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
    }
    }
}]);