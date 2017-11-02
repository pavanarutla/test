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
  'toastr',
  'ui.grid', 
  'ui.grid.edit',
  'ui.grid.pagination',
  'ngFileSaver'
])
app.constant('config', {
  serverUrl : "http://localhost:8001",
  apiPath : "http://localhost:8001/api",
  // serverUrl : "http://104.236.11.252",
  // apiPath : "http://104.236.11.252/api"
})
.config(['$locationProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdAriaProvider', '$authProvider', '$stateProvider', '$httpProvider', 'config',
  function($locationProvider, $urlRouterProvider, $mdThemingProvider, $mdAriaProvider, $authProvider, $stateProvider, $httpProvider, config) {

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
      url: 'formats',
      templateUrl: 'views/formats.html',
      controller: 'FormatsCtrl'
    })
    .state('index.pricing', {
      url: 'pricing',
      templateUrl: 'views/pricing.html',
      controller: 'PricingCtrl'
    })
    .state('index.location', {
      url: 'location',
      templateUrl: 'views/map-home.html',
      controller: 'GmapCtrl'
    })
    .state('index.campaign', {
      url: 'campaign',
      templateUrl: 'views/campaign.html',
      controller:'CampaignCtrl'
    })
    .state('index.campaigns', {
      url: 'campaigns',
      templateUrl: 'views/campaigns.html',
      controller:'CampaignCtrl'
    })
    .state('index.edit_campaign', {
      url: 'edit-campaign/{campaignId}',
      templateUrl: 'views/edit-campaign.html',
      controller: 'CampaignCtrl'
    })
    .state('index.profile', {
      url: 'profile',
      templateUrl: 'views/user-profile.html',
      controller: 'UserProfileCtrl'
    })
    .state('index.agency-rofile', {
      url: 'agency-profile',
      templateUrl: 'views/agency-profile.html'
    })
    .state('index.shortlist-mobile', {
      url: 'shortlist-mobile',
      templateUrl: 'views/shortlist-mobile.html'
    })
    .state('index.formats-mobile', {
      url: 'formats-mobile',
      templateUrl: 'views/formats-mobile.html',
      controller: 'GmapCtrl'
    })
    .state('index.suggest-mobile', {
      url: 'suggest-mobile',
      templateUrl: 'views/suggest-mobile.html',
      controller: 'GmapCtrl'
    })
    .state('index.savedcamapign-mobile', {
      url: 'suggest-mobile',
      templateUrl: 'views/savedcamapign-mobile.html',
      
    })
    .state('index.verify_email', {
      url: 'verify_email/{code}',
      templateUrl: 'views/home.html',
      controller: function($scope, $stateParams, UserService, toastr) {
        UserService.isMailVerified($stateParams.code).then(function(result){
          if(result.status == 1){
            $mdDialog.show({
              templateUrl: 'views/verification-success.html',
              fullscreen: $scope.customFullscreen,
              clickOutsideToClose: true
            });
          }
          else{
            toastr.error(result.message);
          }
        });
        $scope.goToLogin = function(){
          $location.path('/');
          $mdDialog.show({
            templateUrl: 'views/signIn.html',
            fullscreen: true
          });
        }
      }
    })
    .state('index.reset-password', {
      url: 'reset_password/{code}',
      templateUrl: 'views/reset-password.html',
      controller: 'UserSettingsCtrl'
    })
   
    .state('admin', {
      abstract: true,
      url: '/admin', 
      templateUrl: 'layouts/admin.html',
      controller: 'AdminMgrAppCtrl'
    })
    // .state('admin.products', {
    //   url: '/admin/products',
    //   templateUrl: 'views/admin/products.html',
    //   controller: 'ProductsCtrl'
    // })
    // .state('admin.add-products', {
    //   url: '/admin/add-products',
    //   templateUrl: 'views/admin/add-products.html',
    //   controller: 'ProductsCtrl'
    // })
    .state('admin.home',{
      url: '/home',
      templateUrl: 'views/admin/home.html',
      controller: 'AdminFeedsCtrl',
      title: 'Feeds'
    })
    .state('admin.Feeds',{
      url: '/suggest-products',
      templateUrl: 'views/admin/suggest-products.html',
      controller: 'AdminFeedsCtrl',
      title: 'Feeds'
    })
    .state('admin.campaign-suggestion',{
      url: '/campaign-suggestion',
      templateUrl: 'views/admin/campaignsugg.html',
      title: 'Campaign Suggestion'
    })
    .state('admin.campaign',{
      url: '/campaign',
      templateUrl: 'views/admin/campaign-list.html',
      controller: 'AdminCampaignCtrl',
      title: 'Campaign'
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
      templateUrl: 'views/admin/registration.html',
      controller: 'AdminRegistrationCtrl',
      title: "User Registration"
    })
    .state('admin.companies',{
      url: '/companies',
      templateUrl: 'views/admin/companies.html',
      controller: 'CompanyCtrl'
    })
    .state('admin.hoarding-list',{
      url: '/hoarding-list',
      templateUrl: 'views/admin/hoarding-list.html',
      controller: 'ProductCtrl'
    })
    .state('admin.formats',{
      url: '/formats',
      templateUrl: 'views/admin/formats.html',
      controller: 'ProductCtrl'
    })
    .state('admin.locations',{
      url: '/locations',
      templateUrl: 'views/admin/locations.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.locations-country',{
      url: '/locations-country',
      templateUrl: 'views/admin/location-country.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.locations-state',{
      url: '/locations-state',
      templateUrl: 'views/admin/location-state.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.locations-city',{
      url: '/locations-city',
      templateUrl: 'views/admin/location-city.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.locations-area',{
      url: '/locations-area',
      templateUrl: 'views/admin/location-area.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.subscribers',{
      url: '/subscribers',
      templateUrl: 'views/admin/subscribers.html',
      controller: 'subscribersCtrl'
    })
    .state('admin.queries',{
      url: '/queries',
      templateUrl: 'views/admin/queries.html',
      controller: 'queriesCtrl'
    })
    .state('admin.callcenterinfo',{
      url: '/callcenterinfo',
      templateUrl: 'views/admin/callcenterinfo.html',
      controller: 'callCenterCtrl'
    })
    .state('owner', {
      abstract: true,
      url: '/owner', 
      templateUrl: 'layouts/owner.html',
      controller: 'OwnerMngrCtrl'
    })
    .state('owner.dashboard',{
      url: '/dashboard',
      templateUrl: 'views/owner/dashboard.html',
      controller: 'DashboardCtrl'
    });

    $urlRouterProvider.when('/', '/home');
    $urlRouterProvider.when('/admin', '/admin/home');
    $urlRouterProvider.when('/owner', '/owner/dashboard');
    $urlRouterProvider.otherwise('/');

    $authProvider.baseUrl = config.apiPath;
    $authProvider.loginUrl = '/login';
    $authProvider.logoutUrl = '/logout'
    $authProvider.signupUrl = '/signup';
    // $authProvider.unlinkUrl = '/auth/unlink/';

    $mdAriaProvider.disableWarnings();
    $httpProvider.interceptors.push('LoadingInterceptor');
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
  ['$rootScope', '$location', '$http', '$auth', '$mdDialog', '$transitions', 'toastr',
    function($rootScope, $location, $http, $auth, $mdDialog, $transitions, toastr) {
      $transitions.onStart({}, function(transition) {
        // Get all URL parameter
        $rootScope.currentTitle = transition.to().title;
        if(transition.to().name == "index.location"){
          $rootScope.footerhide = true;
        }
        else{
          $rootScope.footerhide = false;
        }
      
        /*===========================================
          Restricting routes to Authenticated Users
        ===========================================*/
        var adminRoutes = [
          'admin.html',
          'admin.products',
          'admin.add-products',
          'admin.home',
          'admin.Feeds',
          'admin.campaign-suggestion',
          'admin.campaign',
          'admin.campaign-proposal-summary',
          'admin.campaign-running-summary',
          'admin.campaign-closed-summary',
          'admin.registration',
          'admin.companies',
          'admin.hoarding-list',
          'admin.formats',
          'admin.locations',
          'admin.locations-country',
          'admin.locations-state',
          'admin.locations-city',
          'admin.locations-area',
          'admin.subscribers',
          'admin.queries',
          'admin.callcenterinfo'
        ];
        var ownerRoutes = [
        ];
        var requiresLogin = [
          'index.location'
        ];

        // routes for authenticated Users
        if(_.indexOf(requiresLogin, transition.to().name) != -1){
          if(!$auth.isAuthenticated()){
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/signIn.html',
              fullscreen: true
            });
            return false;
          }
        }
        else if( _.indexOf(adminRoutes, transition.to().name) != -1 ){
          if(!$auth.isAuthenticated()){
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/signIn.html',
              fullscreen: true
            });
            return false;
          }
          else if( _.indexOf(_.pluck($auth.getPayload().user.roles, 'name'), 'admin') == -1){
            toastr.error("You don't have the rights to access this page. Please contact the owner.", "Error");
            return false;
          }
        }
        else if( _.indexOf(ownerRoutes, transition.to().name) != -1 ){
          if(!$auth.isAuthenticated()){
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/signIn.html',
              fullscreen: true
            });
          }
          else if( _.indexOf(_.pluck($auth.getPayload().user.roles, 'name'), 'owner') == -1){            
            toastr.error("You don't have the rights to access this page. Please contact the admin.", "Error");
            return false;
          }
        }
      });
    }
  ]
);