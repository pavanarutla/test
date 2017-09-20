app.controller('companiesCtrl', function ($scope, $mdDialog, $http,CompanysService,toastr ) {

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
  $scope.companies = {}
  $scope.hoardingCompaniesList ={}

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
      cellTemplate: '<div class="ui-grid-cell-contents "><span ><md-button  class="md-icon-button"><md-icon><i class="material-icons">mode_edit</i> </md-button></span></div>',
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
      cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Finalized</md-button></md-menu-item><md-menu-item><md-button>Edit</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
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

    // Companies Functionolity

    //Services 
    
    CompanysService.getCompanyList().then(function(response){ 
      $scope.companiesList = response;
      console.log($scope.companiesList,'$scope.companiesList');
  })
  CompanysService.getHoardingList().then(function(response){
    $scope.hoardingCompaniesList = response;
    console.log($scope.hoardingCompaniesList,"hoardingCompaniesList");
  })


    $scope.cancel = function(){
      $mdDialog.cancel();
    }

  
    $scope.saveCompanies = function(){
     // $scope.companiesList = company;
      console.log($scope.companies,"companiesList");
      //alert("submited successfully",$scope.userData);
     // $mdDialog.cancel();
    // CompanysService.saveCompany
     toastr.success('You have successfully submiteed');
    }
    
    $scope.saveHoardingList = function(){
     // $scope.hoardingCompaniesList  = hoarding;
      console.log("$scope.hoardingCompanies", $scope.hoardingCompaniesList);
      toastr.success('You have successfully submiteed');
    }
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