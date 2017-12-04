app.service('AdminCampaignService', 
['$http', '$q', 'config', 
  function($http, $q, config){
    
    return {
      getAllCampaigns: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/get-all-campaigns').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getAllCampaignRequests: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/all-campaign-requests').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getProposedCampaigns: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/all-campaigns/planning').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getPlannedCampaigns: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/all-campaigns/planned').success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      saveCampaign: function(campaign){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/campaign', campaign).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      sendSuggestionRequest: function(suggestionRequest){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/suggestion-request', suggestionRequest).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      deleteCampaign : function(campaginId){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      proposeProductForCampaign: function(obj){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/propose-product-for-campaign', obj).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      deleteProductFromCampaign: function(campaignId, productId){
        var dfd = $q.defer();
        $http.delete(config.apiPath + '/campaign/' + campaignId + '/product/' + productId).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getCampaignWithProducts: function(campaignId){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      updateProposedProduct: function(campaignId, obj){
        var dfd = $q.defer();
        $http.put(config.apiPath + '/proposed-product-for-campaign/' + campaignId, obj).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      finalizeCampaignByAdmin: function(campaignId){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/quote-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      launchCampaign: function(campaignId){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/launch-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      getCampaignPaymentDetails: function(campaignId){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/campaign-payments/' + campaignId).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      updateCampaignPayment: function(obj){
        var dfd = $q.defer();
        $http.post(config.apiPath + '/campaign-payment', obj).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      },
      closeCampaign: function(campaignId){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/close-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }
    }
  }
]
);