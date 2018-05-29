app.service('OwnerCampaignService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        getOwnerCamapigns: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/owner-campaigns' ).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        ownerCamapignsRequest: function(){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/owner-campaign-request' ).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        ownerCamapignPDF: function(obj){
          var dfd = $q.defer();
          $http.post(config.apiPath + '/owner-campaign-pdf',obj ).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
        ownerCamapignLaunch: function(campaignId){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/owner-campaign-launch/'+campaignId ).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
      }
    }
  ]
);