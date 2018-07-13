app.controller('AdminMgrAppCtrl', function ($scope, $mdDialog, $mdSidenav, $rootScope, $interval, $timeout, $location, $auth, AdminNotificationService, toastr, config) {

  /*========================
  | Notification types
  |==================
  
  'campaign-suggestion-requested'   =>    0,
  'campaign-quote-requested'        =>    1,
  'campaign-quote-provided'         =>    2,
  'campaign-launch-requested'       =>    3,
  'campaign-launched'               =>    4,
  'campaign-suspended'              =>    5,
  'campaign-closed'                 =>    6 
  
  =========================*/

  $rootScope.serverUrl = config.serverUrl;

  if(localStorage.loggedInUser){
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
  $scope.showCampagin = false;
  $scope.toogelCampagin = function () {
    $scope.showCampagin = !$scope.showCampagin;
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
      $scope.adminNotifs = result.concat($scope.adminNotifs);
      $timeout(getAdminNotifs, 1000);
    });
  }
  // getAdminNotifs();
  // $interval(getAdminNotifs, 10000);
  getAdminNotifs();

  /*===============================
  |   Notification navigation 
  ===============================*/
  $scope.viewNotification = function(notification){
    if(notification.type == 9){
      // hoarding requested
      $location.path('admin/requested-hoardings/' + notification.data.product_id);
    }
    else if(notification.type == 0){
      // campaign suggestion requested
      $location.path('admin/home/' + notification.data.campaign_sugg_req_id);
    }
    else if(notification.type > 0 && notification.type < 8){
      // campaign state changed
      $location.path('admin/campaign-proposal-summary/' + notification.data.campaign_id);
    }
    else if(notification.type == 8){
      // a new compnay joined. set up the super admin
      // console.log(notification);
    }
    AdminNotificationService.updateNotifRead(notification.id).then(function(result){
      if(result.status == 1){
        // remove notif from list
        $scope.adminNotifs = _.filter($scope.adminNotifs, function(notif){ return notif.id != notification.id; })
      }
      else{
        toastr.error(result.message);
      }
    });
    $mdSidenav('right').toggle();
  }

  /*===============================
  |   Notification navigation ends
  ===============================*/

  /*===============================
  | add new metro campagin         |
  ********************************/
  $scope.AddMetroCampaign = function () {
    $mdSidenav('metroAddCmapginSidenav').toggle();
  };
  $scope.AddMetroProduct = function () {
    $mdSidenav('metro-product').toggle();
  };

});