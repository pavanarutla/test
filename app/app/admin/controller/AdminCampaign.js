      //campagin js
      app.controller('dataTable', function($scope,$mdDialog,$http) {
        $http.get('data.json').success(function(response){
        $scope.myData = response;
      });

      $scope.limit= 3;
      $scope.loadMore = function() {
        $scope.limit = $scope.items.length;
      };

    //   $scope.openOffscreen = function(ev) {
    //     $mdDialog.show({
    //       templateUrl:'partials/addcampaign.html',
    //       clickOutsideToClose:true,
    //       fullscreen:$scope.customFullscreen,
    //     });
    //   };

    //   $scope.campaignDelete = function(ev) {
    //     $mdDialog.show({
    //       templateUrl:'partials/campaigndelete.html',
    //       clickOutsideToClose:true,
    //       customFullscreen:$scope.customFullscreen,
    //     });
    //   };
     
    });
