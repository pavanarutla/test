app.controller('FormatsCtrl', function ($scope) {

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
});
