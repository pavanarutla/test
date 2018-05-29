
app.controller('OwnerCampaignCtrl', function ($scope, $mdDialog,$mdSidenav, $interval, $stateParams, CampaignService, $window,toastr,$rootScope,$state,OwnerCampaignService,FileSaver) {

  $scope.CAMPAIGN_STATUS = [
    "",                 // index 0
    "Draft",            // index 1
    "Launch Requested", // index 2
    "Running",          // index 3
    "Suspended",        // index 4
    "Stopped"           // index 5
  ];

  $scope.showPaymentdailog = function () {
    $mdDialog.show({
      templateUrl: 'views/updatepaymentDailog.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
  // $scope.addOwnerCampagin = function (ev) {
  //   $mdDialog.show({
  //     templateUrl: 'views/owner/addcampaign.html',
  //     fullscreen: $scope.customFullscreen,
  //     clickOutsideToClose: true
  //   })
  // };
  $scope.addCamapginSidenav = function ($data) {
    $mdSidenav('ownerAddcmapgin').toggle();
    console.log("$data");
    console.log($data);
    if($data){
      $scope.campaign = $data;
    }
  };
  $scope.cancel = function () {
    $mdDialog.hide();
  };

  $scope.sharePerson = false;
  $scope.shareCampaign = function () {
        $scope.sharePerson = !$scope.sharePerson;
  }




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

  //view in location pages
  $scope.viewlocation = function(){
    $window.open('#/location', '_blank');
  }

  $scope.campaignDetails = {};

  ///Delete the Products
  $scope.deleteProducts = function(item){
    var index = $scope.campaignDetails.indexOf(item);
    $scope.campaignDetails.splice(index, 1);   
  }

  $scope.limit = 3;

  $scope.loadMore = function () {
    $scope.limit = $scope.items.length
  }

  $scope.viewImage = function () { 
    $mdDialog.show({
      templateUrl: 'views/owner/viewimage.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  //slider
  var self = this, j = 0, counter = 0;

  self.mode = 'query';
  self.activated = true;
  self.determinateValue = 30;
  self.determinateValue2 = 30;

  self.showList = [];

  /**
   * Turn off or on the 5 themed loaders
   */
  self.toggleActivation = function () {
    if (!self.activated) self.showList = [];
    if (self.activated) {
      j = counter = 0;
      self.determinateValue = 30;
      self.determinateValue2 = 30;
    }
  };

  $interval(function () {
    self.determinateValue += 1;
    self.determinateValue2 += 1.5;

    if (self.determinateValue > 100) self.determinateValue = 30;
    if (self.determinateValue2 > 100) self.determinateValue2 = 30;

    // Incrementally start animation the five (5) Indeterminate,
    // themed progress circular bars

    if ((j < 2) && !self.showList[j] && self.activated) {
      self.showList[j] = true;
    }
    if (counter++ % 4 === 0) j++;

    // Show the indicator in the "Used within Containers" after 200ms delay
    if (j == 2) self.contained = "indeterminate";

  }, 100, 0, true);

  $interval(function () {
    self.mode = (self.mode == 'query' ? 'determinate' : 'query');
  }, 7200, 0, true);



  
  // get all Campaigns by a user to show it in campaign management page
  //$scope.getUserCampaigns = function () {
    OwnerCampaignService.getOwnerCamapigns().then(function (result) {
      /*$planned1 = _.where(result, { status: 0 });
      $planned2 = _.where(result, { status: 1 });
      $planned3 = _.where(result, { status: 2 });
      $planned4 = _.where(result, { status: 3 });
      $planned5 = _.where(result, { status: 4 });
      $planned6 = _.where(result, { status: 5 });
      $planned7 = _.where(result, { status: 6 });
      $planned8 = _.where(result, { status: 7 });
      $planned9 = _.where(result, { status: 8 });
      $planned10 = _.where(result, { status: 9 });
      console.log('result');
      $scope.plannedCampaigns = $planned1.concat($planned2,$planned3,$planned4,$planned5,$planned6,$planned7);
      $scope.runningCampaigns = $planned8.concat($planned9);
      $scope.closedCampaigns = $planned10;
      console.log($scope.plannedCampaigns);*/
      //$scope.runningCampaigns = _.where(result, { status: 7,status:8 });
      //$scope.closedCampaigns = _.where(result, { status: 9 });
      $scope.plannedCampaigns = result;

    });
  //}
  //$scope.getUserCampaigns();
  // get all Campaigns by a user to show it in campaign management page ends

  $scope.getCampaignDetails = function(campaignId){
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      $scope.campaignDetails = result;
    });
  }
  if($stateParams.campaignId){
    $scope.getCampaignDetails($stateParams.campaignId);
  }
  
  $scope.campaign = {};
  $scope.submittedtrue = false;
  $scope.saveCampaign = function($detail){
    $scope.submittedtrue = true;
    
    if($scope.signup.$valid) {
      $scope.campaign.posted_by= $rootScope.owner_detail.user_id;
      CampaignService.saveCampaign($scope.campaign).then(function(result){
        if(result.status == 1){
          toastr.success(result.message);
          $state.go($state.current, {}, {reload: true});
        }
        else{
          toastr.error(result.message);
        }
      });
    }
  }

 $scope.campaignList =[];
    $scope.CheckUncheckHeader = function (plannedCampaigns) {
      $scope.campaignList =[];
      $scope.IsAllChecked = true;
      for (var i = 0; i < plannedCampaigns.length; i++) {
          if (!plannedCampaigns[i].Selected) {
              $scope.IsAllChecked = false;
              //break;
          }else{
            $scope.campaignList.push(plannedCampaigns[i].id)
          }
      };
      console.log("ppp");
      console.log( $scope.campaignList);
  };
  //$scope.CheckUncheckHeader();

  $scope.CheckUncheckAll = function () {
    $scope.campaignList =[];
      for (var i = 0; i < $scope.plannedCampaigns.length; i++) {
          $scope.plannedCampaigns[i].Selected = $scope.IsAllChecked;
          if($scope.plannedCampaigns[i].Selected){
            $scope.campaignList.push($scope.plannedCampaigns[i].id)
          }
      }
  };

  $scope.exportAllCampaigns = function (data) {
    if($scope.shareCampaignForm.$valid){
      if($scope.campaignList.length==0){
        alert("Please Select some Campaigns to share");
      }else{
       var data1 = {campaignsIDS:$scope.campaignList,receiver_name:data.receiver_name,email:data.email};
        OwnerCampaignService.ownerCamapignPDF(data1).then(function(result){
         console.log(result);
          if(result.status==1){
            toastr.success(result.message);
             $scope.sharePerson = false;
          }else{
            toastr.error(result.message);
          }
        });
      }
    }else{
         console.log("Please check validations");

    }
    
       
      };
   
});