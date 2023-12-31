app.controller('UserPaymentCtrl', function ($scope,CampaignService,$rootScope,$stateParams,$mdSidenav,toastr,$mdDialog,FileSaver) {  
    $scope.getUserPayment = function(){
        CampaignService.getActiveUserCampaigns().then(function(result){
          $scope.userPayments = result;
        });
    }
    $scope.getCampaignDetails = function(campaignId){
        CampaignService.getPaymentForUserCampaigns(campaignId).then(function(result){
          $scope.UserPaymentDetails = result;
          if(result.status == 0 ){
            $scope.message = result.message;
          }   
          $scope.TOTALpay = $scope.UserPaymentDetails.campaign_details.total_amount - parseInt($scope.UserPaymentDetails.total_paid);
        });
      }

      //share Camp
      $scope.toggleShareCampaignSidenav = function (campaign) {
        $scope.currentOwnerShareCampaign = campaign;
        $mdSidenav('shareCampaignSidenav').toggle();
    };
    $scope.shareCampaignToEmail = function (ev, shareCampaign, campaignID) {
      $scope.campaignToShare = $scope.campaignDetails;
      var campaignToEmail = {
          campaign_id: campaignID,
          email: shareCampaign.email,
          receiver_name: shareCampaign.receiver_name,
          //campaign_type: $scope.campaignToShare.type
      };
      CampaignService.shareCampaignToEmail(campaignToEmail).then(function (result) {
          if (result.status == 1) {
              $mdSidenav('shareCampaignSidenav').close();
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
          } else {
              toastr.error(result.message);
          }
      });
  }
      //share Camp ends
      $scope.downloadUserQuote = function (campaignId) {
        CampaignService.downloadQuote(campaignId).then(function (result) {
            var campaignPdf = new Blob([result], {type: 'application/pdf;charset=utf-8'});
            FileSaver.saveAs(campaignPdf, 'campaigns.pdf');
            if (result.status) {
                toastr.error(result.meesage);
            }
        });
    };
    $scope.downloadOwnerReciepts = function(campaignId){
      CampaignService.downloadOwnerReciepts(campaignId).then(function (result) {
          var campaignPdf = new Blob([result], {type: 'application/pdf;charset=utf-8'});
          FileSaver.saveAs(campaignPdf, 'campaigns.pdf');
          if (result.status) {
              toastr.error(result.meesage);
          }
      });
  }
        if ($rootScope.currStateName == "index.user-payments") {
            $scope.getUserPayment();
          }
          if ($rootScope.currStateName == "index.update-user-payments") {
            $scope.getCampaignDetails($stateParams.id);
            // if ($scope.campaignDetails.gst_price != "0") {
            //   $scope.GST = ($scope.campaignDetails.total_amount / 100) * 18;
            //   $scope.TOTALpay = $scope.campaignDetails.total_amount + parseInt($scope.GST) - $scope.campaignDetails.total_paid;
            // } else {
            //   $scope.GST = "0";
            //   $scope.TOTALpay = $scope.campaignDetails.total_amount + parseInt($scope.GST) - $scope.campaignDetails.total_paid;
            // } 
            
          }
})