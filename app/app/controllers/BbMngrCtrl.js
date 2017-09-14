<<<<<<< HEAD
app.controller('bbMngrCtrl',['$scope','$mdDialog','$mdSidenav','$timeout','ContactService','$location','$rootScope', 
function ($scope, $mdDialog, $mdSidenav, $timeout,ContactService,$location, $rootScope) {
=======
app.controller('bbMngrCtrl', function ($scope, $mdDialog, $mdSidenav, $timeout, $location, $rootScope, $auth, toastr) {
>>>>>>> ea7aad4cf333447079dbe159a4b1fb444f37c2fa

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
      templateUrl: 'views/sigIn.html',
      fullscreen: $scope.customFullscreen
    })
  };
  $scope.showVideo = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/video.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
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
<<<<<<< HEAD
  $scope.feed={};
$scope.sendfeedback = function (feed) {
   ContactService.feedBackData($scope.feed).then(function(response){
          alert(response.message);
        });
  $scope.feed="";
      };
  $scope.showContact = function(ev) {
    
=======

  $scope.showContact = function (ev) {
>>>>>>> ea7aad4cf333447079dbe159a4b1fb444f37c2fa
    var confirm = $mdDialog.prompt()
      .title('Drop Your Contact Number')
      .placeholder('Enter Your Contact Number')
      .ariaLabel('Dog name')
      .targetEvent(ev)
      .ok('Submit')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(result) {
    ContactService.contactNumber(result).then(function(response){
          alert(response.message);
        });
      
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
  };
<<<<<<< HEAD
  
}]);
=======

  $scope.logout = function(){
    $auth.logout().then(function(){
      $rootScope.isAuthenticated = false;
      $location.path('/');
      localStorage.clear();
      toastr.warning('You have successfully signed out!');
    });
  }

});
>>>>>>> ea7aad4cf333447079dbe159a4b1fb444f37c2fa
