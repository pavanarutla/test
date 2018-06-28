app.controller('CampaignCtrl', function ($scope, $mdDialog, $mdSidenav, $interval, $stateParams, $window, $location, CampaignService, config, toastr) {

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

  $scope.showPaymentdailog = function () {
    $mdDialog.show({
      templateUrl: 'views/updatepaymentDailog.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  ////data for image uploading 

  $scope.data = {};
  $scope.uploadFile = function (input) {
    $scope.data.fileName = input.files[0].name;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        //Sets the Old Image to new New Image
        $('#photo-id').attr('src', e.target.result);
        //Create a canvas and draw image on Client Side to get the byte[] equivalent
        var canvas = document.createElement("canvas");
        var imageElement = document.createElement("img");
        imageElement.setAttribute('src', e.target.result);
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        var context = canvas.getContext("2d");
        context.drawImage(imageElement, 0, 0);
        var base64Image = canvas.toDataURL("image/jpeg");
        //Removes the Data Type Prefix 
        //And set the view model to the new value
        $scope.data.uploadedPhoto = e.target.result.replace(/data:image\/jpeg;base64,/g, '');
        // console.log($scope.data.uploadedPhoto);
      }
      //Renders Image on Page
      reader.readAsDataURL(input.files[0]);
    }
  };

  
   $scope.ProductImageView = function (ev, img_src) {
    $mdDialog.show({
      locals:{ src: img_src },
      templateUrl: 'views/image-popup-large.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, src){
        $scope.img_src = src;
      }
    });
  };
  
  $scope.campaignDetails = {};

  $scope.limit = 3;

  $scope.loadMore = function () {
    $scope.limit = $scope.items.length
  }
  
  // get all Campaigns by a user to show it in campaign management page
  $scope.getUserCampaigns = function () {
    CampaignService.getActiveUserCampaigns().then(function (result) {
      $scope.plannedCampaigns = _.filter(result, function(c){
        return c.status < 6;
      });
      $scope.runningCampaigns = _.where(result, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'running') });
      $scope.closedCampaigns = _.where(result, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'stopped') });
    });
  }
  $scope.getUserCampaigns();
  // get all Campaigns by a user to show it in campaign management page ends

  $scope.getCampaignDetails = function(campaignId){
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      $scope.campaignDetails = result;
    });
  }
  if($stateParams.campaignId){
    $scope.getCampaignDetails($stateParams.campaignId);
  }

  $scope.viewProductImage = function(image){
    var imagePath = config.serverUrl + image;
    $mdDialog.show({
      locals:{ src: imagePath },
      templateUrl: 'views/image-popup-large.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, src){
        $scope.img_src = src;
      }
    });
  }

  $scope.requestLaunchCampaign = function(ev, campaignId){
    CampaignService.requestLaunch(campaignId).then(function(result){
      if(result.status == 1){
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title(result.message)
            .textContent('The Admin will soon launch your campaign and intimate you about it.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
        $scope.getCampaignDetails(campaignId);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.deleteProductFromCampaign = function(productId, campaignId){
    CampaignService.deleteProductFromUserCampaign(campaignId, productId).then(function(result){
      if(result.status == 1){
        CampaignService.getCampaignWithProducts(campaignId).then(function(result){
          $scope.campaignDetails = result;
        });
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.openRequestChangeQuoteForm = function(campaignId){
    $mdDialog.show({
      locals: {ctrlScope: $scope},
      templateUrl: 'views/request-quote-change.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller: function($scope, $mdDialog, ctrlScope, CampaignService, toastr){
        $scope.changeRequest = {};
        $scope.changeRequest.for_campaign_id = ctrlScope.campaignDetails.id;
        $scope.requestChangeInQuote = function(){          
          CampaignService.requestChangeInQuote($scope.changeRequest).then(function(result){
            if(result.status == 1){
              $mdDialog.hide();
              toastr.success(result.message);
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

  $scope.sendSuggestionRequest = function (ev) {
    CampaignService.sendSuggestionRequest($scope.suggestionRequest).then(function (result) {
      if (result.status == 1) {
        $scope.suggestMeRequestSent = true;
      }
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title('We will get back to you!!!!')
          .textContent(result.message)
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
      )
      .finally(function(){
        $location.path('#/home')
      });
    });
  };

  $scope.resetSuggestionForm = function(){
    $scope.suggestionRequest = {};
  }

  $scope.deleteCampaign = function (campaignId) {
    CampaignService.deleteUserCampaign(campaignId).then(function (result) {
      if (result.status == 1) {
        $scope.getUserCampaigns();
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }
  $scope.ShareShortlistedSidenav = function () {
    $mdSidenav('shortlistSharingSidenav').toggle();
  };


  $scope.shareCampaign = function (ev, shareCampaign,campaignID,campaignType) {
        var campaignToEmail = {
          campaign_id: campaignID,
          email: shareCampaign.email,
          receiver_name: shareCampaign.receiver_name,
          campaign_type: campaignType
        };
        CampaignService.shareCampaignToEmail(campaignToEmail).then(function (result) {
          if (result.status == 1) {
            $mdSidenav('shortlistSharingSidenav').close();
            $scope.shareCampaign = {};
            $scope.shareCampaignForm.$setPristine();
            $scope.shareCampaignForm.$setUntouched();
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
          else {
            toastr.error(result.message);
          }
        });
  }

  $scope.requestProposalForCampaign = function (campaignId, ev) {
        CampaignService.requestCampaignProposal(campaignId).then(function (result) {
          if (result.status == 1) {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title('We will get back to you!!!!')
                .textContent(result.message)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
            );
          }
          else {
            toastr.error(result.message);
          }
          $scope.getCampaignDetails($stateParams.campaignId);
        });
      }

});