app.service('AdminNotificationService', ['$http', '$q', 'config', 
  function($http, $q, config){
    return {
      getAllAdminNotifications: function(){
        var dfd = $q.defer();
        $http.get(config.apiPath + '/all-admin-notifications', {skipInterceptor: true}).success(dfd.resolve).error(dfd.reject);
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