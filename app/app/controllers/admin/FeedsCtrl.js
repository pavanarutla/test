app.controller('AdminFeedsCtrl', function ($scope, $mdDialog, $http, $mdSidenav, $location, AdminCampaignService, ProductService, toastr) {

  /*
  ======== Campaign requests =======
  */
  $scope.requestList = {};
  function getAllFeeds(){
    AdminCampaignService.getAllCampaignRequests().then(function(result){
      $scope.requestList.campaignSuggestionRequests = result.requested_campaign_suggestions;
      $scope.requestList.otherCampaignFeeds = result.other_campaign_feeds;
    });
  }
  getAllFeeds();
  /*
  ======== Campaign requests ends =======
  */

  /*==============================
  | Feeds related methods
  ==============================*/
  $scope.showCampaignDetailsPopup = function (ev, campaignData) {
    $scope.selectedRequestDetails = campaignData;
    $mdDialog.show({
      templateUrl: 'views/admin/campaign-details-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
  };

  $scope.showCampaignSuggestionRequestPopup = function (ev, campaignData) {
    AdminCampaignService.getSuggestionRequestDetails(campaignData.campaign_id).then(function(result){
      $scope.selectedRequestDetails = result;
      $mdDialog.show({
        templateUrl: 'views/admin/campaign-suggestion-request-popup.html',
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      })
    });
  };

  /*
  ======== Campaign Suggestions(planned) ========
  */
  $scope.createCampaignToSuggest = function(emptyCampaign){
    $mdDialog.show({
      locals: {emptyCampaign: emptyCampaign, campaignPartial: $scope.selectedRequestDetails},
      templateUrl: 'views/admin/add-campaign.html',
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen,
      controller: function($scope, $mdDialog, AdminCampaignService, emptyCampaign, campaignPartial, toastr){
        $scope.campaignFromSuggestionRequest = {};
        emptyCampaign = _.extend(emptyCampaign, campaignPartial);
        $scope.campaignFromSuggestionRequest = emptyCampaign;
        $scope.campaignFromSuggestionRequest.id = emptyCampaign.campaign_id;
        console.log($scope.campaignFromSuggestionRequest);
        $scope.saveCampaign = function(){
          AdminCampaignService.saveUserCampaign($scope.campaignFromSuggestionRequest).then(function(result){
            if(result.status == 1){
              getAllFeeds();
              toastr.success(result.message);
              $mdDialog.hide();
            }
            else{
              toastr.error(result.message);
            }
          });
        }
        $scope.close = function(){
          $mdDialog.hide();
        }
      }
    });
  }
  /*
  ======== Campaign Suggestions(planned) ends ========
  */

  /*
  ======= Campaign Proposals =======
  */
  $scope.viewAndLaunchCampaign = function(campaignId){
    localStorage.campaignForSuggestion = JSON.stringify($scope.selectedRequestDetails);
    $location.path('/admin/campaign-proposal-summary/' + campaignId);
  }
  /*
  ======= Campaign Proposals Ends =======
  */

  /*
  ======= View and Launch Campaign =======
  */
  $scope.prepareQuoteForCampaign = function(campaignId){
    localStorage.campaignForSuggestion = JSON.stringify($scope.selectedRequestDetails);
    $location.path('/admin/campaign-proposal-summary/' + campaignId);
  }
  /*
  ======= View and Launch Campaign ands =======
  */

  /*==============================
  | Feeds related methods ends
  ==============================*/

  $scope.loadMore = function () {
    $scope.limit = $scope.items.length
  }
  /*//// popup ////////*/
  $scope.closeInputPanel = function(ev) {
    $mdSidenav('ClientRequest').toggle();
  };

  /* close modal */
  $scope.close = function(){
    $mdDialog.hide();
  }

});
 