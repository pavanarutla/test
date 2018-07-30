app.controller('MetroCtrl',
  ['$scope', '$mdSidenav', '$mdDialog', '$rootScope', 'CampaignService', 'MetroService', 'FileSaver', 'Blob', 'config', 'toastr',
    function ($scope, $mdSidenav, $mdDialog, $rootScope, CampaignService, MetroService, FileSaver, Blob, config, toastr) {
      $scope.metroCampaign = {};
      /*==============================
      | Popup and Sidenav controls
      ==============================*/  
      $scope.showPackagePopup = function (ev) {
        if(typeof $scope.selectedCorridor != "undefined"){
          $mdDialog.show({
            templateUrl: 'views/metro-packages-popup.html',
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose: true,
            preserveScope : true,
            scope: $scope
          });
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
      function loadShortlistedPackages(){
        MetroService.getShortlistPackages().then((result) => {
          console.log("shortlisted:", result);
          $scope.shortlistedPackages = result;
        });
      }
      loadShortlistedPackages();
      $scope.shortlistMetroPackage = function(pkg){
        var alreadySelected = _.filter($scope.shortlistedPackages, function(package){
          return package.id == pkg.id;
        });
        if(alreadySelected.constructor === Array && alreadySelected.length > 0){
          toastr.error("This package is already added.");
        }
        else{
          if(typeof pkg.start_date === 'undefined'){
            toastr.error("Start date for the package is required.");
          }
          else{
            MetroService.shortlistPackage(pkg).then((result) => {
              if(result.status == 1){
                loadShortlistedPackages();
                toastr.success(result.message);
              }
              else{
                toastr.error(result.message);
              }
            });
          }
        }
      }
      $scope.getEstBudgetForSelectedPackages = function(){
        var estBudget = 0;
        _.each($scope.shortlistedPackages, (package) => {
          estBudget += package.price * (package.selected_trains + package.selected_slots - 1);
        });
        return estBudget;
      }
      $scope.isAlreadySelected = function(pkgId){
        var pkg = _.find($scope.shortlistedPackages, (slPkg) => {
          return slPkg.package_id == pkgId;
        });
        return pkg !== undefined;
      }
      $scope.deleteShortlistedMetroPackage = function(pkgId){
        MetroService.deleteShortlistedMetroPackage(pkgId).then((result) => {
          if(result.status == 1){
            loadShortlistedPackages();
            toastr.success(result.message);
          }
          else{
            toastr.error(result.message);
          }
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