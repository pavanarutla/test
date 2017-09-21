app.factory('AdminLocationService', 
['$http', '$q', 'config', 
  function($http, $q, config){
    return {
      getCountries: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/countries').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },  
      getStates: function(countryId){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/states/' + countryId).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAllStates: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/states').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getCities: function(stateIds){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/cities/' + stateIds).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAllCities: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/allCities').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAreas: function(citiIds){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/areas/' + citiIds).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAllAreas: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/allAreas').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveCountry: function(country){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/country', {country_name: country}).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },  
      saveState: function(state){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/state', state).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveCity: function(city){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/city', city).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveArea: function(area){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/area', area).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }
    }
  }
]
);