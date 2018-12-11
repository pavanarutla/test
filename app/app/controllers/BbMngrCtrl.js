app.controller('bbMngrCtrl', function ($scope, $mdDialog, $mdSidenav, $timeout, $location, $rootScope, MapService, $auth, toastr, ContactService, 
  CampaignService, UserService, LocationService, NotificationService, config, $window, $interval) {

  /*=================================
  | mdDilalog close function
  =================================*/

  if(typeof $rootScope.closeMdDialog !== 'function'){
    $rootScope.closeMdDialog = function(){
      $mdDialog.hide();
    }
  }

  /*=================================
  | mdDilalog close function ends
  =================================*/
      

    $scope.forms = {};

    if(localStorage.loggedInUser){
      $rootScope.isAuthenticated = localStorage.isAuthenticated || false;
      $rootScope.loggedInUser = JSON.parse(localStorage.loggedInUser);
    }

    // handles traffic layer on map
    $scope.trafficOn = false;

    $scope.filter = false;
    $scope.format = false;
    $scope.shortlist = false;
    $scope.savedcampaign = false;

    $scope.showfooter = true;

    $scope.browabillboard = false;

    $scope.dashboardData = true;
    $scope.locationpageonly = false;

    $rootScope.isAuthenticated = $auth.isAuthenticated();

    $scope.filters = function () {
      $scope.filter = !$scope.filter;
      $scope.format = false;
      $scope.shortlist = false;
      $scope.savedcampaign = false;
    }
    $scope.formats = function () {
      $scope.filter = false;
      $scope.format = !$scope.format;
      $scope.shortlist = false;
      $scope.savedcampaign = false;
    }

    $scope.shortlistDiv = function () {
      $scope.filter = false;
      $scope.format = false;
      $scope.shortlist = !$scope.shortlist;
      $scope.savedcampaign = false;
    }

    $scope.savedcampaignDiv = function () {
      $scope.filter = false;
      $scope.format = false;
      $scope.shortlist = false;
      $scope.savedcampaign = !$scope.savedcampaign;
    }

    
    // mobile footer version

    $scope.isactive = false;
    $scope.isshortlisted = false;
    $scope.iscampaigns = false;
    $scope.isformats = false;
    $scope.issuggestme= false;
    $scope.Home = function(){
      $scope.isactive = !$scope.isactive;
      $scope.isshortlisted = false;
      $scope.iscampaigns = false;
      $scope.isformats = false;
      $scope.issuggestme= false;
    }
    $scope.shortlisted = function(){
      $scope.isshortlisted = !$scope.isshortlisted;
      $scope.isactive = false;
      $scope.iscampaigns = false;
      $scope.isformats = false;
      $scope.issuggestme= false;
    }
    $scope.campaigns  = function(){
      $scope.iscampaigns = !$scope.iscampaigns;
      $scope.isactive = false;
      $scope.isshortlisted = false;
      $scope.isformats = false;
      $scope.issuggestme= false;
    }
    $scope.formatmobile = function(){
      $scope.isformats = !$scope.isformats;
      $scope.isactive = false;
      $scope.isshortlisted = false;
      $scope.iscampaigns = false;
      $scope.issuggestme= false;
    }
    $scope.suggestme = function(){
      $scope.issuggestme = !$scope.issuggestme;
      $scope.isactive = false;
      $scope.isshortlisted = false;
      $scope.iscampaigns = false;
      $scope.isformats = false;
    }
    // side favicon functionality
    this.isOpen = false;
    this.availableModes = ['md-fling', 'md-scale'];
    this.selectedMode = 'md-fling';
    this.selectedDirection = 'up';

    $scope.toggleTraffic = function(){
      $scope.trafficOn = !$scope.trafficOn;
    }

    $scope.closeSidenav = function () {
      $mdSidenav('left').toggle();
    };

    $scope.closeSideNavPanel = function () {
      $mdSidenav('right').toggle();
    };

    $scope.showSignInDialog = function (ev) {
      $mdDialog.show({
        templateUrl: 'views/sign-in.html',
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose:true,
        preserveScope: true,
        scope: $scope, 
        controller: 'AuthCtrl'
      })
    };

    // email verification succes massage
    $scope.emailSucess = function (ev) {
      $mdDialog.show({
        templateUrl: 'views/email-verification-sucess.html',
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose:true,
      })
    };

    $scope.whatwedo = function () {
      $location.path('/');
      window.scroll(0, 580);
    }
    $scope.formate = function () {
      $location.path('/');
      window.scroll(0, 1550)
    }
    $scope.whyOutdoor = function () {
      $location.path('/');
      window.scroll(0, 2430)
    }
    $scope.contactus = function () {
      $location.path('/');
      window.scroll(0, 3270)
    }

  //scroll to top
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.goToTop').fadeIn();
    } else {
      $('.goToTop').fadeOut();
    }
  });


  $('.goToTop').click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    return false;
  });


  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 0) {
      $(".header").addClass("active");
      $(".toolbar-btn").addClass("active-one");
      $(".browse-btn").addClass("active-one");
    } else {
      //remove the background property so it comes transparent again (defined in your css)
      $(".header").removeClass("active");
      $(".toolbar-btn").removeClass("active-one");
      $(".browse-btn").removeClass("active-one");
    }
  });

  //slider
  $scope.slickConfig2Loaded = true;

  $scope.slickConfig2 = {
    autoplay: false,
    infinite: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        infinite: true
      }
    }, {
      breakpoint: 959,
      settings: {
        slidesToShow: 2,
        infinite: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        infinite: true
      }
    }, {
      breakpoint: 320,
      settings: {
        slidesToShow: 1,
        infinite: true
      }
    }],
    method: {}
  };

  $scope.query={};
  $scope.sendQuery = function () {
    ContactService.sendQuery($scope.query).then(function (result) {
      if(result.status == 1){
        toastr.success(result.message);
        $scope.sendQueryErrors = null;
        $scope.query = {};
        $scope.forms.sendQueryForm.$setPristine();
        $scope.forms.sendQueryForm.$setUntouched();
      }
      else if(result.status == 0){
        $scope.sendQueryErrors = result.message;
      }
    },function(error){
      toastr.error("somthing went wrong please try agin later");
    });
  }
  // ContactService.getfeedBackData(JSON.parse(localStorage.loggedInUser).id).then(function (response) {
  //   $scope.feedBackData = response;
  // });
  $scope.subscriberData = {};
  $scope.subscribeErrors = {}
  $scope.subscribe = function () {
    ContactService.subscribe($scope.subscriberData).then(function (result) {
      if(result.status == 1){
        toastr.success(result.message);
        $scope.subscriberData = {};
        $scope.forms.sendSubscriberForm.$setPristine();
        $scope.forms.sendSubscriberForm.$setUntouched();
      }
      else  if(result.status == 0){
        $scope.subscribeErrors = result.message;
      }
    });
  };

  $scope.showContact = function () {
    $mdDialog.show({
      templateUrl: 'views/show-contact.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
  };
    
  $scope.callbackRequest = {};
  $scope.requestCallBack = function () {
    ContactService.requestCallBack($scope.callbackRequest).then(function (result) {
      if(result.status == 1){
        toastr.success(result.message);
        $scope.callbackRequest.phoneNo = null;
        $mdDialog.hide();
        $scope.callbackRequest = {};
        $scope.forms.callbackRequest.$setPristine();
        $scope.forms.callbackRequest.$setUntouched();
      }
      else{
        toastr.error(result.message);
      }
    });
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

    /*=================================
    |  Sidenav Functionality
    =================================*/

    // shortlist
    $scope.closeSideViewAll = function () {
      $mdSidenav('viewAll').toggle();
    };

    $scope.existingCampaignSidenavVisible = false;
    //saved campaign
    $scope.toggleExistingCampaignSidenav = function () {
      // save to existing campaign
      $scope.existingCampaignSidenavVisible = !$scope.existingCampaignSidenavVisible;
    };

    // saved view all side nav
    $scope.toggleViewAllShortlisted = function () {
      $scope.alreadyShortlisted = true;
      $mdSidenav('shortlistAndSaveSidenav').toggle();
    };
    $scope.toggleShareShortlistedSidenav = function () {
      $mdSidenav('shortlistSharingSidenav').toggle();
    };

    // edit list saved campgin
    $scope.closeSideEditList = function () {
      $mdSidenav('savedEdit').toggle();
    };

    // saved campgin
    $scope.closeSideSavedCampaign = function () {
      $mdSidenav('savedSavedCampaign').toggle();
    };

    // Save Campgin Details
    $scope.campaignSavedSuccessfully = false;
    $scope.toggleSaveCampaignSidenav = function () {
      $mdSidenav('saveCampaignSidenav').toggle();
      $scope.campaignSavedSuccessfully = false;
    };

    // Thanks Message
    $scope.closeSideThanksSidenav = function () {
      $mdSidenav('thanksCampaign').toggle();
    };
    // Product Details
    $scope.toggleProductDetailSidenav = function () {
      $mdSidenav('productDetails').toggle();
    };
    // Share Message
    $scope.toggleShareCampaignSidenav = function (campaign) {
      $scope.campaignToShare = campaign;
      $mdSidenav('shareCampaign').toggle();
    };
    // Suggest Me dialog 
    $scope.toggleSuggestMeSidenav = function() {
      $mdSidenav('suggestMe').toggle();
    };
    // Save Campgin Name
    $scope.toggleEmptyCampaignSidenav = function () {
      $mdSidenav('emptyCampaignSidenav').toggle();
    };
    // View All Campaign List
    $scope.toggleCampaignDetailSidenav = function () {
      $mdSidenav('campaignDetailSidenav').toggle();
    };
    // Create Campaign sidenav
    $scope.toggleCreateEmptyCampaignSidenav = function () {
      $scope.campaignSaved = false;
      $mdSidenav('createEmptyCampaignSidenav').toggle();
    };

    $scope.campaignSaved = false;
    $scope.createNewCampaign = function () {
      // submit form data to api and on success show message
      // CampaignService.saveCampaign(data).then(function(res){
      $scope.campaignSaved = true;
      // });
    }

    /*=================================
    |  Sidenav Functionality Ends
    =================================*/

    /*=================================
    | Area autocomplete
    ==================================*/

    $scope.autoCompleteArea = function(query) {
      return LocationService.getAreasWithAutocomplete(query);
    }

    $scope.selectedAreaChanged = function(area){
      localStorage.areaFromHome = JSON.stringify(area);
    }


    /*===============================================
    | Custom Filters associated with Angualr's filter
    ===============================================*/
    // $scope.formatDate = function(format){
    //   return function(date){
    //     console.log(date);
    //     console.log(moment(date).format(format));
    //   }
    // }

    $rootScope.serverUrl = config.serverUrl;

    $scope.close = function(){
      $mdDialog.hide();
    }
    
    /*================================
    === Long polling notifications ===
    ================================*/
    $scope.notifs = [];
    var getUserNotifs = function(){
      var last_notif = 0;
      if($scope.notifs && $scope.notifs.length > 0){
        last_notif = moment.utc($scope.notifs[0].updated_at).valueOf();
      }
      NotificationService.getAllNotifications(last_notif).then(function(result){
        $scope.notifs = result.concat($scope.notifs);
        $timeout(getUserNotifs, 1000);
      });
    }
    if($rootScope.isAuthenticated){
      getUserNotifs();
    }

    /*===============================
    |   Notification navigation 
    ===============================*/
    $scope.viewNotification = function(notification){
      if(notification.type > 100 && notification.type < 200){
        $location.path('metro-campaign/' + notification.data.campaign_id);  
      }
      else{
        $location.path('view-campaign/' + notification.data.campaign_id);
      }
      NotificationService.updateNotifRead(notification.id).then(function(result){
        if(result.status == 1){
          $scope.notifs = _.filter($scope.notifs, function(notif){ return notif.id != notification.id; })
        }
        else{
          toastr.error(result.message);
        }
      });
      $mdSidenav('right').toggle();
    }

    /*===============================
    |   Switching between views
    ===============================*/
    $scope.switchView = function(){
      var userMongo = $auth.getPayload().userMongo;
      if(userMongo.user_type == "bbi"){
        $location.path("/admin");
      }
      else if(userMongo.user_type == "owner"){
        $location.path("/owner/" + userMongo.client_slug + "/feeds");
      }
    }

    $scope.isUserBasic = function(){
      if($auth.getPayload()){
        var userMongo = $auth.getPayload().userMongo;
        return userMongo.user_type == "basic";
      }
      else{
        return false;
      }
    }
    
    $scope.viewCampaignDetails = function(campaignId){
      localStorage.viewCampaignDetailsId = campaignId;
    }
//saved campaigns 

$scope.activeUserCampaigns = [];
      $scope.loadActiveUserCampaigns = function () {
        CampaignService.getActiveUserCampaigns().then(function (result) {
          $scope.activeUserCampaigns = result;
        });
      }
      if($rootScope.currStateName ==  'index' || 'index.location'){
        // $scope.shortListedProductsLength = localStorage.shortListedProducts
        $scope.loadActiveUserCampaigns();
      }

      $rootScope.$on("listeningActiveUserCampaigns",function(){
        $scope.activeUserCampaigns = [];
        $scope.loadActiveUserCampaigns();
      })

      $rootScope.$on("shortListedProducts",function(event,data){
        console.log(data)
        $scope.shortListedProductsLength = data
      })
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

    // Setting up selected format for format page
    $scope.setSelectedFormat = function(index){
      $rootScope.formatSelected = index;
    }
  }
);
