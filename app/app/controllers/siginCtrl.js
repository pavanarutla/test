'user strict'
app.controller("loginCtrl", function($scope,$mdDialog,$location,$rootScope){

$scope.signInpageshow = true;
$scope.forgotPasswordpage = false;

$scope.sigInUser = function(user){
    var username = user.username;
    var password = user.password;
    if(user.username == "naresh@gmail.com" && user.password == "naresh123"){
        $rootScope.logiIn = true;
        //localStorage.setItem('login', $scope.Save); 
        // var token = "xxx";
        // localStorage.setItem("token", token);
        //localStorage.getItem("token"); //returns "xxx"

        localStorage.setItem('logindata', $rootScope.logiIn);
         $rootScope.$broadcast('loginDone');
        $location.path('/location');
        $mdDialog.cancel();        
    }else{
        alert("wrong credentials");
    }
}

///Agency Sig In functionolity 

$scope.sigInAgency = function(agency){

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
