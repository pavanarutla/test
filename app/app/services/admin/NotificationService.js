app.service('AdminNotificationService', ['$http', '$q', 'config',
    function ($http, $q, config) {
        return {
            getAllAdminNotifications: function (last_notif) {
                var dfd = $q.defer();
                $http.get(config.apiPath + '/all-admin-notifications/last-notif/' + last_notif, {skipInterceptor: true}).success(dfd.resolve).error(dfd.reject);
                return dfd.promise;
            },
            updateNotifRead: function (notifId) {
                var dfd = $q.defer();
                $http.get(config.apiPath + '/update-notification-read/' + notifId, {skipInterceptor: true}).success(dfd.resolve).error(dfd.reject);
                return dfd.promise;
            },
            viewAdminNotification: function () {
                var dfd = $q.defer();
                $http.get(config.apiPath + '/get-notifications', {skipInterceptor: true}).success(dfd.resolve).error(dfd.reject);
                return dfd.promise;
            },
        }
    }
]);