app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, $stateParams, CampaignService, AdminCampaignService) {
  var vm = $scope;
  vm.limit = 5;
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

  $scope.gridPreLaunch = {
    paginationPageSizes: [25],
    paginationPageSize: 25,
    rowHeight: 45,
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableCellEdit: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridPreLaunch.columnDefs = [
    { name: 'created_by', displayName: 'Created By', enableCellEdit: false, width: '5%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
      cellTemplate: '<div>{{ row.entity.created_by }}, {{ row.entity.delegated_to | PickFirst2Letters }}</div>'
    },
    { name: 'name', displayName: 'Campagin Name ', width: '15%', enableCellEdit: false, headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'user_full_name', displayName: 'Client Name', width: '15%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'user_phone', displayName: 'Client Contact', type: 'number', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'start_date', displayName: 'Start Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
      cellTemplate: '<div>{{ row.entity.start_date | dateify | date:"dd-MM-yyyy" }}</div>'
    },
    { name: 'end_date', displayName: 'End Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
      cellTemplate: '<div>{{ row.entity.end_date | dateify | date:"dd-MM-yyyy" }}</div>'
    },
    { name: 'status', displayName: 'Status', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
      cellTemplate: '<div>{{ row.entity.status | stringifyCampaignStatus }}</div>'
    },
    { name: 'est_budget', displayName: 'Estimated Budget', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'products', displayName: 'Products', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
      cellTemplate: '<div>{{row.entity.products.length}}</div>'
    },
    {
      name: 'Action', field: 'Action', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#/admin/campaign-proposal-summary/{{row.entity.id}}" ng-click="" ng-if="row.entity.status != 0"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">share</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
  $scope.msg = {};
  $scope.gridPreLaunch.onRegisterApi = function (gridApi) {
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  AdminCampaignService.getAllCampaigns().then(function(result){
    //$scope.gridPreLaunch.data = result;
     $scope.personalcampsdata = result;
  });

  /*
  *========= campagin proposal(planned) grid ends =========
  */

  //campagin running grid

  $scope.gridRunning = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableCellEdit: false,
    rowHeight: 45,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridRunning.columnDefs = [
    { name: 'id', displayName: 'ID ', enableCellEdit: false, width: '5%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'campaignname', displayName: 'Campagin Name ', width: '15%', enableCellEdit: false, headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'clientname', displayName: 'Client Name', width: '15%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'clientcontent', displayName: 'Client Contact', type: 'number', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'startdate', displayName: 'Start Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'enddate', displayName: 'End Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'Runningstatus', displayName: 'Status', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'price', displayName: 'Price', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'products', displayName: 'Products', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    {
      name: 'Action', field: 'Action', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#/admin/campaign-running-summary"><md-icon><i class="material-icons">remove_red_eye</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">share</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
  $scope.msg = {};
  $scope.gridRunning.onRegisterApi = function (gridApi) {
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  // $http.get('fakedb/data.json').success(function (data) {
  //   for (i = 0; i < data.length; i++) {
  //     data[i].registered = new Date(data[i].registered);
  //   }
  //   $scope.gridRunning.data = data;
  // });

  // campagin Closed grid

  $scope.gridClosed = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    enableCellEdit: false,
    rowHeight: 45,
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridClosed.columnDefs = [
    { name: 'id', displayName: 'ID ', enableCellEdit: false, width: '5%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'campaignname', displayName: 'Campagin Name ', width: '15%', enableCellEdit: false, headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'clientname', displayName: 'Client Name', width: '15%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'clientcontent', displayName: 'Client Contact', type: 'number', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'startdate', displayName: 'Start Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'enddate', displayName: 'End Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'Closedstatus', displayName: 'Status', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'price', displayName: 'Price', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'products', displayName: 'Products', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    {
      name: 'Action', field: 'Action', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#/admin/campaign-closed-summary"><md-icon><i class="material-icons">remove_red_eye</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
  $scope.msg = {};
  $scope.gridClosed.onRegisterApi = function (gridApi) {
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  // $http.get('fakedb/data.json').success(function (data) {
  //   for (i = 0; i < data.length; i++) {
  //     data[i].registered = new Date(data[i].registered);
  //   }
  //   $scope.gridClosed.data = data;
  // });


  // tables code start
  var vm = $scope;
  vm.limit = 10;
  $scope.loadMore = function() {
    var increamented = vm.limit + 5;
    vm.limit = increamented > $scope.personalcampsdata.length ? $scope.personalcampsdata.length : increamented;
  };
// tables code end

});
