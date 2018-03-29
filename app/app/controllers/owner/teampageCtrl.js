app.controller('teamPage',['$scope','$mdDialog','$mdSidenav', function($scope,$mdDialog,$mdSidenav){
  $scope.teammembers =[
    {
      image:'team',
      name:'Shiva Shankar Reddy',
      designation:'Designer',
      phone:'8899667755',
      email:'siva@billboardsindia.com',
    },
    {
      image:'teamfour',
      name:'Srikanth Bijjala',
      designation:'Developer',
      phone:'9966016136',
      email:'srikanth@billboardsindia.com',
    },
    {
      image:'teamfour',
      name:'srikanth',
      designation:'Designer',
      phone:'8899667755',
      email:'teamfour@billboardsindia.com',
    },
    {
      image:'teamfour',
      name:'srikanth',
      designation:'Designer',
      phone:'8899667755',
      email:'teamfour@billboardsindia.com',
    },
  ];
  //add team member sidenav

   $scope.addteamSidenav = function () {
    $mdSidenav('ownerAddteam').toggle();
  };
  $scope.cancel = function () {
    $mdDialog.hide();
  };
  $scope.openAddteam = function(ev) {
    $mdDialog.show({
      templateUrl:'views/owner/teamadd.html',
      clickOutsideToClose:true,
    });
  };
  $scope.ownerTeamprofile = function(ev) {
    $mdDialog.show({
      templateUrl:'views/owner/team-members.html',
      clickOutsideToClose:true,
    });
  };
  $scope.ownerProfilesetting = function(ev) {
    $mdDialog.show({
      templateUrl:'views/owner/owner-teamsettings.html',
      clickOutsideToClose:true,
    });
  };
  $scope.closepopup = function(){
      $mdDialog.hide();
  }
  
}])
