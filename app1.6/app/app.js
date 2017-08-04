'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngMap',
  // 'myApp.view1',
  // 'myApp.view2',
  // 'myApp.version'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.when('/home', {
    templateUrl: 'views/home.html',
    controller: 'HomeController',
    controllerAs: 'HomeCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/home'});
}]);

