app.controller('AdminMgrAppCtrl', function ($scope, $mdDialog, $mdSidenav, $rootScope, $interval, $timeout, $location, $auth, AdminNotificationService, toastr, config) {

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
  
  $scope.logout = function(){
    $auth.logout().then(function(result){
      // console.log(result);
      $rootScope.isAuthenticated = false;
      $location.path('/');
      localStorage.clear();
      toastr.warning('You have successfully signed out!');        
    });
  }

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
    if($scope.adminNotifs && $scope.adminNotifs.length > 0){
      last_notif = moment.utc($scope.adminNotifs[0].updated_at).valueOf();
    }
    AdminNotificationService.getAllAdminNotifications(last_notif).then(function(result){
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
  // getAdminNotifs();
  // $interval(getAdminNotifs, 10000);
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

});