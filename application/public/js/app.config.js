'use strict';

app.config(['$locationProvider' ,'$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      $routeProvider.
        when('/home', {
          templateUrl: 'js/views/gmap.html',
          controller: 'GMapCtrl'
        }).
        when('/phones', {
          template: '<phone-list></phone-list>'
        }).
        when('/phones/:phoneId', {
          template: '<phone-detail></phone-detail>'
        }).
        otherwise('/home');
      //$locationProvider.html5Mode(true);
    }
  ]);
