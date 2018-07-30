app.controller('MetroCtrl',
  ['$scope', '$mdSidenav', '$mdDialog', '$rootScope', 'CampaignService', 'MetroService', 'FileSaver', 'Blob', 'config', 'toastr',
    function ($scope, $mdSidenav, $mdDialog, $rootScope, CampaignService, MetroService, FileSaver, Blob, config, toastr) {
      $scope.metroCampaign = {};
      /*==============================
      | Popup and Sidenav controls
      ==============================*/  
      $scope.showPackagePopup = function (ev) {
        if(typeof $scope.metroCampaign.selectedCorridor != "undefined"){
          $mdDialog.show({
            templateUrl: 'views/metro-packages-popup.html',
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose: true,
            preserveScope : true,
            scope: $scope
          });
          $scope.getMetroPackages($scope.metroCampaign.selectedCorridor.id);
        }
        else{
          alert("Please select a corridor first.");
        }
      };
      /*================================
      | Popup and Sidenav controls end
      ================================*/

      /*===============================
      | Campaign Management
      ===============================*/
      function getMetroCorridors(){
        MetroService.getMetroCorridors().then(function(result){          
          $scope.metroCorridors = result;
        });
      }
      $scope.getMetroPackages = function(corridorId){
        MetroService.getMetroPackages(corridorId).then(function(result){
          _.map(result, (res) => {
            res.selected_trains = 1;
            res.selected_slots = 1;
            return res;
          });
          $scope.metroPackages = result;
        });
      }
      
      $scope.shortlistMetroPackage = function(pkg){
        console.log(pkg);
        // var alreadySelected = _.filter($scope.shortlistedPackages, function(package){
        //   return package.corridor_id == pkg.corridor_id;
        // });
        // if(alreadySelected.constructor === Array && alreadySelected.length > 0){
        //   alert("You can only add one package per corridor.");
        // }
        // else{
        //   if(typeof pkg.start_date === 'undefined'){
        //     alert("Start date for the package is required.");
        //   }
        //   else{
        //     MetroService.shortlistPackage(pkg).then((result) => {
        //       if(result.status == 1){
        //         loadShortlistedPackages();
        //         toastr.success(result.message);
        //       }
        //       else{
        //         toastr.error(result.message);
        //       }
        //     });
        //   }
        // }
      }
      /*===============================
      | Campaign Management ends
      ===============================*/

      /*================================
      | Page based initial loads
      ================================*/
      if($rootScope.currStateName == 'index.L&T'){
        getMetroCorridors();
        // getMetroPackages();
      }
      /*================================
      | Page based initial loads end
      ================================*/
    }
  ]
);