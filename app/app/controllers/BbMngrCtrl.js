app.controller('bbMngrCtrl', function ($scope, $mdDialog, $mdSidenav, $timeout, $location, $rootScope, $auth, toastr, UserService) {

  if(localStorage.isAuthenticated && localStorage.loggedInUser){
    $rootScope.isAuthenticated = localStorage.isAuthenticated || false;
    $rootScope.loggedInUser = JSON.parse(localStorage.loggedInUser);
  }

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

  // side favicon functionality
  this.isOpen = false;
  this.availableModes = ['md-fling', 'md-scale'];
  this.selectedMode = 'md-fling';
  this.selectedDirection = 'up';


  $scope.closeSidenav = function () {
    $mdSidenav('left').toggle();
  };

  $scope.closeSideNavPanel = function () {
    $mdSidenav('right').toggle();
  };

  $scope.showTabDialog = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/signIn.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
    })
  };
  $scope.showVideo = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/video.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
    })
  };
   $scope.shareForm = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/shareform.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
    })
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.whatwedo = function () {
    $location.path('/');
    window.scroll(0, 675);

  }
  $scope.formate = function () {
    $location.path('/');
    window.scroll(0, 1535)
  }
  $scope.whyOutdoor = function () {
    $location.path('/');
    window.scroll(0, 2270)
  }
  $scope.contactus = function () {
    $location.path('/');
    window.scroll(0, 4300)
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


  //scroll header color change 

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 50) {
      $(".header").addClass("active");
    } else {
      //remove the background property so it comes transparent again (defined in your css)
      $(".header").removeClass("active");
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

  // $scope.showContact = function(ev) {
    
  //   var confirm = $mdDialog.prompt()
  //     .title('Drop Your Contact Number')
  //     .placeholder('Enter Your Contact Number')
  //     .ariaLabel('Dog name')
  //     .targetEvent(ev)
  //     .ok('Submit')
  //     .cancel('Cancel');

  //   $mdDialog.show(confirm).then(function(result) {
  //     $scope.status = 'You decided to name your dog ' + result + '.';
  //   }, function() {
  //     $scope.status = 'You didn\'t name your dog.';
  //   });
    
  // };
   $scope.showContact = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/showcontact.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
    })
  };

  $scope.logout = function(){
    $auth.logout().then(function(){
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
  $scope.closeSideViewAll = function() {
    $mdSidenav('viewAll').toggle();
  };

  $scope.hideSelectedMarkerDetail = false;
  //saved campaign
  $scope.addSelectedMarkerToCampaign = function() {
    // shortlist and save to campagin
    $scope.hideSelectedMarkerDetail = true;
    // $mdSidenav('savedCampaign').toggle();
  };

  // saved view all side nav
  $scope.toggleViewAllShortlisted = function() {
      $mdSidenav('shortlistAndSave').toggle();
  };

  // edit list saved campgin
  $scope.closeSideEditList = function() {
      $mdSidenav('savedEdit').toggle();
  };

  // saved campgin
  $scope.closeSideSavedCampaign = function() {
      $mdSidenav('savedSavedCampaign').toggle();
  };

  // Save Campgin Details
  $scope.campaignSavedSuccessfully = false;
  $scope.toggleSaveNewCampaign = function() {
    $mdSidenav('saveNewCampaign').toggle();
    $scope.campaignSavedSuccessfully = false;
  };

  // Thanks Message
  $scope.closeSideThanksSidenav = function() {
    $mdSidenav('thanksCampaign').toggle();
  };
  // Product Details
  $scope.closeProductDetailSidenav = function() {
    $mdSidenav('productDetails').toggle();
  };
  // Share Message
  $scope.shareSidenav = function() {
    $mdSidenav('shareCampaign').toggle();
  };
  // Suggest Me dialog 
  $scope.toggleSuggestMeSidenav = function() {
    $mdSidenav('suggestMe').toggle();
  };
  // Save Campgin Name
  $scope.saveCampaignName = function() {
    $mdSidenav('saveCampaignName').toggle();
  };
  // View All Campaign List
  $scope.viewAllCampaginList = function() {
    $mdSidenav('viewAll').toggle();
  };
  // Create Campaign sidenav
  $scope.toggleCreateCampaignSidenav = function() {
    $scope.campaignSaved = false;
    $mdSidenav('createCampaignSidenav').toggle();
  };

  $scope.campaignSaved = false;
  $scope.createNewCampaign = function(){
    // submit form data to api and on success show message
    // CampaignService.saveCampaign(data).then(function(res){
      $scope.campaignSaved = true;
    // });
  }

  /*=================================
  |  Sidenav Functionality Ends
  =================================*/

  /*===============================================
  | Custom Filters associated with Angualr's filter
  ===============================================*/
  // $scope.formatDate = function(format){
  //   return function(date){
  //     console.log(date);
  //     console.log(moment(date).format(format));
  //   }
  // }

});