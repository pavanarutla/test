app.service('OwnerCampaignService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        getUserCampaignsForOwner: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/user-campaigns-for-owner').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getCampaignWithProductsForOwner: function(campaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/campaign-for-owner/' + campaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);