
app.controller('OwnerCampaignCtrl', function ($scope, $mdDialog,$mdSidenav, $interval, $stateParams, CampaignService, $window) {

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
  $scope.addCamapginSidenav = function () {
    $mdSidenav('ownerAddcmapgin').toggle();
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
  $scope.items = [
    {
      "campaignname": "Flipkart",
      "clientcomapanyname": "Neon",
      "clientname": "Chanikya",
      "clientcontent": "9966016136",
      "startdate": "12-Fed-2017",
      "enddate": "28-Feb-2017",
      "status": "Draft",
      "price": "25000",
      "products": "0"
    },
    {
      "campaignname": "Amezon",
      "clientcomapanyname": "Amezon",
      "clientname": "shiva",
      "clientcontent": "9966016136",
      "startdate": "12-Fed-2017",
      "enddate": "28-Feb-2017",
      "status": "Draft",
      "price": "30000",
      "products": "0"
    },
    {
      "campaignname": "Paytm",
      "clientcomapanyname": "Paytm",
      "clientname": "srikanth",
      "clientcontent": "9966016136",
      "startdate": "12-Fed-2017",
      "enddate": "28-Feb-2017",
      "status": "Draft",
      "price": "50000",
      "products": "0"
    }
  ]
  $scope.hoardinglist =[
      {
        "id":"AD_001",
        "type":"Billboard",
        "area":"Amreepet",
        "size":"20*30",
        "light":"No",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      },
      {
        "id":"AD_002",
        "type":"Unipole",
        "area":"Amreepet",
        "size":"20*30",
        "light":"Yes",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      },
      {
        "id":"AD_003",
        "type":"Digital",
        "area":"Amreepet",
        "size":"20*30",
        "light":"Yes",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      }
    ]
    $scope.viewImage = function () { 
    $mdDialog.show({
      templateUrl: 'views/owner/view-image.html',
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
  $scope.getUserCampaigns = function () {
    CampaignService.getCampaigns().then(function (result) {
      $scope.plannedCampaigns = _.where(result, { status: 1 });
      $scope.runningCampaigns = _.where(result, { status: 3 });
      $scope.closedCampaigns = _.where(result, { status: 5 });
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

});