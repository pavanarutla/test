
  /** * You must include the dependency on 'ngMaterial' */
    var app = angular.module('bbAdminManager', [
      'ngMaterial',
      'ngRoute',
      'ngMessages',
      'googlechart',
      'ui.grid', 
      'ui.grid.edit',
      'ui.grid.pagination',
      'satellizer',
      'ngMaterialDateRangePicker'
    ]);
    
    app.config(function($mdThemingProvider,$routeProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('red',{
          'default':'800',
          'hue-1': '500', 
          'hue-2': '700', 
        })
        .accentPalette('orange');
        
        $routeProvider.when('/', {
          templateUrl: 'partials/login.html',
          controller: 'AuthCtrl'
        })
        .when('/home',{
          templateUrl: 'partials/home.html' 
        })
        .when('/Feeds',{
          templateUrl: 'partials/campaignSearchFeed.html' 
        })
        .when('/campaginsuggestion',{
          templateUrl: 'partials/campaignsugg.html' 
        })
        .when('/admincampaign',{
          templateUrl: 'partials/AdminCampaign.html' 
        })
        .when('/campaginproposalsummary',{
          templateUrl: 'partials/campaignproposalsummary.html' 
        })
        .when('/campaginrunningsummary',{
          templateUrl: 'partials/campaignrunningsummary.html' 
        })
        .when('/campaginclosedsummary',{
          templateUrl: 'partials/campaignclosedsummary.html' 
        })
        .when('/registration',{
          templateUrl: 'partials/registration.html' 
        })
        .when('/companies',{
          templateUrl: 'partials/companys.html' 
        })
        .when('/hoardinglist',{
          templateUrl: 'partials/hoardinglist.html' 
        });
        $routeProvider.otherwise({redirectTo: '/'});
    });




 

   