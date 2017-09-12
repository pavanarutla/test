app.controller('adminMainCtrl', 
  ['$scope', function($scope) {
  
     $scope.firstname = "Feeds";
    $scope.changeName = function() {
        $scope.firstname = "Feeds";
    };
    $scope.changeProfile = function() {
        $scope.firstname = "Campaigns";
    };
    $scope.changeCampains = function() {
        $scope.firstname = " Location";
    };
     $scope.changeRequest = function() {
        $scope.firstname = "Billboards";
    };
    $scope.changeHoardingList = function() {
        $scope.firstname = "Registration";
    };
    $scope.changeTeam = function() {
        $scope.firstname = "Payement";
    };
    $scope.changeAgent = function() {
        $scope.firstname = "User Management";
    };
    $scope.companies = function() {
        $scope.firstname = "Companies";
    };
    $scope.callCenterInfo = function() {
        $scope.firstname = "Call Centre info";
    };
    $scope.offers = function() {
        $scope.firstname = "Offers";
    };

    $scope.floorDetails = {
    roomDetails: [
      {
        bedIds: []
      },
      {
        bedIds: []
      },
      {
        bedIds: []
      },
       {
        bedIds: []
      },

    ]
  };

  }  
  ]);