app.controller('UserPaymentCtrl', function ($scope,CampaignService,$rootScope,$stateParams) {  
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
          if(typeof result.act_budget === 'number' && result.act_budget % 1 == 0){
            $scope.UserPaymentDetails.gst = result.act_budget * 18 / 100;
            $scope.UserPaymentDetails.subTotal = result.act_budget + $scope.UserPaymentDetails.gst;
            $scope.UserPaymentDetails.grandTotal = $scope.UserPaymentDetails.subTotal;
          }
        });
      }
        if ($rootScope.currStateName == "index.user-payments") {
            $scope.getUserPayment();
          }
          if ($rootScope.currStateName == "index.update-user-payments") {
            $scope.getCampaignDetails($stateParams.id);
          }
})