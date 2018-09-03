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
    // .state('index.suggest_campaign', {
    //   url: 'suggest-campaign',
    //   templateUrl: 'views/suggest-a-campaign.html',
    //   controller: 'CampaignCtrl'
    // })
    $stateProvider.state('index.suggest', {
      url: 'suggest',
      templateUrl: 'views/suggest-a-campaign.html',
      controller: 'CampaignCtrl'
    })   
    // nested states 
    // each of these sections will have their own view
    // url will be suggest-Product-Detail
    .state('index.suggest.product-detail', {
        url: '/product-detail',
        templateUrl: 'views/suggest-campaign-one.html',
        controller: 'CampaignCtrl'
    })
    // url will be suggest-market-Detail
    .state('index.suggest.marketing-objectives', {
        url: '/marketing-objectives',
        templateUrl: 'views/suggest-campaign-two.html',
        controller: 'CampaignCtrl'
    })
    // url will be suggest-Advertising-Detail
    .state('index.suggest.advertising-objectives', {
        url: '/advertising-objectives',
        templateUrl: 'views/suggest-campaign-three.html',
        controller: 'CampaignCtrl'
    })
      // url will be suggest-Advertising-Detail
    .state('index.suggest.other-info', {
        url: '/other-info',
        templateUrl: 'views/suggest-campaign-four.html',
        controller: 'CampaignCtrl'
    })
    .state('index.location', {
      url: 'location',
      templateUrl: 'views/map-home.html',
      controller: 'GmapCtrl'
    })
    .state('index.metro', {
      url: 'metro',
      templateUrl: 'views/metro.html',
      controller: 'MetroCtrl'
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
    .state('index.metro-campaign', {
      url: 'metro-campaign/{metroCampaignId}',
      templateUrl: 'views/metro-campaign-details.html',
      controller: 'MetroCtrl'
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
    .state('admin.metro-campaigns', {
      url: '/metro-campaigns',
      templateUrl: 'views/admin/metro-campaign-list.html',
      controller: 'AdminCampaignCtrl',
      title: 'Campaign'
    })
    .state('admin.metro-corridors', {
      url: '/metro-corridors',
      templateUrl: 'views/admin/metro-corridors.html',
      controller: 'AdminMetroCtrl'
    })
    .state('admin.metro-packages', {
      url: '/metro-packages',
      templateUrl: 'views/admin/metro-packages.html',
      controller: 'AdminMetroCtrl'
    })
    .state('admin.metro-campaign', {
      url: '/metro-campaign/{metroCampaignId}',
      templateUrl: 'views/admin/metro-campaign-details.html',
      controller: 'AdminCampaignCtrl',
      title: 'Campaign'
    })
    .state('admin.campaign-proposal-summary', {
      url: '/campaign-proposal-summary/{campaignId}',
      templateUrl: 'views/admin/campaign-proposal-summary.html',
      controller: 'CampaignProposalCtrl',
    })
    .state('admin.user-management', {
      url: '/user-management/:clientID',
      templateUrl: 'views/admin/user-management.html',
      controller: 'UserMgmtCtrl',
      params: {
        clientID: {squash: true, value: null}
      },
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
    .state('admin.metro-formats', {
      url: '/metro-formats',
      templateUrl: 'views/admin/metro-formtas.html',
      controller: 'AdminMetroCtrl'
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
    .state('owner.feeds', {
      url: '/feeds',
      templateUrl: 'views/owner/feeds.html',
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
    .state('owner.product-details', {
      url: '/product-details/:productId',
      templateUrl: 'views/owner/product-details.html',
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
    // .state('owner.home', {
    //   url: '/home',
    //   templateUrl: 'views/owner/home.html',
    //   controller: 'OwnerHomeCtrl'
    // })
    // .state('owner.outsourcingagent', {
    //   url: '/outsourcingagent',
    //   templateUrl: 'views/owner/outsourcingagent.html',
    //   controller:'outSourcing'
    // })
    // .state('owner.teamPage', {
    //   url: '/teamPage',
    //   templateUrl: 'views/owner/team.html',
    //   controller:'teamPage'
    // })
    // .state('owner.feedBack', {
    //   url: '/feedBack',
    //   templateUrl: 'views/owner/feedback.html',
    //   controller:'feedback'
    // })
    .state('owner.payments', {
      url: '/payments',
      templateUrl: 'views/owner/campaign-payments.html',
      controller:'OwnerCampaignCtrl'
    })
    .state('owner.update-payments', {
      url: '/update-payments',
      templateUrl: 'views/owner/add-payment.html',
      controller:'OwnerCampaignCtrl'
    })
    .state('owner.signIn', {
      url: '/signIn',
      templateUrl: 'views/owner/signin.html',
      controller:'ownerSigninCtrl'
    });

    $urlRouterProvider.when('/', '/home');
    $urlRouterProvider.when('/admin', '/admin/home');
    $urlRouterProvider.when('/owner', '/owner/:client_slug/feeds');
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
          'owner.home',
          'owner.feeds',
          'owner.campaigns',
          'owner.campaign-details',
          'owner.requested-hoardings',
          'owner.suggest-products',
          'owner.hoarding-list',
          'owner.product-details',
          'owner.settings',
          'owner.profile',
          'owner.payments',
          'owner.update-payments'
        ];
        var requiresLogin = [
          'index.location',
        ];
        var userRoutes = [
          'index.suggest',
          'index.suggest.product-detail',
          'index.suggest.marketing-objectives',
          'index.suggest.advertising-objectives',
          'index.suggest.other-info'
        ];

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
        else if (_.indexOf(userRoutes, transition.to().name) != -1) {
          if (!$auth.isAuthenticated()) {
            $rootScope.postLoginState = transition.to().name;
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/sign-in.html',
              fullscreen: true
            });
          }
          else if ($auth.getPayload().userMongo.user_type != "basic") {
            toastr.error("You don't have the rights to access this page.", "Error");
            return false;
          }
        }

        // Get all URL parameter
        $rootScope.currentTitle = transition.to().title;
        $rootScope.currStateName = transition.to().name;
        if ((transition.to().name == "index.location" || transition.to().name == "index.metro")&& $auth.isAuthenticated()) {
          $rootScope.footerhide = true;
        }
        else {
          $rootScope.footerhide = false;
        }

      });
    }
  ]
);