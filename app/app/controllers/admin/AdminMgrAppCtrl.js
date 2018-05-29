app.controller('AdminMgrAppCtrl',["$scope", "$mdDialog", "$mdSidenav", "$rootScope", "$interval", "$timeout", "$location", "AdminNotificationService", "config", function ($scope, $mdDialog, $mdSidenav, $rootScope, $interval, $timeout, $location, AdminNotificationService, config) {

  $rootScope.serverUrl = config.serverUrl;

  if(localStorage.isAuthenticated && localStorage.loggedInUser){
    $rootScope.isAuthenticated = localStorage.isAuthenticated || false;
    $rootScope.loggedInUser = JSON.parse(localStorage.loggedInUser);
  }

  $scope.closeSidenav = function () {
    $mdSidenav('left').toggle();
  };
  $scope.closeSideNavPanel = function () {
    $mdSidenav('right').toggle();
  };
  
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
  ];

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
      

    ]
  };

  $scope.showFormats = false;
  $scope.toogelMenu = function () {
    $scope.showFormats = !$scope.showFormats;
  }
   $scope.showLocation = false;
  $scope.toogelLocation = function () {
    $scope.showLocation = !$scope.showLocation;
  }
  $scope.showArea = false;
  $scope.toogelLocation = function () {
    $scope.showArea = !$scope.showArea;
  }

  /*================================
  === Long polling notifications ===
  ================================*/
  $scope.adminNotifs = [];
  var getAdminNotifs = function(){
    var last_notif = 0;
    if($scope.notifs && $scope.notifs.length > 0){
      last_notif = moment.utc($scope.adminNotifs[0].updated_at).valueOf();
    }
    AdminNotificationService.getAllAdminNotifications().then(function(result){
      $scope.adminReadNotifCount = _.chain(result).filter(function(notif){
        return notif.status == 1;
      }).value().length;
      $scope.adminUnreadNotifCount = _.chain(result).filter(function(notif){
        return notif.status == 0;
      }).value().length;
      $scope.adminNotifs = _.union($scope.adminNotifs, result);
      $timeout(getAdminNotifs, 1000);
    });
  }
  getAdminNotifs();

  /*===============================
  |   Notification navigation 
  ===============================*/
  $scope.showCampaignDetails = function(notificationId){
    AdminNotificationService.updateNotifRead(notificationId).then(function(result){
      if(result.status == 1){
        getAdminNotifs();
      }
      else{
        toastr.error(result.message);
      }
    });
    $mdSidenav('right').toggle();
    $location.path('/admin/home');
  }

}]);