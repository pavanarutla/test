app.controller('formatsCtrl', function ($scope) {

  $scope.showBillboardsData = true;
  $scope.showUnipoleData = false;
  $scope.showdigitalData = false;

  $scope.showBillboards = function(){
    $scope.showBillboardsData = true;
    $scope.showUnipoleData = false;
  }

  $scope.unipole = function() {
    $scope.showUnipoleData = true;
    $scope.showBillboardsData = false;
  }
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
 //$scope.unipole = true;
  
});
