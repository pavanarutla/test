app.controller('AdminLocationCtrl', function ($scope, $http, AdminLocationService, toastr) {
  
  $scope.countryList = [];
  $scope.stateListForCountry = [];
  $scope.cityListForState = [];

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
    { name: 'country_name', displayName: 'Country', enableCellEdit: false, width: '10%' },
    { name: 'state_name', displayName: 'State ', width: '10%', enableCellEdit: false },
    { name: 'city_name', displayName: 'City ', width: '10%' },
    { name: 'name', displayName: 'Area', width: '15%' },
    { name: 'pincode', displayName: 'Pincode', type: 'number', width: '15%' },
    { name: 'lat', displayName: 'Latitude', width: '15%' },
    { name: 'lng', displayName: 'Longitude', width: '15%' },
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
  AdminLocationService.getAllAreas().then(function (data) {
    $scope.gridLocation.data = data;
  });
  //location js end 

  //add country js start
  $scope.gridCountry = {
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridCountry.columnDefs = [
    { name: 'name', displayName: 'Country Name', enableCellEdit: false, width: '50%' },
    {
      name: 'Action', field: 'Action', width: '50%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
  $scope.gridCountry.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  AdminLocationService.getCountries().then(function (data) {
    $scope.countryList = data;
    $scope.gridCountry.data = data;
  });
  //add country js end

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
    { name: 'country_name', displayName:'Country', enableCellEdit: false, width: '33%' },
    { name: 'name', displayName: 'State ', width: '33%', enableCellEdit: false },
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
  AdminLocationService.getAllStates().then(function (data) {
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
    { name: 'country_name', displayName: 'Country', enableCellEdit: false, width: '25%' },
    { name: 'state_name', displayName: 'State', width: '25%', enableCellEdit: false },
    { name: 'name', displayName: 'City', width: '25%', enableCellEdit: false },
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
  AdminLocationService.getAllCities().then(function (data) {
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
    { name: 'country_name',  displayName: 'Country', enableCellEdit: false, width: '15%' },
    { name: 'state_name', displayName: 'State', width: '15%', enableCellEdit: false },
    { name: 'city_name', displayName: 'City', width: '15%', enableCellEdit: false },
    { name: 'name', displayName: 'Area', width: '15%', enableCellEdit: false },
    { name: 'pincode', displayName: 'Pincode', width: '10%', enableCellEdit: false },
    { name: 'lat', displayName: 'Latitude', width: '10%', enableCellEdit: false },
    { name: 'lng', displayName: 'Longitude', width: '10%', enableCellEdit: false },
    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a href="" ng-click="grid.appScope.deleteArea(row.entity)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
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
  AdminLocationService.getAllAreas().then(function (data) {
    $scope.gridArea.data = data;
  });
  //add area js end


  $scope.saveCountry = function () {
    AdminLocationService.saveCountry($scope.country.name).then(function (data) {
      if (data.status == 1) {
        toastr.success('Country added to database successfully!');
        AdminLocationService.getCountries().then(function (data) {
          $scope.gridCountry.data = data;
        });
      }
      else {
        toastr.error(data.message);
      }
    });
  }

  $scope.getStateList = function(country){
    AdminLocationService.getStates(country).then(function (data) {
      console.log(data);
      $scope.stateListForCountry = data;
    });
  }

  $scope.getCityList = function(state){
    AdminLocationService.getCities(state).then(function (data) {
      $scope.cityListForState = data;
    });
  }

  $scope.saveState = function () {
    AdminLocationService.saveState($scope.state).then(function (data) {
      if (data.status == 1) {
        toastr.success('State added to database successfully!');
        AdminLocationService.getAllStates().then(function (data) {
          $scope.gridState.data = data;
        });
      }
      else {
        toastr.error(data.message);
      }
    });
  }

  $scope.saveCity = function () {
    AdminLocationService.saveCity($scope.city).then(function (data) {
      if (data.status == 1) {
        toastr.success('City added to database successfully!');
        AdminLocationService.getAllCities().then(function (data) {
          $scope.gridCity.data = data;
        });
      }
      else {
        toastr.error(data.message);
      }
    });
  }

  $scope.saveArea = function () {
    AdminLocationService.saveArea($scope.area).then(function (data) {
      if (data.status == 1) {
        toastr.success('Area added to database successfully!');
        AdminLocationService.getAllAreas().then(function (data) {
          $scope.gridArea.data = data;
        });
      }
      else {
        toastr.error(data.message);
      }
    });
  }

  $scope.deleteArea = function(area){
    AdminLocationService.deleteArea(area.id).then(function(result){
      if(result.status == 1){
        var index = $scope.gridArea.data.indexOf(area);
        $scope.gridArea.data.splice(index, 1);
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

});