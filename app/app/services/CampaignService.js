app.service('CampaignService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        getCampaigns: function(user_mongo_id){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/campaigns').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getCampaignWithProducts: function(campaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        saveCampaign: function(campaign){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/campaign', campaign).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        addProductToExistingCampaign: function(productCampaignBundle){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/product-to-campaign', productCampaignBundle).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        sendSuggestionRequest: function(suggestionRequest){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/suggestion-request', suggestionRequest).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        deleteCampaign : function(campaignId){
          var dfd = $q.defer();
          $http.delete(config.apiPath + '/campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        shareCampaignToEmail: function(campaignToEmail){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/share-campaign', campaignToEmail).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);