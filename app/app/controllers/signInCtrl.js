'user strict'
app.controller("signInCtrl", function($scope, $mdDialog, $location, $rootScope, $auth){

$scope.signInpageshow = true;
$scope.forgotPasswordpage = false;

$scope.signInUser = function(){
    // console.log($scope.user);
    $auth.login($scope.user).then(function() {
        console.log('You have successfully signed in!');
        // $location.path('/');
    }).catch(function(error) {
        toastr.error(error.data.message, error.status);
    });
}

///Agency Sign In functionolity

$scope.signInAgency = function(agency){

$scope.data = agency;
if(agency.email =="naresh@gmail.com" && agency.password =="naresh123"){
   alert("login successfull")
}else{
    alert("wrong credentials");
}
}


/// Register Dailog start here

$scope.showRegisterDialog = function (ev) {    
    $mdDialog.show({
      templateUrl: 'views/register.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  $scope.showForgotPasswordDialog = function () {
      $scope.signInpageshow  = false;
      $scope.forgotPasswordpage = true;
  } 

})
