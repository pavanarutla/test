app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, AdminCampaignService) {

  // $scope.limit= 3;
  // $scope.loadMore = function() {
  //   $scope.limit = $scope.items.length;
  // };
  
  $scope.showAddCampaignPopup = function () {
    $mdDialog.show({
      templateUrl: 'views/admin/add-campaign.html',
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen,
    });
  };
  $scope.cancel = function(){
  $mdDialog.hide();
  };

  /*
  *========= campagin proposal(planned) grid =========
  */

  $scope.gridProposal = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridProposal.columnDefs = [
    { name: 'id', displayName: 'ID ', enableCellEdit: false, width: '5%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'campaignname', displayName: 'Campagin Name ', width: '15%', enableCellEdit: false, headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'clientname', displayName: 'Client Name', width: '15%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'clientcontent', displayName: 'Client Contact', type: 'number', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'startdate', displayName: 'Start Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'enddate', displayName: 'End Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'status', displayName: 'Status', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'price', displayName: 'Price', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'products', displayName: 'Products', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    {
      name: 'Action', field: 'Action', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#/admin/campaign-proposal-summary" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">share</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
  $scope.msg = {};
  $scope.gridProposal.onRegisterApi = function (gridApi) {
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  AdminCampaignService.getAllCampaignRequests().then(function(result){
    $scope.gridProposal.data = result;
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

});
