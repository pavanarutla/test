/** * You must include the dependency on 'ngMaterial' */
    var app = angular.module('bbManager', ['ngMaterial','ngRoute','ngMessages','googlechart']);
    
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
        }).when('/Locationadmin',{
        templateUrl: 'partials/locationlist.html' 
        }).when('/Addarea',{
        templateUrl: 'partials/addArea-model.html' 
        }).when('/Enterarea',{
        templateUrl: 'partials/enterAreaDetails.html' 
        });
        $routeProvider.otherwise({redirectTo: '/'});
    });


    app.controller('bbMgrAppCtrl', function($scope,$mdDialog,$mdSidenav) {
      
      $scope.closeSidenav = function() {
         $mdSidenav('left').toggle();
      };
       $scope.closeSideNavPanel = function() {
         $mdSidenav('right').toggle();
      };
    $scope.firstname = "Feeds";
    $scope.changeName = function() {
        $scope.firstname = "Feeds";
    };
    $scope.changeProfile = function() {
        $scope.firstname = "Campaigns";
    };
    $scope.changeCampains = function() {
        $scope.firstname = " Location";
    };
     $scope.changeRequest = function() {
        $scope.firstname = "Billboards";
    };
    $scope.changeHoardingList = function() {
        $scope.firstname = "Registration";
    };
    $scope.changeTeam = function() {
        $scope.firstname = "Payement";
    };
    $scope.changeAgent = function() {
        $scope.firstname = "User Management";
    };
    $scope.companies = function() {
        $scope.firstname = "Companies";
    };
    $scope.callCenterInfo = function() {
        $scope.firstname = "Call Centre info";
    };
    $scope.offers = function() {
        $scope.firstname = "Offers";
    };

    $scope.limit= 3;
      
      $scope.loadMore = function() {
        $scope.limit = $scope.items.length
      }
$scope.items = [
  {
    "campaignname":"Flipkart",
    "clientcomapanyname":"Neon",
    "clientname":"Chanikya",
    "clientcontent":"9966016136",
    "startdate":"12-Fed-2017",
    "enddate":"28-Feb-2017",
    "status":"Draft",
    "price":"25000",
    "products":"0"
  },
  {
    "campaignname":"Amezon",
    "clientcomapanyname":"Amezon",
    "clientname":"shiva",
    "clientcontent":"9966016136",
    "startdate":"12-Fed-2017",
    "enddate":"28-Feb-2017",
    "status":"Draft",
    "price":"30000",
    "products":"0"
  },
  {
    "campaignname":"Paytm",
    "clientcomapanyname":"Paytm",
    "clientname":"srikanth",
    "clientcontent":"9966016136",
    "startdate":"12-Fed-2017",
    "enddate":"28-Feb-2017",
    "status":"Draft",
    "price":"50000",
    "products":"0"
  }
]


    $scope.showCampaignDetails = function (ev) {
    $mdDialog.show({
      templateUrl: 'partials/campaignDetails-model.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
    })
  };

      $scope.floorDetails = {
    roomDetails: [
      {
        bedIds: []
      },
      {
        bedIds: []
      },
      {
        bedIds: []
      },
       {
        bedIds: []
      },

    ]
  };
     
    });

 

   