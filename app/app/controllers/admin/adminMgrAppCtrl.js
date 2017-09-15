app.controller('bbAdminMgrAppCtrl', function ($scope, $mdDialog, $mdSidenav) {

  $scope.closeSidenav = function () {
    $mdSidenav('left').toggle();
  };
  $scope.closeSideNavPanel = function () {
    $mdSidenav('right').toggle();
  };
  $scope.firstname = "Feeds";
  $scope.changeName = function () {
    $scope.firstname = "Feeds";
  };
  $scope.changeProfile = function () {
    $scope.firstname = "Campaigns";
  };
  $scope.changeCampains = function () {
    $scope.firstname = " Location";
  };
  $scope.changeRequest = function () {
    $scope.firstname = "Billboards";
  };
  $scope.changeHoardingList = function () {
    $scope.firstname = "Registration";
  };
  $scope.changeTeam = function () {
    $scope.firstname = "Payement";
  };
  $scope.changeAgent = function () {
    $scope.firstname = "User Management";
  };
  $scope.companies = function () {
    $scope.firstname = "Companies";
  };
  $scope.callCenterInfo = function () {
    $scope.firstname = "Call Centre info";
  };
  $scope.offers = function () {
    $scope.firstname = "Offers";
  };

  $scope.limit = 3;

  $scope.loadMore = function () {
    $scope.limit = $scope.items.length
  }
  $scope.items = [
    {
      "campaignname": "Flipkart",
      "clientcomapanyname": "Neon",
      "clientname": "Chanikya",
      "clientcontent": "9966016136",
      "startdate": "12-Fed-2017",
      "enddate": "28-Feb-2017",
      "status": "Draft",
      "price": "25000",
      "products": "0"
    },
    {
      "campaignname": "Amezon",
      "clientcomapanyname": "Amezon",
      "clientname": "shiva",
      "clientcontent": "9966016136",
      "startdate": "12-Fed-2017",
      "enddate": "28-Feb-2017",
      "status": "Draft",
      "price": "30000",
      "products": "0"
    },
    {
      "campaignname": "Paytm",
      "clientcomapanyname": "Paytm",
      "clientname": "srikanth",
      "clientcontent": "9966016136",
      "startdate": "12-Fed-2017",
      "enddate": "28-Feb-2017",
      "status": "Draft",
      "price": "50000",
      "products": "0"
    }
  ]


  $scope.showCampaignDetails = function (ev) {
    $mdDialog.show({
      templateUrl: 'partials/campaignDetails-model.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
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

  $scope.showFormats = false;
  $scope.toogelMenu = function () {
    $scope.showFormats = !$scope.showFormats;
  }
  $scope.showArea = false;
  $scope.toogelLocation = function () {
    $scope.showArea  = !$scope.showArea ;
  }


});