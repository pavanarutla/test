app.controller('UserProfileCtrl', function($scope, $stateParams, UserService) {
  $scope.getLoggedInUserProfile = function(){
    UserService.getProfile().then(function(result){
      $scope.userProfile = result;
    });
  }
  $scope.getLoggedInUserProfile();

  $scope.hoardingitems=[
    {
      cname:'Flipkart',
      phone:'(+91) 9878564523',
      email:'Lorem.ipsum.com',
      address:'K67/68, Sonal Heavy Indl Est,Lane Extn,Banjara Hills',
    },
    {
    
      cname:'LG',
      phone:'(+91) 9878564523',
      email:'Lorem.ipsum.com',
      address:'K67/68, Sonal Heavy Indl Est,Lane Extn,Banjara Hills',
    },
    {
      cname:'Iphone',
      phone:'(+91) 9878564523',
      email:'Lorem.ipsum.com',
      address:'K67/68, Sonal Heavy Indl Est,Lane Extn,Banjara Hills',
    }
  ];

  $scope.limit= 5;
  $scope.loadMore = function() {
    $scope.limit = $scope.items.length
  };

});