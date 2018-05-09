app.controller('UserProfileCtrl', function($scope, $stateParams, $window, UserService, Upload, config) {
  
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

  $scope.uploadProfilePic = function () {
    Upload.upload({
      url: config.apiPath + '/update-profile-pic',
      data: { profile_pic: $scope.files.image}
    }).then(function (result) {
      if(result.data.status == "1"){
        $window.location.reload();   
      }
    }, function (resp) {
      // console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    });
  };

});