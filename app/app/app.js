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
  'ngFileSaver',
  'googlechart',
  'ui.grid.selection'
  // 'angular-carousel'
])
.config(['$locationProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdAriaProvider', '$authProvider', '$stateProvider', '$httpProvider', 'config',
  function ($locationProvider, $urlRouterProvider, $mdThemingProvider, $mdAriaProvider, $authProvider, $stateProvider, $httpProvider, config) {
    $mdThemingProvider.theme('default')
    .primaryPalette('red', {
      'default': '800',
      'hue-1': '500',
      'hue-2': '700',
    })
    .accentPalette('orange', {
      'default': '800',
      'hue-1': '600',
      'hue-2': '400',
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
    .state('index.suggest_campaign', {
      url: 'suggest-campaign',
      templateUrl: 'views/suggest-a-campaign.html',
      controller: 'CampaignCtrl'
    })
    .state('index.location', {
      url: 'location',
      templateUrl: 'views/map-home.html',
      controller: 'GmapCtrl'
    })
    .state('index.campaign', {
      url: 'campaign',
      templateUrl: 'views/campaign.html',
      controller: 'CampaignCtrl'
    })
    .state('index.campaigns', {
      url: 'campaigns',
      templateUrl: 'views/campaigns.html',
      controller: 'CampaignCtrl'
    })
    .state('index.view_campaign', {
      url: 'view-campaign/{campaignId}',
      templateUrl: 'views/campaign.html',
      controller: 'CampaignCtrl'
    })
    .state('index.profile', {
      url: 'profile',
      templateUrl: 'views/user-profile.html',
      controller: 'UserProfileCtrl'
    })
    .state('index.verify_email', {
      url: 'verify_email/{code}',
      templateUrl: 'views/home.html',
      controller: function ($scope, $stateParams, UserService, toastr) {
        UserService.isMailVerified($stateParams.code).then(function (result) {
          if (result.status == 1) {
            $mdDialog.show({
              templateUrl: 'views/verification-success.html',
              fullscreen: $scope.customFullscreen,
              clickOutsideToClose: true
            });
          }
          else {
            toastr.error(result.message);
          }
        });
        $scope.goToLogin = function () {
          $location.path('/');
          $mdDialog.show({
            templateUrl: 'views/sign-in.html',
            fullscreen: true
          });
        }
      }
    })
    .state('index.complete_registration', {
      url: 'complete_registration/:code',
      templateUrl: 'views/complete_registration.html',
      controller: 'UserSettingsCtrl',
      params:{
        code: {squash: true, value: null}
      }
    })
    .state('index.generate_password', {
      url: 'generate_password/:code',
      templateUrl: 'views/reset-password.html',
      controller: 'UserSettingsCtrl',
      params:{
        code: {squash: true, value: null}
      }
    })
    .state('index.reset-password', {
      url: 'reset_password/:code',
      templateUrl: 'views/reset-password.html',
      controller: 'UserSettingsCtrl',
      params:{
        code: {squash: true, value: null}
      }
    })
    .state('admin', {
      abstract: true,
      url: '/admin',
      templateUrl: 'layouts/admin.html',
      controller: 'AdminMgrAppCtrl'
    })
    .state('admin.home', {
      url: '/home/:campSuggReqId',
      templateUrl: 'views/admin/home.html',
      controller: 'AdminFeedsCtrl',
      title: 'Feeds',
      params:{
        campSuggReqId: {squash: true, value: null}
      }
    })
    .state('admin.suggest-products', {
      url: '/suggest-products',
      templateUrl: 'views/admin/suggest-products.html',
      controller: 'CampaignProposalCtrl',
      title: 'Feeds'
    })
    .state('admin.campaign', {
      url: '/campaigns',
      templateUrl: 'views/admin/campaign-list.html',
      controller: 'AdminCampaignCtrl',
      title: 'Campaign'
    })
    .state('admin.campaign-proposal-summary', {
      url: '/campaign-proposal-summary/{campaignId}',
      templateUrl: 'views/admin/campaign-proposal-summary.html',
      controller: 'CampaignProposalCtrl',
    })
    .state('admin.user-management', {
      url: '/user-management',
      templateUrl: 'views/admin/user-management.html',
      controller: 'UserMgmtCtrl',
      title: "User Management"
    })
    .state('admin.companies', {
      url: '/companies',
      templateUrl: 'views/admin/companies.html',
      controller: 'CompanyCtrl'
    })
    .state('admin.hoarding-list', {
      url: '/hoarding-list',
      templateUrl: 'views/admin/hoarding-list.html',
      controller: 'ProductCtrl'
    })
    .state('admin.formats', {
      url: '/formats',
      templateUrl: 'views/admin/formats.html',
      controller: 'ProductCtrl'
    })
    .state('admin.requested-hoardings', {
      url: '/requested-hoardings/:productId',
      templateUrl: 'views/admin/requested-hoardings.html',
      controller: 'ProductCtrl',
      params: {
        productId: {squash: true, value: null}
      }
    })
    .state('admin.locations', {
      url: '/locations',
      templateUrl: 'views/admin/locations.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.locations-country', {
      url: '/locations-country',
      templateUrl: 'views/admin/location-country.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.locations-state', {
      url: '/locations-state',
      templateUrl: 'views/admin/location-state.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.locations-city', {
      url: '/locations-city',
      templateUrl: 'views/admin/location-city.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.locations-area', {
      url: '/locations-area',
      templateUrl: 'views/admin/location-area.html',
      controller: 'AdminLocationCtrl'
    })
    .state('admin.subscribers', {
      url: '/subscribers',
      templateUrl: 'views/admin/subscribers.html',
      controller: 'subscriberCtrl'
    })
    .state('admin.queries', {
      url: '/queries',
      templateUrl: 'views/admin/queries.html',
      controller: 'customerQueriesCtrl'
    })
    .state('admin.callcenterinfo', {
      url: '/callcenterinfo',
      templateUrl: 'views/admin/callcenterinfo.html',
      controller: 'callCenterCtrl'
    })
    .state('admin.floating-campaign', {
      url: '/floating-campaign',
      templateUrl: 'views/admin/floating-campaign.html',
      controller: 'AdminCampaignCtrl'
    })
    // .state('admin.user-management', {
    //   url: '/user-management',
    //   templateUrl: 'views/admin/user-management.html',
    //   controller: 'UserManagementCtrl'
    // })
    // .state('admin.user-details', {
    //   url: '/user-details/:userMId',
    //   templateUrl: 'views/admin/user-details.html',
    //   controller: 'UserManagementCtrl'
    // })
    .state('owner', {
      abstract: true,
      url: '/owner/:client_slug',
      templateUrl: 'layouts/owner.html',
      controller: 'OwnerMngrCtrl'
    })
    .state('owner.dashboard', {
      url: '/dashboard',
      templateUrl: 'views/owner/dashboard.html',
      controller: 'OwnerFeedsCtrl',
      
    })
    .state('owner.campaigns', {
      url: '/campaigns',
      templateUrl: 'views/owner/campaigns.html',
      controller:  'OwnerCampaignCtrl'
    })
    .state('owner.campaign-details', {
      url: '/campaign-details/:campaignId/:campaignType',
      templateUrl: 'views/owner/campaign-details.html',
      controller: 'OwnerCampaignCtrl'
    })
    .state('owner.requested-hoardings', {
      url: '/requested-hoardings',
      templateUrl: 'views/owner/requested-hoardings.html',
      controller: 'OwnerProductCtrl'
    })
    .state('owner.suggest-products', {
      url: '/suggest-products',
      templateUrl: 'views/owner/suggest-products.html',
      controller: 'OwnerCampaignCtrl'
    })
    .state('owner.hoarding-list', {
      url: '/hoarding-list',
      templateUrl: 'views/owner/hoarding-list.html',
      controller: 'OwnerProductCtrl'
    })
    .state('owner.settings', {
      url: '/settings',
      templateUrl: 'views/owner/accountsetting.html',
      controller: ''
    })
    .state('owner.profile', {
      url: '/profile',
      templateUrl: 'views/owner/user-profile.html',
    })
    .state('owner.home', {
      url: '/home',
      templateUrl: 'views/owner/home.html',
      controller: 'OwnerHomeController'
    })
    .state('owner.outsourcingagent', {
      url: '/outsourcingagent',
      templateUrl: 'views/owner/outsourcingagent.html',
      controller:'outSourcing'
    })
    .state('owner.teamPage', {
      url: '/teamPage',
      templateUrl: 'views/owner/team.html',
      controller:'teamPage'
    })
    .state('owner.feedBack', {
      url: '/feedBack',
      templateUrl: 'views/owner/feedback.html',
      controller:'feedback'
    });

    $urlRouterProvider.when('/', '/home');
    $urlRouterProvider.when('/admin', '/admin/home');
    $urlRouterProvider.when('/owner', '/owner/:client_slug/dashboard');
    $urlRouterProvider.otherwise('/');

    $authProvider.baseUrl = config.apiPath;
    $authProvider.loginUrl = '/login';
    $authProvider.logoutUrl = '/logout'
    $authProvider.signupUrl = '/signup';
    $authProvider.storageType = 'localStorage';
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
app.config(['toastrConfig', function (toastrConfig) {
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
    function ($rootScope, $location, $http, $auth, $mdDialog, $transitions, toastr) {
      $transitions.onStart({}, function (transition) {
        // Get all URL parameter
        $rootScope.currentTitle = transition.to().title;
        $rootScope.currStateName = transition.to().name;
        if (transition.to().name == "index.location" && $auth.isAuthenticated()) {
          $rootScope.footerhide = true;
        }
        else {
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
          'admin.user-management',
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
           'owner.dashboard','owner.campaigns','owner.campaign-details', 'owner.requested-hoardings', 
           'owner.suggest-products','owner.hoarding-list', 'owner.settings' ,'owner.profile','owner.home', 
           'owner.outsourcingagent', 'owner.teamPage', 'owner.feedBack','owner.signIn'        ];
        var requiresLogin = [
          'index.location',
          'index.suggest_campaign'
        ];

        var pageaccessibleUser = [
           'index.campaign','index.campaigns','index.campaign'
        ];
          console.log($auth.getPayload().userMongo.user_type);
        if (_.indexOf(pageaccessibleUser, transition.to().name) != -1) {
           if ($auth.getPayload().userMongo.user_type != "basic") {
              $location.path('/');           
              return false;
          }
        }

        if (_.indexOf(requiresLogin, transition.to().name) != -1) {
          if (!$auth.isAuthenticated()) {
            $rootScope.postLoginState = transition.to().name;
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/sign-in.html',
              fullscreen: true
            });
            return false;
          }
        }

        // routes for authenticated Users
        if (_.indexOf(requiresLogin, transition.to().name) != -1) {
          if (!$auth.isAuthenticated()) {
            $rootScope.postLoginState = transition.to().name;
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/sign-in.html',
              fullscreen: true
            });
            return false;
          }
        }
        else if (_.indexOf(adminRoutes, transition.to().name) != -1) {
          if (!$auth.isAuthenticated()) {
            $rootScope.postLoginState = transition.to().name;
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/sign-in.html',
              fullscreen: true
            });
            return false;
          }
          else if ($auth.getPayload().userMongo.user_type != "bbi") {
            toastr.error("You don't have the rights to access this page. Please contact the owner.", "Error");
            return false;
          }
        }
        else if (_.indexOf(ownerRoutes, transition.to().name) != -1) {
          if (!$auth.isAuthenticated()) {
            $rootScope.postLoginState = transition.to().name;
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/sign-in.html',
              fullscreen: true
            });
          }
          else if ($auth.getPayload().userMongo.user_type != "owner") {
            toastr.error("You don't have the rights to access this page. Please contact the admin.", "Error");
            return false;
          }
        }
      });
    }
  ]
);