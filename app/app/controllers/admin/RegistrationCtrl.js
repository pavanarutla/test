app.controller('RegistrationCtrl', function ($scope, $mdDialog, $http, toastr, AdminUserService) {

  $scope.msg = {};

  $scope.registrationPopup = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/registration-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  /* 
  ==== Switching between user and agency pop up form ====
  */
  $scope.usersFormVisible = true;
  $scope.userChecked = true;

  $scope.showUser = function () {
    $scope.userChecked = true;
    $scope.usersFormVisible = true;
  }
  $scope.showAgency = function () {
    $scope.userChecked = false;
    $scope.usersFormVisible = false;
  }
  /* 
  ==== Switching between user and agency pop up form ends ====
  */

  /* 
  ======== Users Grid ========
  */

  $scope.gridUsers = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 10,
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };
  $scope.gridUsers.columnDefs = [
    { name: 'name', displayName: 'Name (editable)', width: '25%', enableCellEdit: false,
      cellTemplate: '<div>{{row.entity.first_name}} {{row.entity.last_name}}</div>'
    },
    { name: 'email', displayName: 'Email id (editable)', width: '20%' },
    { name: 'phone', displayName: 'Phone', type: 'number', width: '15%' },
    { name: 'company_name', displayName: 'Company(editable)', width: '15%' },
    { name: 'company_type', displayName: 'TypeofCompany(editable)', width: '15%' },
    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Edit</md-button></md-menu-item><md-menu-item><md-button>Share</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
      enableFiltering: false,
    }
  ];

  $scope.gridUsers.onRegisterApi = function (gridApiUser) {
    //set gridApi on scope
    $scope.gridApiUser = gridApiUser;
    gridApiUser.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };

  AdminUserService.getUsers().then(function (response) {    
    $scope.gridUsers.data = response;
  });

  /* 
  ======== Users Grid ends ========
  */


  /* 
  ======== Agency Grid ========
  */

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
  
  $scope.gridAgency.columnDefs = [
    { name: 'company_name', displayName: 'Ad Agency Name', width: '25%', enableCellEdit: false },
    { name: 'email', displayName: 'Email id (editable)', width: '25%' },
    { name: 'phone', displayName: 'Phone', type: 'number', width: '25%' },
    { name: 'company_type', displayName: 'TypeofCompany(editable)', width: '15%' },
    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Edit</md-button></md-menu-item><md-menu-item><md-button>Share</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
      enableFiltering: false,
    }
  ];
 
  $scope.gridAgency.onRegisterApi = function (gridApiAgencies) {
    //set gridApi on scope
    $scope.gridApiAgencies = gridApiAgencies;
    gridApiAgencies.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  
  AdminUserService.getAgencies().then(function (response) {
    $scope.gridAgency.data = response;
  });

  /* 
  ======== Agency Grid ends ========
  */


  /* 
  ======== Adding New User ========
  */
  $scope.addUser = function () {
    AdminUserService.saveUser($scope.user).then(function(result){
      if(result.status == 1){
        AdminUserService.getUsers().then(function (response) {    
          $scope.gridUsers.data = response;
        });
        toastr.success('You have successfully submiteed');
      }
      else{
        toastr.error(result.message);
      }
    });
  }
  /* 
  ======== Adding New User ends ========
  */

  /* 
  ======== Adding New Agency ========
  */
  $scope.addAgency = function () {
    AdminUserService.saveAgency($scope.agency).then(function(result){
      if(result.status == 1){
        AdminUserService.getAgencies().then(function (response) {    
          $scope.gridAgency.data = response;
        });
        toastr.success('You have successfully submiteed');
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  /* 
  ======== Adding New Agency ends========
  */

  $scope.cancel = function () {
    $mdDialog.cancel();
  }

});