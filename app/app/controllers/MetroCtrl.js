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
          $scope.metroPackages = result;
        });
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