
  /** * You must include the dependency on 'ngMaterial' */
    var app = angular.module('bbAdminManager', ['ngMaterial','ngRoute','ngMessages','googlechart']);
    
    app.config(function($mdThemingProvider,$routeProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('red',{
          'default':'800',
          'hue-1': '500', 
          'hue-2': '700', 
        })
        .accentPalette('orange');
        
        $routeProvider.when('/', {
        templateUrl: 'partials/home.html'
        }).when('/home',{
        templateUrl: 'partials/home.html' 
        }).when('/Feeds',{
        templateUrl: 'partials/campaignSearchFeed.html' 
        }).when('/campaginsuggestion',{
        templateUrl: 'partials/campaignsugg.html' 
        }).when('/admincampaign',{
        templateUrl: 'partials/AdminCampaign.html' 
        }).when('/Enterarea',{
        templateUrl: 'partials/enterAreaDetails.html' 
        });
        $routeProvider.otherwise({redirectTo: '/'});
    });




 

   