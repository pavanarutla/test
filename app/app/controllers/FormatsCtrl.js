app.controller('FormatsCtrl',["$scope","$rootScope", function ($scope,$rootScope) {

  if($rootScope.formatSelected){
    $scope.selectedFormatIndex = $rootScope.formatSelected;
  }
  else{
    $scope.selectedFormatIndex = 0;
  }
  // $scope.showBillboardsData = true;
  // $scope.showUnipoleData = false;
  // $scope.showdigitalData = false;
  // $scope.showretailData = false;
  // $scope.showtransitData = false;
  // $scope.showairportData = false;
  // $scope.showbusData = false;
  // $scope.showrailData = false; 


  // $scope.showBillboards = function(){
  //   $scope.showBillboardsData = true;
  //   $scope.showUnipoleData = false;
  //   $scope.showdigitalData = false;
  //   $scope.showretailData = false;
  //   $scope.showtransitData = false;
  //   $scope.showairportData = false;
  //   $scope.showbusData = false;
  //   $scope.showrailData = false;
  // }

  // $scope.unipole = function() {   
  //   $scope.showBillboardsData = false;
  //   $scope.showUnipoleData = true;
  //   $scope.showdigitalData = false;
  //   $scope.showretailData = false;
  //   $scope.showtransitData = false;
  //   $scope.showairportData = false;
  //   $scope.showbusData = false;
  //   $scope.showrailData = false;
  // }

  // $scope.showdigital = function(){
  //   $scope.showBillboardsData = false;
  //   $scope.showUnipoleData = false;
  //   $scope.showdigitalData = true;
  //   $scope.showretailData = false;
  //   $scope.showtransitData = false;
  //   $scope.showairportData = false;
  //   $scope.showbusData = false;
  //   $scope.showrailData = false;
  // }
  // $scope.showretail = function(){
  //   $scope.showBillboardsData = false;
  //   $scope.showUnipoleData = false;
  //   $scope.showdigitalData = false;
  //   $scope.showretailData = true;
  //   $scope.showtransitData = false;
  //   $scope.showairportData = false;
  //   $scope.showbusData = false;
  //   $scope.showrailData = false;
  // }

  // $scope.showtransit = function(){
  //   $scope.showBillboardsData = false;
  //   $scope.showUnipoleData = false;
  //   $scope.showdigitalData = false;
  //   $scope.showretailData = false;
  //   $scope.showtransitData = true;
  //   $scope.showairportData = false;
  //   $scope.showbusData = false;
  //   $scope.showrailData = false;
  // }

  // $scope.showairport = function(){
  //   $scope.showBillboardsData = false;
  //   $scope.showUnipoleData = false;
  //   $scope.showdigitalData = false;
  //   $scope.showretailData = false;
  //   $scope.showtransitData = false;
  //   $scope.showairportData = true;
  //   $scope.showbusData = false;
  //   $scope.showrailData = false;
  // }
  // $scope.showbus = function(){
  //   $scope.showBillboardsData = false;
  //   $scope.showUnipoleData = false;
  //   $scope.showdigitalData = false;
  //   $scope.showretailData = false;
  //   $scope.showtransitData = false;
  //   $scope.showairportData = false;
  //   $scope.showbusData = true;
  //   $scope.showrailData = false;
  // }

  // $scope.showrail = function(){
  //   $scope.showBillboardsData = false;
  //   $scope.showUnipoleData = false;
  //   $scope.showdigitalData = false;
  //   $scope.showretailData = false;
  //   $scope.showtransitData = false;
  //   $scope.showairportData = false;
  //   $scope.showbusData = false;
  //   $scope.showrailData = true;
  // }
  // $scope.billBoards = function(value){   
  //   $scope.showBillboardsData = true;
  // }
  // $scope.digital = function(value)
  // {
  //   //$scope.digitalData = value;
  //   if(value == 1){
  //     $rootScope.showUnipoleData = true;
  //     $scope.showBillboardsData = false;
  //     $scope.showdigitalData = false;
  //     $scope.showretailData = false;
  //     $scope.showtransitData = false;
  //     $scope.showairportData = false;
  //     $scope.showbusData = false;
  //     $scope.showrailData = false;
  //   }else if(value == 2){
  //       $scope.showBillboardsData = false;
  //       $scope.showdigitalData = false;
  //       $scope.showretailData = false;
  //       $scope.showtransitData = false;
  //       $scope.showairportData = false;
  //       $scope.showbusData = false;
  //       $scope.showrailData = false;
  //   }
  // }
}]);
