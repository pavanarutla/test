app.controller('UserPaymentCtrl', function ($scope,CampaignService,$rootScope,$stateParams,$mdSidenav,toastr,$mdDialog,FileSaver) {  
    $scope.getUserPayment = function(){
        CampaignService.getActiveUserCampaigns().then(function(result){
            console.log(result);
          $scope.userPayments = result;
        });
    }
    $scope.getCampaignDetails = function(campaignId){
        console.log(campaignId);
        CampaignService.getPaymentForUserCampaigns(campaignId).then(function(result){
            console.log(result);
          $scope.UserPaymentDetails = result;
          if(result.status == 0 ){
            $scope.message = result.message;
          }   
          $scope.balance = $scope.UserPaymentDetails.campaign_details.total_amount - $scope.UserPaymentDetails.total_paid;
        });
      }

      //share Camp
      $scope.toggleShareCampaignSidenav = function (campaign) {
        console.log(campaign);
        $scope.currentOwnerShareCampaign = campaign;
        $mdSidenav('shareCampaignSidenav').toggle();
    };
    $scope.shareCampaignToEmail = function (ev, shareCampaign, campaignID) {
      console.log(campaignID);
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
        if ($rootScope.currStateName == "index.user-payments") {
            $scope.getUserPayment();
          }
          if ($rootScope.currStateName == "index.update-user-payments") {
            $scope.getCampaignDetails($stateParams.id);
          }
})