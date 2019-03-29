app.controller('CampaignCtrl', function ($scope, $mdDialog, $mdSidenav, $interval, $stateParams, $window, $location, $rootScope, CampaignService, MetroService, config, toastr,FileSaver,$state) {

  $scope.config = config;

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
           $scope.userSavedCampaigns = _.filter(result, function(c){
       return c.status == 100 || c.status == 200; 
      });
      $scope.plannedCampaigns = _.filter(result, function(c){
       return c.status == 300 || c.status == 400 || c.status == 500 || c.status == 600; 
      });
      $scope.SheduledCampaigns = _.filter(result, function(c){
        return c.status == 700;
      });
      $scope.runningCampaigns = _.filter(result, function(c){
        return c.status == 800;
      });
      $scope.closedCampaigns = _.filter(result, function(c){
         return c.status == 1000 || c.status == 900;
      });
      
      // $scope.SheduledCampaigns = _.where(result, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'running') });
      // $scope.runningCampaigns = _.where(result, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'running') });
      // console.log('running camps',$scope.runningCampaigns)
      // $scope.closedCampaigns = _.where(result, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'stopped') });
    });
  }
  // get all Campaigns by a user to show it in campaign management page ends

  $scope.getCampaignDetails = function(campaignId){
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      $scope.campaignDetails = result;
      if(typeof result.act_budget === 'number' && result.act_budget % 1 == 0){
        $scope.campaignDetails.gst = 0;
        $scope.campaignDetails.subTotal = result.act_budget ;
        $scope.campaignDetails.grandTotal = $scope.campaignDetails.subTotal;
        $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
        $scope.TOTAL = $scope.campaignDetails.act_budget + $scope.GST;
        $scope.PendingPay = $scope.campaignDetails.totalamount - $scope.campaignDetails.total_paid;
      }
    });
  }
  // if($stateParams.campaignId){
  //   $scope.getCampaignDetails($stateParams.campaignId);
  // }
  $scope.gstuncheck = function(checked) {
    if (!checked) {
      $scope.GST = "0";
      $scope.onchecked = false;
      // $scope.checked = true;
      $scope.TOTAL = $scope.campaignDetails.act_budget + parseInt($scope.GST);
    } else {
      $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
      $scope.TOTAL = $scope.campaignDetails.act_budget + $scope.GST;
      $scope.onchecked = true;
      // $scope.checked = false;
    }
  };
  $scope.viewProductImage = function(image){
    var imagePath = config.serverUrl + image;
    $mdDialog.show({
      locals:{ src: imagePath },
      templateUrl: 'views/image-popup-large.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope,$mdDialog, src){
        $scope.img_src = src;
        $scope.close = function(){
          $mdDialog.hide();
        }
      }
    });
  }

  // Send & get comment  
  /*$scope.sendquerry = function (campID,message) {
    var data = {id:campID,message:message}
    CampaignService.sendComment(data).then(function (result) {
        if (result.status == 1) {
            //toastr.success(result.message);
            alert("Success!!!!");
            // $scope.sendquerryErrors = null;
            // $scope.sendquerry = {};
            // $scope.forms.sendquerryForm.$setPristine();
            // $scope.forms.sendquerryForm.$setUntouched();
        } else if (result.status == 0) {
            // $scope.sendquerryErrors = result.message;
            alert("Error!!!")
        }
    }, function (error) {
        toastr.error("somthing went wrong please try agin later");
    });
}
$scope.Getcomment = function (campaignID){  
  var data = {id:campaignID}
  CampaignService.getComment(data).then((result) => {
    console.log(result);
    $scope.comments = result;
});
}*/
  // Send and Get comment Ends

  $scope.confirmCampaignBooking = function(ev, campaignId){
    if ($scope.onchecked === true) {
      $scope.flag = 1;
    } else if ($scope.onchecked === false) {
      $scope.flag = 0;
    } else{
      $scope.flag = 1;
    } 
    //console.log($scope.campaignDetails.products);
    $i = 0;
    angular.forEach($scope.campaignDetails.products, function (value, key) {
      if(value.admin_price) ++$i;
    });
    console.log($i);
    if($i > 0){
      if($i == $scope.campaignDetails.products.length){
        CampaignService.confirmCampaignBooking(campaignId,$scope.flag,$scope.GST).then(function(result){
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
      }else{
        var confirm = $mdDialog.confirm()
          .title('Campaign Confirm')
          .textContent('Do you really want to confirm? Once you confirm your not deciced product will be deleted')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              CampaignService.confirmCampaignBooking(campaignId).then(function(result){
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
            });
      } 
      
    }
    
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

  $scope.changeQuoteRequest = function(campaignId,remark,type){
        $scope.changeRequest = {};
        $scope.changeRequest.for_campaign_id = campaignId;
        $scope.changeRequest.remark = remark;
        $scope.changeRequest.type = type;
          CampaignService.requestChangeInQuote($scope.changeRequest).then(function(result){
            if(result.status == 1){
              $scope.getCampaignDetails(campaignId);
              //$mdDialog.hide();
              toastr.success(result.message);
            }
            else{
              toastr.error(result.message);
            }
          });
  }

  $scope.suggestionRequest = CampaignService.suggestedData;
  $scope.goToNextSuggestData = function(e){
    if($scope.suggestionRequest && Object.keys($scope.suggestionRequest).length > 2){
      CampaignService.suggestedData = Object.assign($scope.suggestionRequest,CampaignService.suggestedData);        
      $location.path('/suggest/marketing-objectives');
    }else{
      e.preventDefault();
    }
  }
  $scope.goToAddAdvert = function(e){
    if($scope.suggestionRequest && Object.keys($scope.suggestionRequest).length >= 4){
      CampaignService.suggestedData = Object.assign($scope.suggestionRequest,CampaignService.suggestedData);        
      $location.path('/suggest/advertising-objectives');
    }else{
      e.preventDefault();
    }
  }
  $scope.goToOtherInfo = function(e){
    if($scope.suggestionRequest && Object.keys($scope.suggestionRequest).length > 8){
    CampaignService.suggestedData = Object.assign($scope.suggestionRequest,CampaignService.suggestedData);        
    $location.path('/suggest/other-info')
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
  $scope.toggleShareCampaignSidenav = function (activeUserCampaign) {
    $scope.currentShareCampaign = activeUserCampaign;
    $mdSidenav('shareCampaignSidenav').toggle();
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

  $scope.shareCampaignToEmail = function (ev, shareCampaign,campaignID,campaign_type) {
    console.log(campaignID);
    $scope.campaignToShare = $scope.campaignDetails;
    var campaignToEmail = {
      // campaign_id: $scope.campaignToShare.id,
      // email: shareCampaign.email,
      // receiver_name: shareCampaign.receiver_name,
      // campaign_type: $scope.campaignToShare.type
      campaign_id: campaignID,
      email: shareCampaign.email,
      receiver_name: shareCampaign.receiver_name,
      campaign_type: campaign_type
    };
    CampaignService.shareCampaignToEmail(campaignToEmail).then(function (result) {
      if (result.status == 1) {
        $mdSidenav('shareCampaignSidenav').close();
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title(result.message)
            //.textContent('You can specify some description text in here.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
        UsershareCampaign();
      }
      else {
        toastr.error(result.message);
      }
    });
  }
  function UsershareCampaign() {
    document.getElementById("usershareDrop").classList.toggle("show");
    // angular.element(document.querySelector("#saveCampaign")).addClass("hide");
    // angular.element(document.querySelector("#saveCampaign")).removeClass("show");    
  }

  function getMetroCampaigns(){
    MetroService.getMetroCampaigns().then((result) => {
      $scope.metroCampaigns = result;
    });
  }
  $scope.saveUserCampaign = function () {
    CampaignService.saveUserCampaign($scope.ownerCampaign).then(function (result) {      
      if (result.status == 1) {
        $scope.ownerCampaign = {};        
        loadOwnerCampaigns();     
        toastr.success(result.message);
        $state.reload();
      }
      else if (result.status == 0) {
        $rootScope.closeMdDialog();
        if (result.message.constructor == Array) {
          $scope.ownerCampaignErrors = result.message;
        }
        else {
          toastr.error(result.message);
        }
      }
      else {
        toastr.error(result.message);
      }
      UsersaveCampaign();
    });
  }
  function UsersaveCampaign() {
    document.getElementById("usersavedDropdown").classList.toggle("show");
}

//   function saveCampaign() {
//     document.getElementById("savedDropdown").classList.toggle("show");
// }
//   function myFunction() {
//     document.getElementById("savedDropdown").classList.toggle("show");
// }
// function close() {
//   angular.element(document.querySelector("#saveCampaign")).addClass("hide");
//   angular.element(document.querySelector("#saveCampaign")).removeClass("show");
// }
  var loadOwnerCampaigns = function () {
    return new Promise((resolve, reject) => {
      CampaignService.getCampaignWithProducts().then(function (result) {
            //$scope.ownerCampaigns = result;        
            $scope.ownerCampaigns = _.filter(result, function (c) {
                return c.status < 800;
            });
            $scope.scheduledCampaigns = _.filter(result, function (c) {
                return c.status >= 800;
            });
            resolve(result);
        });
    });
}
  $scope.saveMetroCampaign = function (metroCampagin) {
    MetroService.saveMetroCampaign(metroCampagin).then(function (result) {
      $scope.metrocampaign = result;
      if (result.status == 1) {
        // $scope.forms.MetroCampaign.$setPristine();
        // $scope.forms.MetroCampaign.$setUntouched();
        toastr.success(result.message);
      }
      else if (result.status == 0) {
        $rootScope.closeMdDialog();
        if (result.message.constructor == Array) {
          $scope.MetroCampaignErrors = result.message;
        }
        else {
          toastr.error(result.message);
        }
      }
      else {
        toastr.error(result.message);
      }
      $scope.metrocampaign = {};
      UsersaveCampaign();     
      getMetroCampaigns();
    });
  }
  // function metroclose() {

  //   angular.element(document.querySelector("#saveCampaign")).addClass("hide");
  //   angular.element(document.querySelector("#saveCampaign")).removeClass("show");
  // }
  var loadMetroCampaigns = function () {
    return new Promise((resolve, reject) => {
      MetroService.getMetroCampaigns().then(function (result) {              
        $scope.metrocampaign = _.filter(result, function (c) {
          return c.status >= 1101 ;
        });
        resolve(result);
      });
    });
  }
  function getMetroCampaignDetails() {
    MetroService.getMetroCampaigns().then((result) => {
      $scope.metrocampaign = result;
    });
  }

  /*=========================
  | Page based initial loads
  =========================*/

  if($rootScope.currStateName == "index.campaigns"){
    $scope.getUserCampaigns();
    getMetroCampaigns();
  }

  if ($rootScope.currStateName == "index.campaign-details") {
    $scope.getCampaignDetails($stateParams.campaignId)
  }

  $scope.deleteMetroCampaigns = function(campaignId){
        if ($window.confirm("Are you really want to delete this camapaign?")) {
           CampaignService.deleteMetroCampaign(campaignId).then(function(result){
            if(result.status == 1){
              getMetroCampaigns();
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
  $scope.downloadUserQuote = function (campaignId) {
                    CampaignService.downloadQuote(campaignId).then(function (result) {
                        var campaignPdf = new Blob([result], {type: 'application/pdf;charset=utf-8'});
                        FileSaver.saveAs(campaignPdf, 'campaigns.pdf');
                        if (result.status) {
                            toastr.error(result.meesage);
                        }
                    });
                };
  /*=============================
  | Page based initial loads end
  =============================*/
  //loadMetroCampaigns();
  //$scope.Getcomment($stateParams.campaignId);
  getMetroCampaignDetails();
});