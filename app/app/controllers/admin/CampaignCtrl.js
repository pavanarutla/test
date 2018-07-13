app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, $stateParams, $location, $rootScope, CampaignService, AdminCampaignService, Upload, toastr,  FileSaver, Blob) {

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
    
  /*=============================
  | Page based initial loads end
  =============================*/

});
