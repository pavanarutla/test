app.controller('bbMngrCtrl', 
  function ($scope, $mdDialog, $mdSidenav, $timeout, $location, $rootScope, MapService, $auth, toastr, ContactService, 
  CampaignService, UserService, LocationService, NotificationService, config, $window, $interval) {

    $scope.forms = {};

    if(localStorage.isAuthenticated && localStorage.loggedInUser){
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
    if ($(window).scrollTop() > 200) {
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
      }
      else{
        toastr.error(result.message);
      }
      $scope.query = {};
      $scope.forms.sendQueryForm.$setPristine();
      $scope.forms.sendQueryForm.$setUntouched();
    });
  }
  // ContactService.getfeedBackData(JSON.parse(localStorage.loggedInUser).id).then(function (response) {
  //   $scope.feedBackData = response;
  // });
  $scope.subscriberData = {};
  $scope.subscribe = function () {
    ContactService.subscribe($scope.subscriberData).then(function (result) {
      if(result.status == 1){
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
    angular.element($('#subscriber-email')).val('');
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
        $mdDialog.hide();
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
      // save to existing campagin
      $scope.existingCampaignSidenavVisible = !$scope.existingCampaignSidenavVisible;
    };

    // saved view all side nav
    $scope.toggleViewAllShortlisted = function () {
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
    var getUserNotifs = function(){
      NotificationService.getAllNotifications().then(function(result){
        $scope.readNotifCount = _.chain(result).filter(function(notif){
          return notif.status == 1;
        }).value().length;
        $scope.unreadNotifCount = _.chain(result).filter(function(notif){
          return notif.status == 0;
        }).value().length;
        $scope.notifs = result;
      });
    }
    if($rootScope.isAuthenticated){
      getUserNotifs();
      $interval(getUserNotifs, 10000);
    }

    /*===============================
    |   Notification navigation 
    ===============================*/
    $scope.showCampaignDetails = function(notificationId){
      NotificationService.updateNotifRead(notificationId).then(function(result){
        if(result.status == 1){
          getUserNotifs();
        }
        else{
          toastr.error(result.message);
        }
      });
      $mdSidenav('right').toggle();
      $location.path('/campaigns');
    }

    // Setting up selected format for format page
    $scope.setSelectedFormat = function(index){
      $rootScope.formatSelected = index;
    }
  }
);
