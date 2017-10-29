app.service('CampaignService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        getCampaigns: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/campaigns').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getPlannedCampaigns: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/planned-campaigns').success(dfd.resolve).error(dfd.reject);
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
        },
        shareShortListedProducts: function (obj) {
          var dfd = $q.defer();
          $http.post(config.apiPath + '/share-shortlisted', obj).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        deleteProductFromCampaign: function(campaignId, productId){
          var dfd = $q.defer();
          $http.delete(config.apiPath + '/campaign/' + campaignId + '/product/' + productId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        exportCampaignsPdf: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/export-all-campaigns', {}, { responseType: 'arraybuffer' }).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);