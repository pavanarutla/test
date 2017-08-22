app.controller('bbMngrCtrl', function ($scope, $mdDialog, $mdSidenav, $timeout,$location) {


  $scope.filter = false;
$scope.format = false;
$scope.shortlist = false;
$scope.savedcampaign = false;


$scope.filters = function(){
  $scope.filter = !$scope.filter;
  $scope.format = false;
  $scope.shortlist = false;
  $scope.savedcampaign = false;
}
$scope.formats = function(){
  $scope.filter= false;
  $scope.format= !$scope.format;
  $scope.shortlist = false;
  $scope.savedcampaign = false;  
}

$scope.shortlistDiv = function(){
  $scope.filter = false;
  $scope.format = false;
  $scope.shortlist = !$scope.shortlist;
  $scope.savedcampaign = false; 
}

$scope.savedcampaignDiv = function(){
  $scope.filter = false;
  $scope.format = false;
  $scope.shortlist = false;
  $scope.savedcampaign = !$scope.savedcampaign;
}

  $scope.closeSidenav = function () {
    $mdSidenav('left').toggle();
  };

  $scope.closeSideNavPanel = function() {
     $mdSidenav('right').toggle();
  };

  $scope.showTabDialog = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/tabDialog.tmpl.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
 
  $scope.whatwedo = function(){   
     $location.path('/');     
    window.scroll(0,600);
    
  }
  $scope.formate = function(){
    $location.path('/');
    window.scroll(0,1000)
  }
    $scope.whyOutdoor = function(){
    $location.path('/');
    window.scroll(0,1850)
  }
  $scope.contactus = function(){
     $location.path('/');
    window.scroll(0,4000)
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

  $scope.showContact = function(ev) {
    
    var confirm = $mdDialog.prompt()
      .title('Drop Your Contact Number')
      .placeholder('Enter Your Contact Number')
      .ariaLabel('Dog name')
      .targetEvent(ev)
      .ok('Submit')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(result) {
      $scope.status = 'You decided to name your dog ' + result + '.';
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
    
  };
  
});