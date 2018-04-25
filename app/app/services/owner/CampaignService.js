app.service('OwnerCampaignService', 
  ['$http', '$q', 'config', 
    function($http, $q, config){
      return {
        getOwnerCamapigns: function(ownerid){
          var dfd = $q.defer();
          $http.get(config.apiPath + '/owner-campaigns/' + ownerid).success(dfd.resolve).error(dfd.reject);
          return dfd.promise;
        },
      }
    }
  ]
);