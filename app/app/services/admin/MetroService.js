app.factory('AdminMetroService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        saveCorridor: function(corridor){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/metro-corridor', corridor).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getMetroCorridors: function(corridor){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/metro-corridors').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        savePackage: function(package){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/metro-package', package).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getMetroPackages: function(corridorId){
          if(!corridorId){
            corrData = "";
          }
          else{
            corrData = "?corridor_id=" + corridorId;
          }
          var dfd = $q.defer();
          $http.get(config.apiPath + '/metro-packages' + corrData).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getMetroCampaigns: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/metro-campaigns').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getMetroCampaignDetails: function(metroCampaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/metro-campaign/' + metroCampaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);