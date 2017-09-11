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
  'ngFileUpload',
  'satellizer',
  'toastr'
])
app.constant('config', {
  serverUrl : "http://localhost:8001",
  apiPath : "http://localhost:8001/api",
  // serverUrl : "http://104.236.11.252",
  // apiPath : "http://104.236.11.252/api"
})
.config(['$locationProvider', '$routeProvider', '$mdThemingProvider', '$mdAriaProvider', '$authProvider', 'config',
  function($locationProvider, $routeProvider, $mdThemingProvider, $mdAriaProvider, $authProvider, config) {

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

    $authProvider.baseUrl = config.apiPath;
    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    // $authProvider.unlinkUrl = '/auth/unlink/';

    $mdAriaProvider.disableWarnings();
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

/*========================
  Toastr Config
========================*/
app.config(['toastrConfig', function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: false,
    containerId: 'toast-container',
    maxOpened: 0,    
    newestOnTop: true,
    positionClass: 'toast-bottom-right',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body'
  });
}]);

app.run(
  ['$rootScope', '$location', '$http', '$auth', '$mdDialog', 'toastr',
    function($rootScope, $location, $http, $auth, $mdDialog, toastr) {
      $rootScope.$on('$routeChangeStart', function(event, curr, next) {
        // Get all URL parameter
        if($location.path() == "/location"){
          $rootScope.footerhide = true;
        }
        else{
          $rootScope.footerhide = false;
        }
      
        /*===========================================
          Restricting routes to Authenticated Users
        ===========================================*/
        var adminRoutes = [
          '/admin/add-product',
          '/admin/products'
        ];
        var ownerRoutes = [
          
        ];
        var requiresLogin = [
          '/location'
        ];

        // routes for authenticated Users
        if(_.indexOf(requiresLogin, curr.originalPath) != -1){
          if(!$auth.isAuthenticated()){
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/signIn.html',
              fullscreen: true
            });
          }
        }
        else if( _.indexOf(adminRoutes, curr.originalPath) != -1 ){
          if(!$auth.isAuthenticated()){
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/signIn.html',
              fullscreen: true
            });
          }
          else if( _.indexOf(_.pluck($auth.getPayload().roles, 'name'), 'admin') == -1){
            event.preventDefault();
            toastr.error("You don't have the rights to access this page. Please contact the owner.", "Error");
          }
        }
        else if( _.indexOf(ownerRoutes, curr.originalPath) != -1 ){
          if(!$auth.isAuthenticated()){
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/signIn.html',
              fullscreen: true
            });
          }
          else if( _.indexOf(_.pluck($auth.getPayload().roles, 'name'), 'owner') == -1){
            event.preventDefault();
            toastr.error("You don't have the rights to access this page. Please contact the admin.", "Error");
          }
        }
      });
    }
  ]
);