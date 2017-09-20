app.controller('companiesCtrl', function ($scope, $mdDialog, $http) {

  $scope.companiesPopup = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/companies-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
  $scope.hoardingCompanies = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/hoardingcompanies-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  $scope.gridCompany = {
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
  $scope.gridHoardingCompany = {
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
  $scope.gridCompany.columnDefs = [
    { name: 'Company Name', enableCellEdit: false, width: '15%' },
    { name: 'clienttype', displayName: 'Client Type ', width: '15%', enableCellEdit: false },
    { name: 'personname', displayName: 'Person Name ', width: '20%' },
    { name: 'email', displayName: 'Email', width: '15%' },
    { name: 'phone', displayName: 'Phone', type: 'number', width: '15%' },
    { name: 'adders', displayName: 'Address', width: '15%' },

    {
      name: 'Action', field: 'Action', width: '5%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
  $scope.gridHoardingCompany.columnDefs = [
    { name: 'id', displayName: 'S.NO', enableCellEdit: false, width: '5%' },
    { name: 'name', displayName: 'Comapny Name', width: '15%', enableCellEdit: false },
    { name: 'ownername', displayName: 'Owner Name', width: '20%', enableCellEdit: false },
    { name: 'email', displayName: 'Email id (editable)', width: '20%' },
    { name: 'phone', displayName: 'Phone', type: 'number', width: '20%' },
    { name: 'hoardinglist', displayName: 'List fo hoarding', width: '10%' },
    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
   
  ];

  $scope.msg = {};
  $scope.gridCompany.onRegisterApi = function (gridApi) {


    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };

  $scope.gridHoardingCompany.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };

  $http.get('fakedb/company.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridCompany.data = data;
    });

  $http.get('fakedb/companyagency.json')
    .success(function (data) {
      for (i = 0; i < data.length; i++) {
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridHoardingCompany.data = data;
    });
})

// .filter('mapGender', function() {
//   var genderHash = {
//     1: 'male',
//     2: 'female'
//   };

//   return function(input) {
//     if (!input){
//       return '';
//     } else {
//       return genderHash[input];
//     }
//   };
// })

// .filter('mapStatus', function() {
//   var genderHash = {
//     1: 'Bachelor',
//     2: 'Nubile',
//     3: 'Married'
//   };

//   return function(input) {
//     if (!input){
//       return '';
//     } else {
//       return genderHash[input];
//     }
//   };
// })

// .filter('address', function () {
//   return function (input) {
//       return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
//   };
// });