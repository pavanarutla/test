app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, $stateParams, $location, CampaignService, AdminCampaignService, Upload, toastr,  FileSaver, Blob) {

  $scope.CAMPAIGN_STATUS = [
    'suggestion-requested',  //    0
    'campaign-preparing',    //    1
    'campaign-created',      //    2
    'quote-requested',       //    3
    'quote-given',           //    4
    'change-requested',      //    5 
    'launch-requested',      //    6
    'running',               //    7
    'suspended',             //    8
    'stopped'                //    9
  ];

  var getAllCampaigns = function(){
      AdminCampaignService.getAllCampaigns().then(function(result){
      $scope.plannedCampaigns = _.filter(result, function(c){
        return c.status < 6;
      });
      $scope.runningCampaigns = _.where(result, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'running') });
      $scope.closedCampaigns = _.where(result, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'stopped') });
    });

    if($stateParams.campaignId){
      var campaignId = $stateParams.campaignId;
      CampaignService.getCampaignWithProducts(campaignId).then(function(result){
        // console.log(result);
      });
    }
  }
  getAllCampaigns();

  /*=====================
  | Filtering Campaigns
  =====================*/
  // $scope.simulateQuery = false;
  $scope.isDisabled    = false;
  // $scope.querySearch   = querySearch;
  // $scope.selectedItemChange = selectedItemChange;
  // $scope.searchTextChange   = searchTextChange;


  $scope.campaignSearch = function(query) {
    return AdminCampaignService.searchCampaigns(query.toLowerCase()).then(function(res){
      return res;
    });
  }

  $scope.viewSelectedCampaign = function(campaign) {
    $location.path('/admin/campaign-proposal-summary/' + campaign.id);
  }

  function selectedItemChange(item) {
    //console.log('Item changed to ' + JSON.stringify(item));
  }

  /*=========================
  | Filtering Campaigns Ends
  =========================*/

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
            else if(result.status == 0){
              $scope.campaignDetailsErrorEessages = result.message;
            }
          },function(result){
              $scope.campaignDetailsErrorEessages = "somthing went wrong please try again after some time!"
          });
        }
        $scope.close = function(){
          $mdDialog.hide();
        }
      }
    });
  };

  $scope.cancel = function(){
    $mdDialog.hide();
  };

  /*
  *========= campagin proposal(planned) grid =========
  */

  // $scope.gridPreLaunch = {
  //   paginationPageSizes: [25, 50, 75],
  //   paginationPageSize: 25,
  //   enableCellEditOnFocus: false,
  //   multiSelect: false,
  //   enableFiltering: true,
  //   enableSorting: true,
  //   showColumnMenu: false,
  //   enableGridMenu: true,
  //   enableRowSelection: true,
  //   enableRowHeaderSelection: false,
  // };
  // $scope.gridPreLaunch.columnDefs = [
  //   { name: 'created_by', displayName: 'Created By', enableCellEdit: false, width: '5%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
  //     cellTemplate: '<div>{{ row.entity.created_by }}, {{ row.entity.delegated_to | PickFirst2Letters }}</div>'
  //   },
  //   { name: 'name', displayName: 'Campagin Name ', width: '15%', enableCellEdit: false, headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'user_full_name', displayName: 'Client Name', width: '15%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'user_phone', displayName: 'Client Contact', type: 'number', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'start_date', displayName: 'Start Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
  //     cellTemplate: '<div>{{ row.entity.start_date | dateify | date:"dd-MM-yyyy" }}</div>'
  //   },
  //   { name: 'end_date', displayName: 'End Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
  //     cellTemplate: '<div>{{ row.entity.end_date | dateify | date:"dd-MM-yyyy" }}</div>'
  //   },
  //   { name: 'status', displayName: 'Status', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
  //     cellTemplate: '<div>{{ row.entity.status | stringifyCampaignStatus }}</div>'
  //   },
  //   { name: 'est_budget', displayName: 'Estimated Budget', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'products', displayName: 'Products', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
  //     cellTemplate: '<div>{{row.entity.products.length}}</div>'
  //   },
  //   {
  //     name: 'Action', field: 'Action', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
  //     cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#/admin/campaign-proposal-summary/{{row.entity.id}}" ng-click="" ng-if="row.entity.status != 0"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">share</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
  //     enableFiltering: false,
  //   }
  // ];
  // $scope.msg = {};
  // $scope.gridPreLaunch.onRegisterApi = function (gridApi) {
  //   //set gridApi on scope
  //   $scope.gridApi = gridApi;
  //   gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
  //     $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
  //     $scope.$apply();
  //   });
  // };

  /*
  *========= campagin proposal(planned) grid ends =========
  */

  //campagin running grid

  // $scope.gridRunning = {
  //   paginationPageSizes: [25, 50, 75],
  //   paginationPageSize: 25,
  //   enableCellEditOnFocus: false,
  //   multiSelect: false,
  //   enableFiltering: true,
  //   enableSorting: true,
  //   showColumnMenu: false,
  //   enableGridMenu: true,
  //   enableRowSelection: true,
  //   enableRowHeaderSelection: false,
  // };
  // $scope.gridRunning.columnDefs = [
  //   { name: 'id', displayName: 'ID ', enableCellEdit: false, width: '5%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'campaignname', displayName: 'Campagin Name ', width: '15%', enableCellEdit: false, headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'clientname', displayName: 'Client Name', width: '15%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'clientcontent', displayName: 'Client Contact', type: 'number', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'startdate', displayName: 'Start Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'enddate', displayName: 'End Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'Runningstatus', displayName: 'Status', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'price', displayName: 'Price', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'products', displayName: 'Products', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   {
  //     name: 'Action', field: 'Action', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
  //     cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#/admin/campaign-running-summary"><md-icon><i class="material-icons">remove_red_eye</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">share</i></md-icon></a></span></div>',
  //     enableFiltering: false,
  //   }
  // ];
  // $scope.msg = {};
  // $scope.gridRunning.onRegisterApi = function (gridApi) {
  //   //set gridApi on scope
  //   $scope.gridApi = gridApi;
  //   gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
  //     $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
  //     $scope.$apply();
  //   });
  // };
  // $http.get('fakedb/data.json').success(function (data) {
  //   for (i = 0; i < data.length; i++) {
  //     data[i].registered = new Date(data[i].registered);
  //   }
  //   $scope.gridRunning.data = data;
  // });

  // campagin Closed grid

  // $scope.gridClosed = {
  //   paginationPageSizes: [25, 50, 75],
  //   paginationPageSize: 25,
  //   enableCellEditOnFocus: false,
  //   multiSelect: false,
  //   enableFiltering: true,
  //   enableSorting: true,
  //   showColumnMenu: false,
  //   enableGridMenu: true,
  //   enableRowSelection: true,
  //   enableRowHeaderSelection: false,
  // };
  // $scope.gridClosed.columnDefs = [
  //   { name: 'id', displayName: 'ID ', enableCellEdit: false, width: '5%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'campaignname', displayName: 'Campagin Name ', width: '15%', enableCellEdit: false, headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'clientname', displayName: 'Client Name', width: '15%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'clientcontent', displayName: 'Client Contact', type: 'number', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'startdate', displayName: 'Start Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'enddate', displayName: 'End Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'Closedstatus', displayName: 'Status', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'price', displayName: 'Price', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   { name: 'products', displayName: 'Products', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
  //   {
  //     name: 'Action', field: 'Action', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
  //     cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#/admin/campaign-closed-summary"><md-icon><i class="material-icons">remove_red_eye</i></md-icon></a></span></div>',
  //     enableFiltering: false,
  //   }
  // ];
  // $scope.msg = {};
  // $scope.gridClosed.onRegisterApi = function (gridApi) {
  //   //set gridApi on scope
  //   $scope.gridApi = gridApi;
  //   gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
  //     $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
  //     $scope.$apply();
  //   });
  // };
  // $http.get('fakedb/data.json').success(function (data) {
  //   for (i = 0; i < data.length; i++) {
  //     data[i].registered = new Date(data[i].registered);
  //   }
  //   $scope.gridClosed.data = data;
  // });


  // tables code start
  // var vm = $scope;
  // vm.limit = 10;
  // $scope.loadMore = function() {
  //   var increamented = vm.limit + 5;
  //   vm.limit = increamented > $scope.personalcampsdata.length ? $scope.personalcampsdata.length : increamented;
  // };
// tables code end
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

});
