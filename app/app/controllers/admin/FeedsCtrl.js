app.controller('AdminFeedsCtrl', function ($scope, $mdDialog, $http, AdminCampaignService, toastr) {
  
    $scope.msg = {};
    $scope.limit = 3;

    /*
    ======== Campaign requests =======
    */
    AdminCampaignService.getAllCampaignRequests().then(function(result){
      console.log(result);
      $scope.requestList = result;
      // $scope.groupedRequests = _.groupBy(requestList, function(request){
      //   return request.status;
      // });
    });
    /*
    ======== Campaign requests ends =======
    */

    $scope.showCampaignDetailsPopup = function (ev, campaignData) {
      $mdDialog.show({
        locals:{data: campaignData},
        templateUrl: 'views/admin/campaign-details-popup.html',
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        controller: function ($scope, data) {
          $scope.campaign = data;
        }
      })
    };

    $scope.closeCampaignRequestDetails = function(){
      $mdDialog.hide();
    }
  
    /*
    ======== Campaign Suggestions(planned) ========
    */
    // AdminCampaignService.getPlannedCampaigns().then(function(result){
    //   $scope.campaignProposalList = result;
    // });
    /*
    ======== Campaign Suggestions(planned) ends ========
    */

    $scope.loadMore = function () {
      $scope.limit = $scope.items.length
    }
  });
  