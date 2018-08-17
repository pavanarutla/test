app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, $mdSidenav, $stateParams, $location, $rootScope, CampaignService, AdminCampaignService, AdminMetroService, ProductService, Upload, toastr,  FileSaver, Blob, MetroService,$window) {
 $scope.newDate = new Date();
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
      console.log("result111");
       console.log(result);
      $scope.metroCampaignDetails = result;
    });
  }
  $scope.addPackageInMetroCampaign = function(){
    $scope.selectedPackage.package_id = $scope.selectedPackage.id;
    $scope.selectedPackage.campaign_id = $scope.metroCampaignDetails.id;
    $scope.selectedPackage.total_price = $scope.selectedPackage.price * ($scope.selectedPackage.selected_trains + $scope.selectedPackage.selected_slots - 1);
    AdminMetroService.addPackageInMetroCampaign($scope.selectedPackage).then((result) => {
      if(result.status == 1){
        $scope.selectedPackage = {};
        getMetroCampaignDetails($scope.metroCampaignDetails.id);
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
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



    $scope.showConfirmMetroPaymentPopup = function(){
    $mdDialog.show({
      templateUrl: 'views/admin/confirm-metro-payment-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      locals:{ campaignId: $stateParams.metroCampaignId, ctrlScope : $scope },
      controller:function($scope, $mdDialog, CampaignService, AdminCampaignService, ctrlScope, campaignId){
        $scope.paymentTypes = [
          {name: "Cash"},
          {name: "Cheque"},
          {name: "Online"},
          {name: "Transfer"}
        ];
        $scope.updateCampaignPayment = function(){
          $scope.campaignPayment.campaign_id = campaignId;
          AdminCampaignService.updateCampaignPayment($scope.campaignPayment).then(function(result){
            if(result.status == 1){
              $scope.campaignPaymentstatus  = {};
                $scope.campaignPaymentstatus.campaign_id = $stateParams.metroCampaignId;
                $scope.campaignPaymentstatus.status = 131;
               AdminCampaignService.updateMetroCampaignStatus($scope.campaignPaymentstatus).then(function(result){
                  // update succeeded. update the grid now.
                  if(result.status == 1){
                    loadCampaignPayments(campaignId);
                    toastr.success(result.message);
                    $rootScope.closeMdDialog();
                  }
              });
            }
            else{
              toastr.error(result.message);
            }
          });
        }
      }
    });
  }


   
   function loadCampaignPayments(campaignId){
    //if($scope.campaignDetails.status >= 6 ){
      AdminCampaignService.getCampaignPaymentDetails(campaignId).then(function(result){
        console.log("paymentTypes");
        console.log(result);
        if(result.status=="1"){
          $scope.campaignMetroPayments = result;
        }else{
         // toastr.error(result.message);
        }
        
      });
   // }
    // else{
    //   toastr.error('Payments are only available for running or stopped campaigns.');
    // }
  }
  loadCampaignPayments($stateParams.metroCampaignId);



  $scope.launchMetroCampaign = function(campaignId, ev){
     $scope.camMetroDetails = {};
    $scope.camMetroDetails.campaign_id = campaignId;
    $scope.camMetroDetails.status = 141;
    AdminCampaignService.updateMetroCampaignStatus($scope.camMetroDetails).then(function(result){
      if(result.status == 1){
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title("Congrats!!")
          .textContent(result.message)
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
        );
        getMetroCampaignDetails(campaignId);
      }
      else{
        toastr.error(result.message);
      }
    });
  }


  
  $scope.saveMetroCampaign = function (campaign) {
         
          MetroService.saveMetroCampaign(campaign).then(function (response) {
            if(response.status == 1){
              $scope.campaignSavedSuccessfully = true;
                $scope.metroCampaign = {};
                $scope.metroCampaignForm.$setPristine();
                $scope.metroCampaignForm.$setUntouched();
                $scope.campaignSavedSuccessfully = false;
                toastr.success(response.message);
                $mdSidenav('metroAddCmapginSidenav').close();
                getMetroCampaigns();
            }
            else{
              $scope.saveUserCampaignErrors = response.message;
              toastr.error(response.message);
            }
          });
        
      }


      $scope.closeMetroCampaign = function (campaign) {

        if ($window.confirm("Are you really want to close this campaign?")) {
          AdminMetroService.closeMetroCampaign(campaign).then(function (response) {
            if(response.status == 1){
              $scope.campaignSavedSuccessfully = true;
                $scope.metroCampaign = {};
               
                toastr.success(response.message);
                getMetroCampaigns();
            }
            else{
              //$scope.saveUserCampaignErrors = response.message;
              toastr.error(response.message);
            }
          });
        } else {
            $scope.Message = "You clicked NO.";
        }
         
         
        
      }

      $scope.deleteProductFromCampaign = function(campaignId,productId){
        if ($window.confirm("Are you really want to delete this package?")) {
           MetroService.deleteMetroPackageFromCampaign(campaignId, productId).then(function(result){
            if(result.status == 1){
              getMetroCampaignDetails(campaignId);

               loadCampaignPayments($stateParams.metroCampaignId);
              toastr.success(result.message);
            }
            else{
              toastr.error(result.message);
            }
          });
        } else {
            $scope.Message = "You clicked NO.";
        }
       
      }

});
