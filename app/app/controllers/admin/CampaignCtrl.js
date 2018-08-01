app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, $mdSidenav, $stateParams, $location, $rootScope, CampaignService, AdminCampaignService, AdminMetroService, ProductService, Upload, toastr,  FileSaver, Blob) {

  $scope.CAMPAIGN_STATUS = [
    'campaign-preparing',    //    0
    'campaign-created',      //    1
    'quote-requested',       //    2
    'quote-given',           //    3
    'change-requested',      //    4 
    'launch-requested',      //    5
    'running',               //    6
    'suspended',             //    7
    'stopped'                //    8
  ];

  /*===================================
  | Popups and Sidenavs
  ===================================*/
  $scope.AddMetroCampaign = function () {
    $mdSidenav('metroAddCmapginSidenav').toggle();
  };
  $scope.toggleAddMetroProductSidenav = function () {
    $mdSidenav('add-metro-product-sidenav').toggle();
  };
  $scope.showConfirmMetroPaymentPopup = function(){

  }
  /*===================================
  | Popups and Sidenavs end
  ===================================*/

  var getAllCampaigns = function(){
    AdminCampaignService.getAllCampaigns().then(function(result){
      $scope.plannedCampaigns = _.filter(result.user_campaigns, function(c){
        return c.status < 6 && typeof c.name !== "undefined" && typeof c.start_date !== "undefined" && typeof c.end_date !== "undefined";
      });
      $scope.runningCampaigns = _.where(result.user_campaigns, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'running') });
      $scope.closedCampaigns = _.where(result.user_campaigns, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'stopped') });
      $scope.adminCampaigns = result.admin_campaigns;
    });
  }
  getAllCampaigns();

  /*=====================
  | Filtering Campaigns
  =====================*/
  // $scope.simulateQuery = false;
  $scope.isDisabled    = false;
  // $scope.querySearch   = querySearch;
  // $scope.selectedItemChange = selectedItemChange;
  // $scope.searchTextChange   = searchTextChange;


  $scope.campaignSearch = function(query) {
    return AdminCampaignService.searchCampaigns(query.toLowerCase()).then(function(res){
      return res;
    });
  }

  $scope.viewSelectedCampaign = function(campaign) {
    $location.path('/admin/campaign-proposal-summary/' + campaign.id);
  }

  function selectedItemChange(item) {
    //console.log('Item changed to ' + JSON.stringify(item));
  }

  /*=========================
  | Filtering Campaigns Ends
  =========================*/

  $scope.showAddCampaignPopup = function () {
    $mdDialog.show({
      templateUrl: 'views/admin/add-full-campaign.html',
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen,
      controller: function($scope, $mdDialog, AdminCampaignService, toastr){
        $scope.campaign = {};
        var startDate = new Date();
        var productFromDate = new Date($scope.campaign.start_date);
        var productToDate = new Date($scope.campaign.end_date);
        $scope.fromMinDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 5
        );
        $scope.toMinDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          productFromDate.getDate() + 1
        );
        $scope.toMaxDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          productToDate.getDate()
        );
        $scope.saveCampaignByAdmin = function(){
          AdminCampaignService.saveCampaignByAdmin($scope.campaign).then(function(result){
            if(result.status == 1){
              getAllCampaigns();
              toastr.success(result.message);
              $mdDialog.hide();
            }
            else if(result.status == 0){
              $scope.campaignDetailsErrorEessages = result.message;
            }
          },function(result){
              $scope.campaignDetailsErrorEessages = "somthing went wrong please try again after some time!"
          });
        }
        $scope.close = function(){
          $mdDialog.hide();
        }
      }
    });
  };

  $scope.deleteUserCampaign = function(campaignId){
    AdminCampaignService.deleteUserCampaign(campaignId).then(function(result){
      if(result.status == 1){
        getAllCampaigns();
        toastr.success(result.message);
        $mdDialog.hide();
      }
      else if(result.status == 0){
        toastr.error(result.message);
      }
    },function(result){
        toastr.error("somthing went wrong please try again after some time!");
    });
  }

  $scope.deleteNonUserCampaign = function(campaignId){
    AdminCampaignService.deleteNonUserCampaign(campaignId).then(function(result){
      if(result.status == 1){
        getAllCampaigns();
        toastr.success(result.message);
        $mdDialog.hide();
      }
      else if(result.status == 0){
        toastr.error(result.message);
      }
    },function(result){
        toastr.error("somthing went wrong please try again after some time!");
    });
  }
  /*
  *========= campaign proposal(planned) grid =========
  */
  
  /*
  //////// Floating campaign section
  */

  $scope.formRows = [{formId: '1', name: 'floatginCampaignForm1'}];
  $scope.addNewFormRow = function() {
    var newItemNo = $scope.formRows.length + 2;
    $scope.formRows.push({'formId' : newItemNo, 'name' : 'floatingCampaignForm' + newItemNo});
  };

  $scope.generateFloatingCampaignPdf = function(){
    Upload.upload({
      url: config.apiPath + '/floating-campaign-pdf',
      data: { product_arr: $scope.formRows },
      responseType: "arraybuffer"
    }).then(function (result) {
      if(result.data){
        var campaignPdf = new Blob([result.data], { type: 'application/pdf;charset=utf-8' });
        FileSaver.saveAs(campaignPdf, 'Campaigns Proposal.pdf');
      }
      else{
        toastr.error(result.message);
      }
    }, function (resp) {
      // console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  } 

  /*
  //////// Floating campaign section ends
  */

  /*====================================
  | Metro Campaigns
  ====================================*/
  var getFormatList = function(obj){
    ProductService.getFormatList(obj).then(function(result){
      $scope.formatList = result;
    });
  }
  function getMetroCorridors(){
    AdminMetroService.getMetroCorridors().then(function(result){
      $scope.metroCorridorList = result;
    });
  }
  $scope.selectPackage = function(pkg){
    console.log(pkg);
    $scope.selectedPackage = pkg;
  }
  $scope.getMetroPackages = function(corridorId){
    console.log(corridorId);
    AdminMetroService.getMetroPackages(corridorId).then(function(result){
      _.map(result, (res) => {
        res.selected_trains = 1;
        res.selected_slots = 1;
        return res;
      });
      $scope.metroPackages = result;
    });
  }
  function getMetroCampaigns(){
    AdminMetroService.getMetroCampaigns().then((result) => {
      // console.log(result);
      $scope.userMetroCampaigns = _.filter(result, (campaign) => {
        return campaign.type == 0;
      });
      $scope.adminMetroCampaigns = _.filter(result, (campaign) => {
        return campaign.type == 1;
      });
    });
  }
  function getMetroCampaignDetails(metroCampaignId){
    AdminMetroService.getMetroCampaignDetails(metroCampaignId).then((result) => {
      // console.log(result);
      $scope.metroCampaignDetails = result;
    });
  }
  /*====================================
  | Metro Campaigns end
  ====================================*/

  $scope.cancel = function(){
    $mdDialog.hide();
  };
  
  /*=========================
  | Page based initial loads
  =========================*/
  if($rootScope.currStateName == "admin.campaign-proposal-summary"){
    if($stateParams.campaignId){
      var campaignId = $stateParams.campaignId;
      CampaignService.getCampaignWithProducts(campaignId).then(function(result){
        
      });
    }
  }
  if($rootScope.currStateName == "admin.metro-campaigns"){
    getMetroCampaigns();
  }
  if($rootScope.currStateName == "admin.metro-campaign"){
    if($stateParams.metroCampaignId){
      getMetroCampaignDetails($stateParams.metroCampaignId);
    }
    getMetroCorridors();
    getFormatList({type: "metro"});
  }
  /*=============================
  | Page based initial loads end
  =============================*/

});
