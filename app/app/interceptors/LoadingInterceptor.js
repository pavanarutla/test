app.service('LoadingInterceptor',
  ['$q', '$rootScope', '$log', '$injector', '$timeout', '$location',
    function($q, $rootScope, $log, $injector, $timeout, $location) {
      'use strict';

      return {
        request: function(config) {
          $rootScope.loading = true;
          return config;
        },
        requestError: function(rejection) {
          $rootScope.loading = false;
          $log.error('Request error:', rejection);
          return $q.reject(rejection);
        },
        response: function(response) {
          $rootScope.loading = false;
          return response;
        },
        responseError: function(rejection) {
          $rootScope.loading = false;
          var toastr = $injector.get('toastr');
          var $mdDialog = $injector.get('$mdDialog');
          if(rejection.status == 401){
            toastr.error('Your session has expired. Please login again.');
            $timeout(function(){
              $mdDialog.show({
                templateUrl: 'views/signIn.html',
                fullscreen: true
              });
            }, 700);
          }
          else if(rejection.status == 403){
            toastr.error('You are not authorized to perform this action. Please contact admin.');
          }
          return $q.reject(rejection);
        }
      };
    }
  ]
);