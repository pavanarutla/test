'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('bbManager', [
  'ngRoute',
  'ui.router',
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
  // serverUrl : "http://localhost:8001",
  // apiPath : "http://localhost:8001/api",
  serverUrl : "http://104.236.11.252",
  apiPath : "http://104.236.11.252/api"
})
.config(['$locationProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdAriaProvider', '$authProvider', '$stateProvider', 'config',
  function($locationProvider, $urlRouterProvider, $mdThemingProvider, $mdAriaProvider, $authProvider, $stateProvider, config) {

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

    $stateProvider.state('index', {
      abstract: true,
      url: '/',
      templateUrl: 'layouts/default.html',
      controller: 'bbMngrCtrl'
    })
    .state('index.home', {
      url: 'home',
      templateUrl: 'views/home.html'      
    })
    .state('index.formats', {
      url: '/formats',
      templateUrl: 'views/formats.html',
      controller: 'FormatsCtrl'
    })
    .state('index.campaign', {
      url: '/campaign',
      templateUrl: 'views/campaign.html',
      controller: 'CampaignController'
    })
    .state('index.pricing', {
      url: '/pricing',
      templateUrl: 'views/pricing.html',
      controller: 'PricingCtrl'
    })
    .state('index.location', {
      url: '/location',
      templateUrl: 'views/map-home.html',
      controller: 'GmapCtrl'
    })
    .state('index.campagin', {
      url: '/campagin',
      templateUrl: 'views/campagin.html'
     //console:'CampaignController'
    })
    .state('index.campaginedit', {
      url: '/campaginedit',
      templateUrl: 'views/campaginedit.html'
    })
    .state('index.userprofile', {
      url: '/userprofile',
      templateUrl: 'views/userprofile.html'
    })
    .state('index.agency-rofile', {
      url: '/agency-rofile',
      templateUrl: 'views/agency-profile.html'
    })
    .state('admin', {
      // abstract: true,
      url: '/admin', 
      templateUrl: 'layouts/admin.html'
    })
    .state('admin.products', {
      url: '/admin/products',
      templateUrl: 'views/admin/products.html',
      controller: 'ProductsCtrl'
    })
    .state('admin.add-products', {
      url: '/admin/add-products',
      templateUrl: 'views/admin/add-products.html',
      controller: 'ProductsCtrl'
    })
    .state('admin.home',{
      url: '/home',
      templateUrl: 'views/admin/home.html' 
    })
    .state('admin.Feeds',{
      url: '/feeds',
      templateUrl: 'views/admin/campaignSearchFeed.html' 
    })
    .state('admin.campaign-suggestion',{
      url: '/campaign-suggestion',
      templateUrl: 'views/admin/campaignsugg.html' 
    })
    .state('admin.campaign',{
      url: '/campaign',
      templateUrl: 'views/admin/AdminCampaign.html' 
    })
    .state('admin.campaign-proposal-summary',{
      url: '/campaign-proposal-summary',
      templateUrl: 'views/admin/campaignproposalsummary.html' 
    })
    .state('admin.campaign-running-summary',{
      url: '/campaign-running-summary',
      templateUrl: 'views/admin/campaignrunningsummary.html' 
    })
    .state('admin.campaign-closed-summary',{
      url: '/campaign-closed-summary',
      templateUrl: 'views/admin/campaignclosedsummary.html' 
    })
    .state('admin.registration',{
      url: '/registration',
      templateUrl: 'views/admin/registration.html' 
    })
    .state('admin.companies',{
      url: '/companies',
      templateUrl: 'views/admin/companys.html' 
    })
    .state('admin.hoarding-list',{
      url: '/hoarding-list',
      templateUrl: 'views/admin/hoardinglist.html' 
    });

    $urlRouterProvider.when('/', '/home');
    $urlRouterProvider.when('/admin', '/admin/home');
    $urlRouterProvider.otherwise('/');

    // $routeProvider.when('/', {
    //   templateUrl: 'views/home.html',
    //   controller: 'bbMngrCtrl'
    // })
    // .when('/formats', {
    //   templateUrl: 'views/formats.html',
    //   controller: 'FormatsCtrl'
    // })
    // .when('/campaign', {
    //   templateUrl: 'views/campaign.html',
    //   controller: 'CampaignController'
    // })
    // .when('/pricing', {
    //   templateUrl: 'views/pricing.html',
    //   controller: 'PricingCtrl'
    // })
    // .when('/location', {
    //   templateUrl: 'views/map-home.html',
    //   controller: 'GmapCtrl'
    // })
    // .when('/admin/products', {
    //   templateUrl: 'views/admin/products.html',
    //   controller: 'ProductsCtrl'
    // })
    // .when('/admin/add-product', {
    //   templateUrl: 'views/admin/add-products.html',
    //   controller: 'ProductsCtrl'
    // })
    // .when('/campagin',{
    //   templateUrl: 'views/campagin.html'
    //  //console:'CampaignController'
    // })
    // .when('/campaginedit',{
    //   templateUrl: 'views/campaginedit.html'
    // })
    // .when('/userprofile',{
    //   templateUrl: 'views/userprofile.html'
    // })
    // .when('/agencyprofile',{
    //   templateUrl: 'views/agency-profile.html'
    // })
    // .when('/admin', {
    //   template: "<div></div>",
    //   controller:function(){
    //     window.location.href = '/admin';
    //   }
    // });
    // $routeProvider.otherwise({redirectTo: '/'});

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
          // '/location'
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