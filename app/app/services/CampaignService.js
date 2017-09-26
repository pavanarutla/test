app.service('CampaignService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        getCampaigns: function(user_mongo_id){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/campaigns/' + user_mongo_id).success(dfd.resolve).error(dfd.reject);
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
        }
      }
    }
  ]
);