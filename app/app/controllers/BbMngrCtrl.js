app.controller('bbMngrCtrl', function ($scope, $mdDialog, $mdSidenav, $timeout) {

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
    window.scroll(0,600)
  }
  $scope.contactus = function(){
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
  
});