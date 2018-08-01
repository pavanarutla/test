app.controller('MetroCtrl',
  ['$scope', '$mdSidenav', '$mdDialog', '$rootScope', '$stateParams', '$timeout', 'CampaignService', 'MetroService', 'FileSaver', 'Blob', 'config', 'toastr',
    function ($scope, $mdSidenav, $mdDialog, $rootScope, $stateParams, $timeout, CampaignService, MetroService, FileSaver, Blob, config, toastr) {
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

      $scope.saveMetroCampaign = function (campaign) {
        if ($scope.shortlistedPackages.length > 0) {
          campaign.packages = [];
          _.each($scope.shortlistedPackages, function (v, i) {
            campaign.packages.push(v.package_id);
          });
          MetroService.saveMetroCampaign(campaign).then(function (response) {
            if(response.status == 1){
              $scope.campaignSavedSuccessfully = true;
              $timeout(function () {
                $mdSidenav('saveCampaignSidenav').close();
                $mdSidenav('shortlistAndSaveSidenav').close();
                campaign = {};
                $scope.forms.viewAndSaveCampaignForm.$setPristine();
                $scope.forms.viewAndSaveCampaignForm.$setUntouched();
                $scope.campaignSavedSuccessfully = false;
              }, 3000);
              getMetroCampaigns();
              loadShortlistedPackages();
            }
            else{
              $scope.saveUserCampaignErrors = response.message;
            }
          });
        }
        else {
          toastr.error("Please shortlist some packages first.");
        }
      }

      function getMetroCampaigns(){
        MetroService.getMetroCampaigns().then((result) => {
          $scope.metroCampaigns = result;
        });
      }

      $scope.checkoutMetroCampaign = function(ev, metroCampaignId){
        MetroService.checkoutMetroCampaign(metroCampaignId).then((result) => {
          if(result.status == 1){
            getMetroCampDetails(metroCampaignId);
            getMetroCampaigns();
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title(result.message)
                // .textContent('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
            );
          }
          else{
            toastr.error(result.message);
          }
        });
      }

      function getMetroCampDetails(mCampId){
        MetroService.getMetroCampDetails(mCampId).then((result) => {
          $scope.metroCampDetails = result;
        });
      }
      /*===============================
      | Campaign Management ends
      ===============================*/

      /*================================
      | Page based initial loads
      ================================*/
      if($rootScope.currStateName == 'index.metro'){
        getMetroCorridors();
        getMetroCampaigns();
      }
      if($rootScope.currStateName == 'index.metro-campaign'){
        if(typeof $stateParams.metroCampaignId !== undefined){
          getMetroCampDetails($stateParams.metroCampaignId);
        }
      }
      /*================================
      | Page based initial loads end
      ================================*/
    }
  ]
);