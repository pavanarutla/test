app.controller('AdminFeedsCtrl', function ($scope, $mdDialog, $http, $mdSidenav, $location, $rootScope, $stateParams, AdminCampaignService, ProductService, toastr) {

  /*
  ======== Campaign requests =======
  */
  $scope.requestList = {};
  function getAllFeeds(){
    return new Promise((resolve, reject) => {
      AdminCampaignService.getAllCampaignRequests().then(function(result){
        console.log(result);
        $scope.requestList.metroCampaignFeeds = result.metro_campaign_feeds;
        $scope.requestList.campaignSuggestionRequests = result.requested_campaign_suggestions;
        $scope.requestList.otherCampaignFeeds = result.other_campaign_feeds;
        resolve(result.requested_campaign_suggestions);
      });
    });
  }
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
        $scope.campaignFromSuggestionRequest.start_date = moment().add(5, 'days').toDate();
        $scope.campaignFromSuggestionRequest.end_date = moment($scope.campaignFromSuggestionRequest.start_date).add(1, 'days').toDate();
        $scope.dateLimits = {
          minStartDate : moment().add(5, 'days').toDate(),
          minEndDate : moment($scope.campaignFromSuggestionRequest.start_date).add(1, 'days').toDate()
        };
        $scope.updateEndDateValidations = function(){
          $scope.dateLimits.minEndDate = moment($scope.campaignFromSuggestionRequest.start_date).add(1, 'days').toDate();
          if($scope.campaignFromSuggestionRequest.end_date <= $scope.campaignFromSuggestionRequest.start_date){
            $scope.campaignFromSuggestionRequest.end_date = $scope.dateLimits.minEndDate;
          }
        }
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

  if($rootScope.currStateName == 'admin.home'){
    if($stateParams.campSuggReqId){
      getAllFeeds().then((suggRequests) => {
        var suggReq = _.filter(suggRequests, function(sr){          
          return sr.id == $stateParams.campSuggReqId;
        });
        (typeof suggReq != 'undefined') && $scope.showCampaignSuggestionRequestPopup(null, suggReq[0]);
      });
    }
    else{
      getAllFeeds();
    }
  }

});
 