app.service('CampaignService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        suggestedData : {},
        getActiveUserCampaigns: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/active-user-campaigns').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getCampaignWithProducts: function(campaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/user-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        saveUserCampaign: function(campaign){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/user-campaign', campaign).success(dfd.resolve).error(dfd.reject);
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
        deleteProductFromUserCampaign: function(campaignId, productId){
          var dfd = $q.defer();
          $http.delete(config.apiPath + '/user-campaign/' + campaignId + '/product/' + productId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        exportCampaignsPdf: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/export-all-campaigns', { responseType: 'arraybuffer' }).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        requestCampaignProposal: function(campaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/request-proposal/' + campaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        requestLaunch: function(campaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/request-campaign-launch/' + campaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        requestChangeInQuote: function(sendObj){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/request-quote-change', sendObj).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        }
      }
    }
  ]
);