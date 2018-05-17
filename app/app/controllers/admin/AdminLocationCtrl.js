app.controller('AdminLocationCtrl', function ($scope, $http, AdminLocationService, toastr) {

  $scope.countryList = [];
  $scope.stateListForCountry = [];
  $scope.cityListForState = [];

  /*===================
  | Pagination
  ===================*/
  $scope.pagination = {};
  $scope.pagination.pageNo = 1;
  $scope.pagination.pageSize = 15;
  $scope.pagination.pageCount = 0;
  var pageLinks = 20;
  var lowest = 1;
  var highest = lowest + pageLinks - 1;
  function createPageLinks(){
    var mid = Math.ceil(pageLinks/2);
    if($scope.pagination.pageCount < $scope.pagination.pageSize){
      lowest = 1;
    }
    else if($scope.pagination.pageNo >= ($scope.pagination.pageCount - mid) && $scope.pagination.pageNo <= $scope.pagination.pageCount){
      lowest = $scope.pagination.pageCount - pageLinks;
    }
    else if($scope.pagination.pageNo > 0 && $scope.pagination.pageNo <= pageLinks/2){
      lowest = 1;
    }
    else{
      lowest = $scope.pagination.pageNo - mid + 1;
    }
    highest = $scope.pagination.pageCount < $scope.pagination.pageSize ? $scope.pagination.pageCount : lowest + pageLinks;
    $scope.pagination.pageArray = _.range(lowest, highest);
    console.log($scope.pagination.pageArray);
  }

  /*===================
  | Pagination Ends
  ===================*/
  $scope.getAllAreas = function(){
    // console.log($scope.pagination.pageNo, $scope.pagination.pageSize);
    AdminLocationService.getAllAreas($scope.pagination.pageNo, $scope.pagination.pageSize).then(function (data) {
      $scope.areas = data.areas;
      $scope.pagination.pageCount = data.page_count;
      createPageLinks();
    });
  }
  $scope.getAllAreas();
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
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a  style="cursor: pointer;" ng-href="" ng-click="grid.appScope.editCountry(row.entity)"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a style="cursor: pointer;" ng-href=""  ng-click="grid.appScope.deleteCountry(row.entity)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
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
    $scope.countrtList=data;
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
    { name: 'country_name', displayName: 'Country', enableCellEdit: false, width: '33%' },
    { name: 'name', displayName: 'State ', width: '33%', enableCellEdit: false },
    {
      name: 'Action', field: 'Action', width: '33%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a  style="cursor: pointer;" ng-href="" ng-click="grid.appScope.editState(row.entity)"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a style="cursor: pointer;" ng-href=""  ng-click="grid.appScope.deleteState(row.entity)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
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
    $scope.stateList= data;
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
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a style="cursor: pointer;" ng-href="" ng-click="grid.appScope.editCity(row.entity)"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a style="cursor: pointer;" ng-href=""  ng-click="grid.appScope.deleteCity(row.entity)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
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
    $scope.citylocationdata =data;
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
    { name: 'country_name', displayName: 'Country', enableCellEdit: false, width: '15%' },
    { name: 'state_name', displayName: 'State', width: '15%', enableCellEdit: false },
    { name: 'city_name', displayName: 'City', width: '15%', enableCellEdit: false },
    { name: 'name', displayName: 'Area', width: '15%', enableCellEdit: false },
    { name: 'pincode', displayName: 'Pincode', width: '10%', enableCellEdit: false },
    { name: 'lat', displayName: 'Latitude', width: '10%', enableCellEdit: false },
    { name: 'lng', displayName: 'Longitude', width: '10%', enableCellEdit: false },
    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="" ng-click="grid.appScope.editArea(row.entity)" style="cursor:pointer;"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a style="cursor: pointer;" ng-href="" ng-click="grid.appScope.deleteArea(row.entity)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
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
          $scope.saveCountryErrors = null;
          $scope.country.name = null;
        });
      }
      else if(data.status == 0){
        $scope.saveCountryErrors = data.message;
      }
    });
  }

  $scope.deleteCountry = function (country) {
    AdminLocationService.deleteCountry(country.id).then(function (result) {
      if (result.status == 1) {
        var index = $scope.gridCountry.data.indexOf(country);
        $scope.gridCountry.data.splice(index, 1);
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }
  $scope.editCountry = function (country) {
    $scope.country = country;
  }

  $scope.getStateList = function (country) {
    AdminLocationService.getStates(country).then(function (data) {
      // console.log(data);
      $scope.stateListForCountry = data;
    });
  }

  $scope.getCityList = function (state) {
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
          $scope.stateErrors.errorMsg = null;
          $scope.state = undefined;
        });
      }
      else if(data.status == 0) {
        $scope.stateErrors ={
          errorMsg : data.message
        } 
      }
    });
  }

  $scope.deleteState = function (state) {
    AdminLocationService.deleteState(state.id).then(function (result) {
      if (result.status == 1) {
        var index = $scope.gridState.data.indexOf(state);
        $scope.gridState.data.splice(index, 1);
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  $scope.editState = function (state) {
    $scope.state = {};
    $scope.state.country_id = state.country_id;
    $scope.state.state_name = state.name;
    // console.log(state);
  }

  $scope.saveCity = function () {
    AdminLocationService.saveCity($scope.city).then(function (data) {
      if (data.status == 1) {
        toastr.success('City added to database successfully!');
        AdminLocationService.getAllCities().then(function (data) {
          $scope.gridCity.data = data;
          $scope.cityErrors = null;
        });
      }   
      else if(data.status == 0){
        $scope.cityErrors = data.message;
      }
    });
  }

  $scope.deleteCity = function (city) {
    AdminLocationService.deleteCity(city.id).then(function (result) {
      if (result.status == 1) {
        var index = $scope.gridCity.data.indexOf(city);
        $scope.gridCity.data.splice(index, 1);
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }
  $scope.editCity = function (city) {
    $scope.city = {};
    $scope.city.country_id = city.country_id;
    $scope.city.state_id = city.state_id;
    $scope.city.city_name = city.name;
    $scope.city.country_id = null;
    $scope.city.state_id = null;
    // console.log(city);
  }

  $scope.saveArea = function () {
    AdminLocationService.saveArea($scope.area).then(function (data) {
      if (data.status == 1) {
        toastr.success('Area added to database successfully!');
        AdminLocationService.getAllAreas().then(function (data) {
          $scope.gridArea.data = data;
          $scope.areaErrors = null;
        });
      }
      else if(data.status == 0){
        $scope.areaErrors = data.message;
      }
    });
  }

  $scope.editArea = function (area) {
    $scope.area = area;
    $scope.area.state_id = null;
    $scope.area.city_id = null;
    $scope.area.area_name = area.name;
  }

  $scope.deleteArea = function (area) {
    AdminLocationService.deleteArea(area.id).then(function (result) {
      if (result.status == 1) {
        var index = $scope.gridArea.data.indexOf(area);
        $scope.gridArea.data.splice(index, 1);
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }
  $scope.editArea = function (area) {
    $scope.area = {};
    $scope.area = area;
    $scope.area.area_name = area.name;
    $scope.area.country_id = null;
    $scope.area.state_id = null;
    $scope.area.city_id = null;
    // console.log(area);
  }

  $scope.resetAreaForm = function () {
    $scope.area = {};
  }

  // tables cod load more e start
    var vm = $scope;
    vm.limit = 5;
    $scope.loadMore = function() {
      var increamented = vm.limit + 5;
      vm.limit = increamented > $scope.listoflocationdata.length ? $scope.listoflocationdata.length : increamented;
    };
  // tables code end 
   // tables cod load more e start
    var mv = $scope;
    mv.limit = 5;
    $scope.loadMore = function() {
      var increamented = vm.limit + 5;
      mv.limit = increamented > $scope.stateList.length ? $scope.stateList.length : increamented;
    };
  // tables code end
  // tables city start
  var lc = $scope;
    lc.limit = 5;
    $scope.loadMore = function() {
      var increamented = vm.limit + 5;
      lc.limit = increamented > $scope.citylocationdata.length ? $scope.citylocationdata.length : increamented;
    };
  // tables city end

});