app.controller('AdminMgrAppCtrl', function ($scope, $mdDialog, $mdSidenav, $rootScope, $interval, $timeout, $location, $auth,NotificationService, AdminNotificationService, toastr,$state, config,$window) {

  /*=================================
  | mdDilalog close function
  =================================*/

  if(typeof $rootScope.closeMdDialog !== 'function'){
    $rootScope.closeMdDialog = function(){
       $mdDialog.hide();
     }
   }
   $scope.getAdminNotifictaions = function() {
    AdminNotificationService.viewAdminNotification().then((result) => {
      $scope.getAdminNotifictaionss = result.notifications;
      $scope.unReadNotify = result.notifications.filter(function(item){
        if(item.status == 0){
            return true;
        }
      })
    });
  }
  $scope.getAdminNotifictaions();

  $scope.updateNotifyStatus = function(notificationType,campaignId,notifyId){
    
    NotificationService.updateNotification(notifyId).then(function(result){
      if(result){
        AdminNotificationService.viewAdminNotification().then((result) => {
          if(result){
            $scope.getAdminNotifictaionss = result.notifications;
          $scope.unReadNotify = result.notifications.filter(function(item){
            if(item.status == 0){
                return true;
            }
          })
            if(notificationType == 'metro-campaign'){
              $location.path("admin/metro-campaign/" +campaignId)
            }
            else if(notificationType == 'campaign'){
              $location.path("admin/campaign-proposal-summary/" + campaignId)
            }
            else if(notificationType == 'product'){
              $location.path("admin/hoarding-list" )
            }
            else if(notificationType == 'product-request'){
              $location.path("admin/hoarding-list" )
            }
          }
        });
      }
        
        
    }) 
 }


   /* Notification start */
   if($auth.isAuthenticated()){
          var user = localStorage.getItem("loggedInUser");
          var parsedData = JSON.parse(user);
          var user_type = parsedData.user_type;
          if ($auth.getPayload().userMongo.user_type == 'bbi') {
              var user_id = '-superAdmin';
          } else if ($auth.getPayload().userMongo.user_type == 'basic') {
              var user_id = parsedData.user_id;
          } else if ($auth.getPayload().userMongo.user_type == 'owner') {
              var user_id = '-' + parsedData.mong_id;
          }

        var pusher = new Pusher('c8b414b2b7d7c918a011', {
            cluster: 'ap2',
            forceTLS: true
        });
        var channel = pusher.subscribe('CampaignLaunch' + user_id);
        var channel1 = pusher.subscribe('campaignClosed' + user_id);
        var channel2 = pusher.subscribe('CampaignLaunchRequested' + user_id);
        var channel3 = pusher.subscribe('CampaignQuoteProvided' + user_id);
        var channel4 = pusher.subscribe('CampaignQuoteRequested' + user_id);
        var channel5 = pusher.subscribe('CampaignQuoteRevision' + user_id);
        var channel6 = pusher.subscribe('CampaignSuggestionRequest' + user_id);
        var channel7 = pusher.subscribe('CampaignSuspended' + user_id);
        var channel8 = pusher.subscribe('ProductApproved' + user_id);
        var channel9 = pusher.subscribe('ProductRequested' + user_id);
        var channel10 = pusher.subscribe('metroCampaignClosed' + user_id);
        var channel11 = pusher.subscribe('metroCampaignLaunched' + user_id);
        var channel12 = pusher.subscribe('metroCampignLocked' + user_id);

        channel.bind('CampaignLaunchEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })

        });
        channel1.bind('campaignClosedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })       
       });
        channel2.bind('CampaignLaunchRequestedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
             });
        channel3.bind('CampaignQuoteProvidedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel4.bind('CampaignQuoteRequestedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel5.bind('CampaignQuoteRevisionEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel6.bind('CampaignSuggestionRequestEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel7.bind('CampaignSuspendedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel8.bind('ProductApprovedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel9.bind('ProductRequestedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel10.bind('metroCampaignClosedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel11.bind('metroCampaignLaunchedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
        channel12.bind('metroCampignLockedEvent', function (data) {
          $scope.$apply(function(){
            $scope.unReadNotify.unshift(data);
            if($state.current.url == 'user-notifications' || $state.current.url == 'admin-notifications' || $state.current.url == 'owner-notifications'){
              $scope.getAdminNotifictaions();
          }
        })
        });
      }
      /* Notification Ends */
  /*=================================
  | mdDilalog close function ends
  =================================*/

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

  // $scope.closeSidenav = function () {
  //   $mdSidenav('left').toggle();
  // };
  // $scope.closeSideNavPanel = function () {
  //   $mdSidenav('right').toggle();
  // };
  // toggle menu 
  $scope.toggleAdminLeftSidenav = function () {
    $mdSidenav('adminLeftSidenav').toggle();
  };

  $scope.closeMenuSidenavIfMobile = function(){
    if($window.innerWidth <=420){
      $mdSidenav('adminLeftSidenav').close();
    }
  }

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
  $scope.showPayments = false;
  $scope.toogelPayments = function () {
    $scope.showPayments = !$scope.showPayments;
  }
  if($rootScope.currStateName == 'admin.admin-notifications'){
    $scope.getAdminNotifictaions();
}

  /*================================
  === Long polling notifications ===
  ================================*/
  // $scope.adminNotifs = [];
  // var getAdminNotifs = function(){
  //   var last_notif = 0;
  //   if($scope.adminNotifs && $scope.adminNotifs.length > 0){
  //     last_notif = moment.utc($scope.adminNotifs[0].updated_at).valueOf();
  //   }
  //   AdminNotificationService.getAllAdminNotifications(last_notif).then(function(result){
  //     $scope.adminNotifs = result.concat($scope.adminNotifs);
  //     $timeout(getAdminNotifs, 1000);
  //   });
  // }
  // getAdminNotifs();
  // $interval(getAdminNotifs, 10000);
  // getAdminNotifs();

  /*===============================
  |   Notification navigation 
  ===============================*/
  // $scope.viewNotification = function(notification){
  //   if(notification.type == 9){
  //     // hoarding requested
  //     $location.path('admin/requested-hoardings/' + notification.data.product_id);
  //   }
  //   else if(notification.type == 0){
  //     // campaign suggestion requested
  //     $location.path('admin/home/' + notification.data.campaign_sugg_req_id);
  //   }
  //   else if(notification.type > 0 && notification.type < 8){
  //     // campaign state changed
  //     $location.path('admin/campaign-proposal-summary/' + notification.data.campaign_id);
  //   }
  //   else if(notification.type == 8){
  //     // a new compnay joined. set up the super admin
  //     $location.path('admin/user-management/' + notification.data.client_m_id);
  //   }
  //   AdminNotificationService.updateNotifRead(notification.id).then(function(result){
  //     if(result.status == 1){
  //       // remove notif from list
  //       $scope.adminNotifs = _.filter($scope.adminNotifs, function(notif){ return notif.id != notification.id; })
  //     }
  //     else{
  //       toastr.error(result.message);
  //     }
  //   });
  //   $mdSidenav('right').toggle();
  // }

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
  $scope.getAvatar = function(){
    var payload = $auth.getPayload();
    var userMongo =  typeof payload !== 'undefined' ? payload.userMongo : undefined;
    if(typeof userMongo !== 'undefined' && typeof userMongo.profile_pic !== 'undefined' && userMongo.profile_pic != ''){
      return {
        present: true,
        profile_pic: userMongo.profile_pic
      }
    }
    else{
      return {
        present: false
      }
    }
  }
});