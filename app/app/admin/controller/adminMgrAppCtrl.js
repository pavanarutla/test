app.controller('bbAdminMgrAppCtrl', function ($scope, $mdDialog, $mdSidenav) {

  $scope.closeSidenav = function () {
    $mdSidenav('left').toggle();
  };
  $scope.closeSideNavPanel = function () {
    $mdSidenav('right').toggle();
  };
  $scope.changeName = function () {
    localStorage.adminCurrentPath = "Feeds";
  };
  $scope.changeProfile = function () {
    localStorage.adminCurrentPath = "Campaigns";
  };
  $scope.changeCampains = function () {
    localStorage.adminCurrentPath = " Location";
  };
  $scope.changeRequest = function () {
    localStorage.adminCurrentPath = "Billboards";
  };
  $scope.changeHoardingList = function () {
    localStorage.adminCurrentPath = "Registration";
  };
  $scope.changeTeam = function () {
    localStorage.adminCurrentPath = "Payement";
  };
  $scope.changeAgent = function () {
    localStorage.adminCurrentPath = "User Management";
  };
  $scope.companies = function () {
    localStorage.adminCurrentPath = "Companies";
  };
  $scope.callCenterInfo = function () {
    localStorage.adminCurrentPath = "Call Centre info";
  };
  $scope.offers = function () {
    localStorage.adminCurrentPath = "Offers";
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

  $scope.setTitle = function () {
    console.log(!localStorage.adminCurrentPath, "curr path");
    if (!localStorage.adminCurrentPath) {
      localStorage.adminCurrentPath = "Feeds";
    }
  }
  $scope.setTitle();

});