app.service('CompanyService', 
['$http', '$q', 'config', 
  function($http, $q, config){
    return {
      getCompanyTypes: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/company-types').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getCompanies: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/companies').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },      
      getHoardingCompanies: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/hoarding-companies').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveCompany: function(company){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/company', company).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveHoardingCompany: function(hoardingCompany){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/hoarding-company', hoardingCompany).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      deleteHoardingCompanies: function(hoardingCompanyId){
				var dfd = $q.defer();
				$http.delete(config.apiPath + '/hoarding-companies/' + formatId).success(dfd.resolve).error(dfd.reject);
				return dfd.promise;
      },
      registerCompany: function(company){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/company', company).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      grantPasswordGeneration: function(code){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/check-pwd-generation/' + code).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }
    }
}]);