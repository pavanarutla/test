/** * You must include the dependency on 'ngMaterial' */

    var app = angular.module('bbManager', ['ngMaterial','ngRoute','ngMessages','slickCarousel']);
    
    app.config(function($mdThemingProvider,$routeProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('red',{
          'default':'800',
          'hue-1': '500', 
          'hue-2': '700', 
        })
        .accentPalette('orange',{
          'default': '800',
          'hue-1':'600',
          'hue-2':'400',
        });
            
        $routeProvider.when('/', {
        templateUrl: 'partials/home.html'
        }).when('/home',{
        templateUrl: 'partials/home.html' 
        }).when('/formats', {
        templateUrl: 'partials/formats.html'
        }).when('/pricing', {
        templateUrl: 'partials/pricing.html'
        });
        
    });
    app.config(['slickCarouselConfig', function (slickCarouselConfig) {
        // slickCarouselConfig.dots = true;
        // slickCarouselConfig.autoplay = true;
        // slickCarouselConfig.adaptiveHeight = false;
    }]);
    app.controller('bbMgrAppCtrl', function($scope,$mdDialog,$mdSidenav, $timeout) {

      $scope.closeSidenav = function() {
         $mdSidenav('left').toggle();
      };

      $scope.showTabDialog = function(ev) {
        $mdDialog.show({
         
          templateUrl: 'partials/tabDialog.tmpl.html',
          fullscreen: $scope.customFullscreen ,
          clickOutsideToClose:true
        })
      };

      $scope.cancel = function() {
       $mdDialog.cancel();
      };

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
app.controller('pricingCtrl', function($scope) {

});
app.controller('formatsCtrl', function($scope) {

  //slider
    $scope.slickConfig2Loaded = true;
    

    $scope.slickConfig2 = {
      autoplay: false,
      infinite: true,
      autoplaySpeed: 5000,
      slidesToShow: 2,
      slidesToScroll: 1,
  responsive: [{

      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
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

