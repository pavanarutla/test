app.controller('AdminMgrAppCtrl', function ($scope, $mdDialog, $mdSidenav, $rootScope, $interval, $location, AdminNotificationService, config , $auth,AdminUserService) {
  
  roles = $auth.getPayload().user.roles;
  if(roles[0].name=='billboard'){
    $scope.showMenus = true;
  }else{
    $scope.showMenus = false;
      AdminUserService.getPermissionsByUsers($auth.getPayload().user.id).then(function (response) {
        if(response.status==1){
          $scope.managemenus= response.data;          
         }else{
          console.log(roles[0].permissions);
          console.log(_.indexOf(_.pluck(roles[0].permissions, "name"), "manage-user"));
          $scope.managemenus= roles[0].permissions;          
        }
        $scope.manage_owner = _.indexOf(_.pluck($scope.managemenus, 'name'), 'manage-owner');
        $scope.manage_agency = _.indexOf(_.pluck($scope.managemenus, 'name'), 'manage-agency');
        $scope.manage_user = _.indexOf(_.pluck($scope.managemenus, 'name'), 'manage-user');
        $scope.manage_campaigns = _.indexOf(_.pluck($scope.managemenus, 'name'), 'manage-campaigns');
        $scope.manage_queries = _.indexOf(_.pluck($scope.managemenus, 'name'), 'manage-queries');
      });
  }
  $rootScope.serverUrl = config.serverUrl;

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
   $scope.showUserM = false;
  $scope.toogleshowUserM = function () {
    $scope.showUserM = !$scope.showUserM;
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
  var getAdminNotifs = function(){
    AdminNotificationService.getAllAdminNotifications().then(function(result){
      $scope.adminReadNotifCount = _.chain(result).filter(function(notif){
        return notif.status == 1;
      }).value().length;
      $scope.adminUnreadNotifCount = _.chain(result).filter(function(notif){
        return notif.status == 0;
      }).value().length;
      $scope.adminNotifs = result;
    });
  }
  getAdminNotifs();
  $interval(getAdminNotifs, 10000);

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