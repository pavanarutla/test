'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('bbManager', [
  'ngRoute',
  'ngMap',
  'ngMaterial',
  'ngMessages',
  'slickCarousel',
  'vsGoogleAutocomplete',
  'ui.bootstrap',
  'ngFileUpload'
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
      templateUrl: 'views/home.html',
      controller: 'bbMngrCtrl'
    })
    .when('/formats', {
      templateUrl: 'views/formats.html',
      controller: 'FormatsCtrl'
    })
    .when('/campaign', {
      templateUrl: 'views/campaign.html',
      controller: 'CampaignController'
    })
    .when('/pricing', {
      templateUrl: 'views/pricing.html',
      controller: 'PricingCtrl'
    })
    .when('/location', {
      // resolve:{
      //   "check": function($location,$rootScope){
      //     if(!$rootScope.logiIn){
      //       $location.path('/')
      //     }
      //   }
      // },
      templateUrl: 'views/map-home.html',
      controller: 'GmapCtrl'
    })
    .when('/admin/products', {
      templateUrl: 'views/admin/products.html',
      controller: 'ProductsCtrl'
    })
    .when('/admin/add-product', {
      templateUrl: 'views/admin/add-products.html',
      controller: 'ProductsCtrl'
    })
    .when('/campagin',{
      templateUrl: 'views/campagin.html'
     //console:'CampaignController'
    })
    .when('/campaginedit',{
      templateUrl: 'views/campaginedit.html'
    })
    .when('/userprofile',{
      templateUrl: 'views/userprofile.html'
    })
    .when('/agencyprofile',{
      templateUrl: 'views/agency-profile.html'
    });
    $routeProvider.otherwise({redirectTo: '/'});
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

app.run( ['$rootScope', '$location', '$http', function($rootScope, $location, $http) {
  
  $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
    console.log('Current route name: ' + $location.path());
    // Get all URL parameter
    if($location.path() == "/location"){
      $rootScope.footerhide = true;
    }
    else{
      $rootScope.footerhide = false;
    }
    $rootScope.logOut = function(){      
      localStorage.getItem("logindata");
      $rootScope.logiIn = false;
    }
  });
}]);

app.constant('config', {
  // serverUrl : "http://localhost:8001",
  // apiPath : "http://localhost:8001/api",
  serverUrl : "http://104.236.11.252",
  apiPath : "http://104.236.11.252/api"
});
