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
        },
        updateProposedProduct: function(campaignId, obj){
          var dfd = $q.defer();
          $http.put(config.apiPath + '/proposed-product-for-campaign/' + campaignId, obj).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        finalizeCampaignByOwner: function(campaignId){
          var dfd = $q.defer();
          $http.put(config.apiPath + '/quote-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        saveOwnerCampaign: function(obj){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/non-user-campaign', obj).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getOwnerCampaigns: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/owner-campaigns').success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        getOwnerCampaignDetails: function(campaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/non-user-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
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
        launchCampaign: function(campaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/launch-campaign/' + campaignId).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
      }
    }
  ]
);