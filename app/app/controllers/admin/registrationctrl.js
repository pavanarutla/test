app.controller('registrationCtrl', function($scope,$mdDialog,$http) {

      $scope.registrationPopup = function (ev) {
        $mdDialog.show({
          templateUrl: 'views/admin/registration-popup.html',
          fullscreen: $scope.customFullscreen,
          clickOutsideToClose: true
        })
      };

       $scope.gridOptions = {  
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
       $scope.gridAgency = {  
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
       $scope.gridOptions.columnDefs = [
            { name: 'id', enableCellEdit: false, width: '5%' },
            { name: 'name', displayName: 'Name (editable)', width: '20%', enableCellEdit: false },
            { name: 'email', displayName: 'Email id (editable)', width: '20%' },
            { name: 'phone', displayName: 'Phone' , type: 'number', width: '15%' },
            { name: 'Company', displayName: 'Company(editable)' , width: '15%' },
            { name: 'typeofcompany', displayName: 'TypeofCompany(editable)' , width: '15%' },
            
            {
            name: 'Action', field: 'Action', width: '10%',
            cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Edit</md-button></md-menu-item><md-menu-item><md-button>Share</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
            enableFiltering: false,
                            }
        ];
        $scope.gridAgency.columnDefs = [
            { name: 'id', enableCellEdit: false, width: '10%' },
            { name: 'name', displayName: 'Ad Agency Name', width: '20%', enableCellEdit: false },
            { name: 'email', displayName: 'Email id (editable)', width: '25%' },
            { name: 'phone', displayName: 'Phone' , type: 'number', width: '20%' },
            { name: 'typeofcompany', displayName: 'TypeofCompany(editable)' , width: '15%' },
            
            {
            name: 'Action', field: 'Action', width: '10%',
            cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Edit</md-button></md-menu-item><md-menu-item><md-button>Share</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
            enableFiltering: false,
                            }
        ];

 $scope.msg = {};
 $scope.gridOptions.onRegisterApi = function(gridApi){
          //set gridApi on scope
          
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
          });
        };
 $scope.gridAgency.onRegisterApi = function(gridApi){
          //set gridApi on scope
          
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
          });
        };
        $http.get('fakedb/company.json')
    .success(function(data) {
      for(i = 0; i < data.length; i++){
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridOptions.data = data;
    });
      $http.get('fakedb/companyagency.json')
    .success(function(data) {
      for(i = 0; i < data.length; i++){
        data[i].registered = new Date(data[i].registered);
      }
      $scope.gridAgency.data = data;
    });
})

.filter('mapGender', function() {
  var genderHash = {
    1: 'male',
    2: 'female'
  };

  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})

.filter('mapStatus', function() {
  var genderHash = {
    1: 'Bachelor',
    2: 'Nubile',
    3: 'Married'
  };

  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})

.filter('address', function () {
  return function (input) {
      return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
  };
});