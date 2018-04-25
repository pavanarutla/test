app.controller('OwnerMngrCtrl', function ($scope,$mdSidenav,$log,$mdDialog, $state, $auth,toastr,$rootScope,uploadService,$location,config) {
  // $scope.toggleLeft = buildToggler('left');
  
  // function buildToggler(navID) {
  //   return function() {
  //     // Component lookup should always be available since we are not using `ng-if`
  //     $mdSidenav(navID)
  //       .toggle()
  //       .then(function () {
  //         $log.debug("toggle " + navID + " is done");
  //       });
  //   };
  // }

  $scope.serverUrl = config.serverUrl;
  // Dummy chart data
  
  var chart1 = {};
  chart1.type = "google.charts.Bar";
  chart1.displayed = false;
  chart1.data = {
    "cols": [{
      id: "month",
      label: "Month",
      type: "string"
    }, {
      id: "Available-id",
      label: "Available",
      type: "number"
    }, {
      id: "Booked-id",
      label: "Booked",
      type: "number"
    }, {
      id: "Total-id",
      label: "Total",
      type: "number"
    }],
    "rows": [
      {
        c: [
          {
            v: "January"
          }, {
            v: 19,
            f: "19 hoardings"
          }, {
            v: 12,
            f: "12 hoardings"
          }, {
            v: 31,
            f: "31 hoardings"
          }
        ]
      }, 
      {
        c: [
          {
            v: "February"
          }, {
            v: 13,
            f: "13 hoardings"
          }, {
            v: 19,
            f: "19 hoardings"
          }, {
            v: 32,
            f: "32 hoardings"
          }
        ]
      }, 
      {
        c: [
          {
            v: "March"
          }, {
            v: 24,
            f: "24 hoardings"
          }, {
            v: 5,
            f: "5 hoardings"
          }, {
            v: 29,
            f: "29 hoardings"
          }
        ]
      }, 
      {
        c: [
          {
            v: "April"
          }, {
            v: 13,
            f: "13 hoardings"
          }, {
            v: 19,
            f: "19 hoardings"
          }, {
            v: 32,
            f: "32 hoardings"
          }
        ]
      }
    ]
  };

  chart1.options = {
    "title": "Sales per month",
    "isStacked": "true",
    "fill": 20,
    "displayExactValues": true,
    "vAxis": {
      "title": "Sales unit",
      "gridlines": {
        "count": 10
      }
    },
    "hAxis": {
      "title": "Date"
    }
  };
  $scope.myChart = chart1;
  // Dummy chart data ends


  $scope.ownerSidenav = function () {
    $mdSidenav('ownerLeft').toggle();
  };

  $scope.ownerRightSidenav = function () {
    $mdSidenav('ownerRight').toggle();
  };
  $scope.editProfieSidenav = function () {
    $mdSidenav('ownereditProfile').toggle();
  };
  $scope.openHelpScreen = function(ev) {
    $mdDialog.show({
      templateUrl:'views/owner/helpnsupport.html',
      clickOutsideToClose:true,
    });
  };
//console.log(config.serverUrl);
  /********************* user data*************************/
  if(localStorage.OwnerloggedInUser){
    $rootScope.owner_detail = JSON.parse(localStorage.OwnerloggedInUser);
    console.log(localStorage.OwnerloggedInUser);
  }

  $scope.logout = function(){
    $auth.logout().then(function(result){
      $rootScope.isOwnerAuthenticated = false;
      $location.path('/owner/signIn');
      localStorage.clear();
      toastr.warning('You have successfully signed out!');        
    });
  }

  $scope.resetvalues = function(){
    $scope.owner_detail = JSON.parse(localStorage.OwnerloggedInUser);
    $scope.filepreview = undefined;
  }

  $scope.updateOwnerData = function(userDetails){
    userDetails.profile_pic = $scope.file;
     uploadService.updateUserData(userDetails).then(function(res){  
      console.log(res);
      if(res.status == 200){
         localStorage.OwnerloggedInUser = JSON.stringify(res.data.data);
         $rootScope.owner_detail = res.data.data;
         toastr.success('Data updated.');
      }else{
        toastr.success('Something went worng');
      }
       
      });

  }
  

}).value('googleChartApiConfig', {
  version: '1.1',
  optionalSettings: {
    packages: ['bar'],
    language: 'en'
  }
    
});