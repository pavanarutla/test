app.service('ownerNotificationService', ['$http', '$q', 'config', 
  function($http, $q, config){
    return {
      getAllOwnerNotifications: function(notifId){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/all-owner-notifications/last-notif/'+notifId, {skipInterceptor: true}).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }, 
      updateNotifRead:  function(notifId){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/update-notification-read/' + notifId, {skipInterceptor: true}).success(dfd.resolve).error(dfd.reject);
        return dfd.promise;
      }, 
    }
  }
]);