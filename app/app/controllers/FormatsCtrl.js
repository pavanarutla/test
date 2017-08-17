app.controller('formatsCtrl', function ($scope) {

  $scope.showBillboardsData = true;
  $scope.showUnipoleData = false;
  $scope.showdigitalData = false;
  $scope.showretailData = false;
  $scope.showtransitData = false;
  $scope.showairportData = false;
  $scope.showbusData = false;
  $scope.showrailData = false; 


  $scope.showBillboards = function(){
    $scope.showBillboardsData = true;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }

  $scope.unipole = function() {   
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = true;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }

  $scope.showdigital = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = true;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }
  $scope.showretail = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = true;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }

  $scope.showtransit = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = true;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }

  $scope.showairport = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = true;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }
  $scope.showbus = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = true;
    $scope.showrailData = false;
  }

  $scope.showrail = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = true;
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
