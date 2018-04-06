app.controller('requestHoarding', function ($scope,$mdDialog,$mdSidenav,$window) {
    
    $scope.openScreen = function(ev) {
        $mdDialog.show({
          templateUrl:'views/owner/requesthoardingadd.html',
          clickOutsideToClose:true,
   
        });
    };

    $scope.viewImage = function () { 
        $mdDialog.show({
        templateUrl: 'views/owner/viewimage.html',
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true
        })
    };
    // sidenav 
     $scope.addRequestHoarding = function () {
    $mdSidenav('ownerAddHoarding').toggle();
    };

    $scope.hoardinglist =[
      {
        "id":"AD_001",
        "type":"Billboard",
        "area":"Amreepet",
        "size":"20*30",
        "light":"No",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      },
      {
        "id":"AD_002",
        "type":"Unipole",
        "area":"Amreepet",
        "size":"20*30",
        "light":"Yes",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      },
      {
        "id":"AD_003",
        "type":"Digital",
        "area":"Amreepet",
        "size":"20*30",
        "light":"Yes",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      }
    ]
   

});