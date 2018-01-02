app.controller('requestHoarding', function ($scope,$mdDialog, $window) {
    
    $scope.openScreen = function(ev) {
        $mdDialog.show({
          templateUrl:'views/owner/requesthoardingadd.html',
          clickOutsideToClose:true,
   
        });
    };
    $scope.floorDetails = {
        roomDetails: [
        {
            bedIds: [1,2,3,4]
        },
        {
            bedIds: [5,6,7,8]
        },
        {
            bedIds: [9]
        },
        {
            bedIds: [9]
        },

        ]
    };

});