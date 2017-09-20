app.controller('bbAdminMgrAppCtrl', function ($scope, $mdDialog, $mdSidenav, $rootScope) {

  $scope.closeSidenav = function () {
    $mdSidenav('left').toggle();
  };
  $scope.closeSideNavPanel = function () {
    $mdSidenav('right').toggle();
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
    $scope.showArea = !$scope.showArea;
  }

});