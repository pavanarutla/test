<<<<<<< HEAD
app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, $stateParams, CampaignService, AdminCampaignService) {
  var vm = $scope;
  vm.limit = 5;
=======
app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, $stateParams, CampaignService, AdminCampaignService, Upload, toastr,  FileSaver, Blob) {

>>>>>>> ddcf8fc4154dcdde0bb69abb80ceb6f234b2b7ff
  // $scope.limit= 3;
  // $scope.loadMore = function() {
  //   $scope.limit = $scope.items.length;
  // };

  if($stateParams.campaignId){
    var campaignId = $stateParams.campaignId;
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      // console.log(result);
    });
  }
  
  $scope.showAddCampaignPopup = function () {
    $mdDialog.show({
      templateUrl: 'views/admin/add-full-campaign.html',
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen,
      controller: function($scope, $mdDialog, AdminCampaignService, toastr){
        $scope.campaign = {};
        $scope.saveCampaign = function(){
          AdminCampaignService.saveCampaign($scope.campaign).then(function(result){
            if(result.status == 1){
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
  };
  $scope.removeCampagin = function(campagin){
    console.log(campagin);
    // AdminCampaignService.deleteCampaign(campagin.id).then(function (result) {
    //   if (result.status == 1) {
    //     toastr.success(result.message);
    //   }
    //   else {
    //     toastr.error(result.message);
    //   }
    // });
  };



  // Load More Code
  $scope.loadMore = function() {
    var increamented = vm.limit + 2;
    vm.limit = increamented > $scope.cruises.length ? $scope.cruises.length : increamented;
  };
  $scope.cruises = [{
    Campaginname: 'New',
    Clientname: 'New1',
    StartDate: '1-2-18',
    EndDate:'2-2-18',
    EstimatedBudget:'1,00,000'
  },
  {
    Campaginname: 'New2',
    Clientname: 'New1',
    StartDate: '1-2-18',
    EndDate:'2-2-18',
    EstimatedBudget:'1,00,000'
  },
  {
    Campaginname: 'TVS',
    Clientname: 'Apache',
    StartDate: '1-2-18',
    EndDate:'2-2-18',
    EstimatedBudget:'1,00,000'
  },
  {
    Campaginname: 'Hero',
    Clientname: 'CD-Delux',
    StartDate: '1-2-18',
    EndDate:'2-2-18',
    EstimatedBudget:'400'
  },
  {
    Campaginname: 'Bajaj',
    Clientname: 'Avenger-150',
    StartDate: '1-2-18',
    EndDate:'2-2-18',
    EstimatedBudget:'300'
  },
  {
    Campaginname: 'Honda',
    Clientname: 'City',
    StartDate: '1-2-18',
    EndDate:'2-2-18',
    EstimatedBudget:'100'
  }
  //  {
  //   img: 'img2',
  //   title: 'title2',
  //   desc: 'lorem ipsusm bla ba bla lbla blall'
  // }, {
  //   img: 'img3',
  //   title: 'title3',
  //   desc: 'lorem ipsusm bla ba bla lbla blall'
  // }, {
  //   img: 'img4',
  //   title: 'title4',
  //   desc: 'lorem ipsusm bla ba bla lbla blall'
  // }, {
  //   img: 'img5',
  //   title: 'title5',
  //   desc: 'lorem ipsusm bla ba bla lbla blall'
  // }, {
  //   img: 'img6',
  //   title: 'title6',
  //   desc: 'lorem ipsusm bla ba bla lbla blall'
  // }, {
  //   img: 'img7',
  //   title: 'title7',
  //   desc: 'lorem ipsusm bla ba bla lbla blall'
  // }, {
  //   img: 'img8',
  //   title: 'title8',
  //   desc: 'lorem ipsusm bla ba bla lbla blall'
  // }, {
  //   img: 'img9',
  //   title: 'title9',
  //   desc: 'lorem ipsusm bla ba bla lbla blall'
  // },
 ];

//  Table --- Filter code 
$scope.headers = Object.keys($scope.cruises[0]);
//  Filter code-End
  $scope.cancel = function(){
    $mdDialog.hide();
  };

  /*
  *========= campagin proposal(planned) grid =========
  */
  AdminCampaignService.getAllCampaigns().then(function(result){
    //$scope.gridPreLaunch.data = result;
     $scope.personalcampsdata = result;
  });

  /*
  *========= campagin proposal(planned) grid ends =========
  */

  //campagin running grid

  
  // $http.get('fakedb/data.json').success(function (data) {
  //   for (i = 0; i < data.length; i++) {
  //     data[i].registered = new Date(data[i].registered);
  //   }
  //   $scope.gridRunning.data = data;
  // });

  // campagin Closed grid

  
  // $http.get('fakedb/data.json').success(function (data) {
  //   for (i = 0; i < data.length; i++) {
  //     data[i].registered = new Date(data[i].registered);
  //   }
  //   $scope.gridClosed.data = data;
  // });

<<<<<<< HEAD

  // tables code start
  var vm = $scope;
  vm.limit = 10;
  $scope.loadMore = function() {
    var increamented = vm.limit + 5;
    vm.limit = increamented > $scope.personalcampsdata.length ? $scope.personalcampsdata.length : increamented;
  };
// tables code end
=======
  /*
  //////// Floating campaign section
  */

  $scope.formRows = [{formId: '1', name: 'floatginCampaignForm1'}];
  $scope.addNewFormRow = function() {
    var newItemNo = $scope.formRows.length + 2;
    $scope.formRows.push({'formId' : newItemNo, 'name' : 'floatingCampaignForm' + newItemNo});
  };

  $scope.generateFloatingCampaignPdf = function(){
    Upload.upload({
      url: config.apiPath + '/floating-campaign-pdf',
      data: { product_arr: $scope.formRows },
      responseType: "arraybuffer"
    }).then(function (result) {
      if(result.data){
        var campaignPdf = new Blob([result.data], { type: 'application/pdf;charset=utf-8' });
        FileSaver.saveAs(campaignPdf, 'Campaigns Proposal.pdf');
      }
      else{
        toastr.error(result.message);
      }
    }, function (resp) {
      // console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  } 

  /*
  //////// Floating campaign section ends
  */
>>>>>>> ddcf8fc4154dcdde0bb69abb80ceb6f234b2b7ff

});
