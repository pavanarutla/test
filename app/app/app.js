'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('bbManager', [
  'ngRoute',
  'ngMap',
  'ngMaterial',
  'ngMessages',
  'slickCarousel',
  'ui.bootstrap'
])
.config(['$locationProvider', '$routeProvider', '$mdThemingProvider', 
  function($locationProvider, $routeProvider, $mdThemingProvider) {
    

    $mdThemingProvider.theme('default')
    .primaryPalette('red',{
      'default':'800',
      'hue-1': '500', 
      'hue-2': '700', 
    })
    .accentPalette('orange',{
      'default': '800',
      'hue-1':'600',
      'hue-2':'400',
    });
              
    $routeProvider.when('/', {
      templateUrl: 'views/home.html'
      // controller: 'bbMngrCtrl'
    })
    .when('/formats', {
      templateUrl: 'views/formats.html'
      //controller: 'LocationController'
    })
    .when('/pricing', {
      templateUrl: 'views/pricing.html'
      //controller: 'LocationController'
    })
    .when('/location',{
      templateUrl: 'views/map-home.html'
      
    });
    $routeProvider.otherwise({redirectTo: '/home'});
  }
]);


/* ===================
Slick Carasoul Config
====================*/
app.config(['slickCarouselConfig', function (slickCarouselConfig) {
  slickCarouselConfig.dots = true;
  slickCarouselConfig.autoplay = false;
}]);
app.config(['datepickerConfig', 'datepickerPopupConfig', function (datepickerConfig, datepickerPopupConfig) {
    datepickerConfig.startingDay = "Today";
    datepickerConfig.showWeeks = false;
    datepickerPopupConfig.datepickerPopup = "MM/dd/yyyy";
    // datepickerPopupConfig.currentText = "Now";
    // datepickerPopupConfig.clearText = "Erase";
    // datepickerPopupConfig.closeText = "Close";
}]);