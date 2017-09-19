app.controller('adminLocationCtrl', function ($scope, $http) {
  //location js start
  $scope.gridLocation = {
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

  $scope.gridLocation.columnDefs = [
    { name: 'countery', enableCellEdit: false, width: '10%' },
    { name: 'state', displayName: 'State ', width: '10%', enableCellEdit: false },
    { name: 'city', displayName: 'City ', width: '10%' },
    { name: 'area', displayName: 'area', width: '15%' },
    { name: 'pincode', displayName: 'Pincode', type: 'number', width: '15%' },
    { name: 'longitude', displayName: 'Longitude', width: '15%' },
    { name: 'latitude', displayName: 'Latitude', width: '15%' },
    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
$scope.msg = {};
 
  $scope.gridLocation.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
$http.get('fakedb/companyagency.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridLocation.data = data;
    });

    //location js end 
    //add countery js start
 $scope.gridCountery = {
  
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridCountery.columnDefs = [
    { name: 'Countery', enableCellEdit: false, width: '50%' },
    {
      name: 'Action', field: 'Action', width: '50%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];

  
    $scope.gridCountery.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  $http.get('fakedb/companyagency.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridCountery.data = data;
    });
  //add countery js end
  //add state js start
    $scope.gridState = {
  
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridState.columnDefs = [
    { name: 'Countery', enableCellEdit: false, width: '33%' },
    { name: 'state', displayName: 'State ', width: '33%', enableCellEdit: false },
    {
      name: 'Action', field: 'Action', width: '33%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];

  
    $scope.gridState.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  $http.get('fakedb/companyagency.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridState.data = data;
    });

  //add state js end
  //add city js start
  $scope.gridCity = {
  
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridCity.columnDefs = [
    { name: 'Countery', enableCellEdit: false, width: '25%' },
    { name: 'state', displayName: 'State ', width: '25%', enableCellEdit: false },
    { name: 'city', displayName: 'City ', width: '25%', enableCellEdit: false },
    {
      name: 'Action', field: 'Action', width: '25%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];

  
    $scope.gridCity.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  $http.get('fakedb/companyagency.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridCity.data = data;
    });
  //add city js end
  //add area js start
    $scope.gridArea = {
  
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridArea.columnDefs = [
    { name: 'Countery', enableCellEdit: false, width: '15%' },
    { name: 'state', displayName: 'State ', width: '15%', enableCellEdit: false },
    { name: 'city', displayName: 'City ', width: '15%', enableCellEdit: false },
    { name: 'area', displayName: 'Area ', width: '15%', enableCellEdit: false },
    { name: 'pincode', displayName: 'Pincode', width: '10%', enableCellEdit: false },
    { name: 'latitude', displayName: 'Latitude', width: '10%', enableCellEdit: false },
    { name: 'longitude', displayName: 'Longitude', width: '10%', enableCellEdit: false },
    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];

  
    $scope.gridArea.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  $http.get('fakedb/companyagency.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridArea.data = data;
    });
  //add area js end
})

