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

  // $scope.limit = 3;

  // $scope.loadMore = function () {
  //   $scope.limit = $scope.items.length
  // }
  
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
    CampaignService.deleteProductFromCampaign(campaignId, productId).then(function(result){
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

    $scope.suggestionRequest = CampaignService.suggestedData;
    $scope.goToNextSuggestData = function(e){
      if($scope.suggestionRequest && Object.keys($scope.suggestionRequest).length > 2){
      CampaignService.suggestedData = Object.assign($scope.suggestionRequest,CampaignService.suggestedData);        
      $location.path('/suggest/marketingobjects')
      }else{
        e.preventDefault();
      }
     
    }
    $scope.goToAddAdvert = function(e){
      if($scope.suggestionRequest && Object.keys($scope.suggestionRequest).length >= 4){
      CampaignService.suggestedData = Object.assign($scope.suggestionRequest,CampaignService.suggestedData);        
      $location.path('/suggest/advertisingobjects')

      }else{
        e.preventDefault();
      }
     
    }
    $scope.goToOtherInfo = function(e){
      if($scope.suggestionRequest && Object.keys($scope.suggestionRequest).length > 8){
      CampaignService.suggestedData = Object.assign($scope.suggestionRequest,CampaignService.suggestedData);        
      $location.path('/suggest/otherinfo')
      }else{
        e.preventDefault();
      }
     
    }

  $scope.sendSuggestionRequest = function (ev) {
    if( $scope.suggestionRequest && Object.keys($scope.suggestionRequest).length >= 13){
      CampaignService.suggestedData = Object.assign($scope.suggestionRequest,CampaignService.suggestedData);
      CampaignService.sendSuggestionRequest(CampaignService.suggestedData).then(function (result) {
        if (result.status == 1) {
          CampaignService.suggestedData = null;
          $scope.suggestMeRequestSent = true;
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
        }
        if(result.status == 0){
          $scope.suggestCampaignErrors = result.message    
        }
      });
    } 
  };

  $scope.resetSuggestionForm = function(){
    $scope.suggestionRequest = null;
    CampaignService.suggestedData = null;
  }

  $scope.deleteCampaign = function (campaignId) {
    CampaignService.deleteCampaign(campaignId).then(function (result) {
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
        $scope.getCampaignDetails(campaignId);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

});