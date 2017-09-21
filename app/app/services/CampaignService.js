app.service('CampaignService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        saveCampaign: function(campaign){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/campaign', campaign).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);