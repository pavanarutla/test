app.controller('AdminRegistrationCtrl', function ($scope, $mdDialog, $http, $rootScope, $auth, toastr, AdminUserService) {

  $scope.msg = {};

  $scope.registrationPopup = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/registration-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  /*
  ==== checking if user has owner role ====
  */
  $scope.isUserOwner = _.indexOf(_.pluck($auth.getPayload().user.roles, "name"), "owner") != -1;
  /*
  ==== checking if user has owner role ends ====
  */

  /* 
  ==== Switching between user and agency pop up form ====
  */
  $scope.userChecked = true;

  $scope.showUser = function () {
    $scope.userChecked = true;    
  }
  $scope.showAgency = function () {
    $scope.userChecked = false;
  }
  /* 
  ==== Switching between user and agency pop up form ends ====
  */

  /* 
  ======== Users Grid ========
  */

  // $scope.gridUsers = {
  //   paginationPageSizes: [25, 50, 75],
  //   paginationPageSize: 10,
  //   enableCellEditOnFocus: false,
  //   multiSelect: false,
  //   enableFiltering: true,
  //   enableSorting: true,
  //   enableCellEdit: false,
  //   rowHeight: 45,
  //   showColumnMenu: false,
  //   enableGridMenu: true,
  //   enableRowSelection: true,
  //   enableRowHeaderSelection: false,
  // };
  // $scope.gridUsers.columnDefs = [
  //   { name: 'name', displayName: 'Name (editable)', width: '25%', enableCellEdit: false,
  //     cellTemplate: '<div>{{row.entity.first_name}} {{row.entity.last_name}}</div>'
  //   },
  //   { name: 'email', displayName: 'Email id (editable)', width: '20%' },
  //   { name: 'phone', displayName: 'Phone', type: 'number', width: '15%' },
  //   { name: 'company_name', displayName: 'Company(editable)', width: '15%' },
  //   { name: 'company_type', displayName: 'TypeofCompany(editable)', width: '15%' },
  //   {
  //     name: 'Action', field: 'Action', width: '10%',
  //     cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Edit</md-button></md-menu-item><md-menu-item ng-if="grid.appScope.isUserOwner && !row.entity.activated"><md-button ng-click="grid.appScope.activateUser(row.entity.id)">Activate</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
  //     enableFiltering: false,
  //   }
  // ];

  // $scope.gridUsers.onRegisterApi = function (gridApiUser) {
  //   set gridApi on scope
  //   $scope.gridApiUser = gridApiUser;
  //   gridApiUser.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
  //     $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
  //     $scope.$apply();
  //   });
  // };

  AdminUserService.getUsers().then(function (response) {    
   // $scope.gridUsers.data = response;
     $scope.userList = response;
     console.log($scope.userList);
  });

  /* 
  ======== Users Grid ends ========
  */


  /* 
  ======== Agency Grid ========
  */

  // $scope.gridAgency = {
  //   paginationPageSizes: [25, 50, 75],
  //   paginationPageSize: 25,
  //   enableCellEditOnFocus: false,
  //   multiSelect: false,
  //   enableCellEdit: false,
  //   rowHeight: 45,
  //   enableFiltering: true,
  //   enableSorting: true,
  //   showColumnMenu: false,
  //   enableGridMenu: true,
  //   enableRowSelection: true,
  //   enableRowHeaderSelection: false,
  // };
  
  // $scope.gridAgency.columnDefs = [
  //   { name: 'company_name', displayName: 'Ad Agency Name', width: '25%', enableCellEdit: false },
  //   { name: 'email', displayName: 'Email id (editable)', width: '25%' },
  //   { name: 'phone', displayName: 'Phone', type: 'number', width: '25%' },
  //   { name: 'company_type', displayName: 'TypeofCompany(editable)', width: '15%' },
  //   {
  //     name: 'Action', field: 'Action', width: '10%',
  //     cellTemplate: '<div class="ui-grid-cell-contents "><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Edit</md-button></md-menu-item><md-menu-item><md-button>Share</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
  //     enableFiltering: false,
  //   }
  // ];
 
  // $scope.gridAgency.onRegisterApi = function (gridApiAgencies) {
  //   set gridApi on scope
  //   $scope.gridApiAgencies = gridApiAgencies;
  //   gridApiAgencies.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
  //     $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
  //     $scope.$apply();
  //   });
  // };
  
  AdminUserService.getAgencies().then(function (response) {
    $scope.agencyList = response;
    console.log($scope.agencyList);
  });
$scope.Useredit = function(user){
  $scope.user = user;
  $mdDialog.show({
    templateUrl: 'views/admin/registration-popup.html',
    fullscreen: $scope.customFullscreen,
    clickOutsideToClose: true,
    preserveScope: true,
    scope: $scope
  });
};
  /* 
  ======== Agency Grid ends ========
  */


  /* 
  ======== Adding New User ========
  */
  $scope.addUser = function (user) {
    AdminUserService.saveUser($scope.user).then(function(result){
      if(result.status == 1){
        AdminUserService.getUsers().then(function (response) {    
          $scope.gridUsers.data = response;
        });
        $mdDialog.hide();
        toastr.success('User has been created successfully.');
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
  ======== Activating New User ========
  */
  $scope.activateUser = function(userMId){
    AdminUserService.activateUser(userMId).then(function(result){
      if(result.status == 1){
        AdminUserService.getUsers().then(function (response) {    
          $scope.gridUsers.data = response;
        });
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }
  /* 
  ======== Activating New User ends ========
  */

  /* 
  ======== Adding New Agency ========
  */
  $scope.addAgency = function (agency) {
    AdminUserService.saveAgency($scope.agency).then(function(result){
      if(result.status == 1){
        AdminUserService.getAgencies().then(function (response) {    
          $scope.ADDAgency = response;
        });
        $mdDialog.hide();
        toastr.success('Agency has been successfully created.');
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

  // tables code start
    var vm = $scope;
    vm.limit = 5;
    $scope.UserloadMore = function() {
      var increamented = vm.limit + 5;
      vm.limit = increamented > $scope.userList.length ? $scope.userList.length : increamented;
    };
  // tables code end
  // tables code start
  var vm = $scope;
  vm.limit = 5;
  $scope.AgencyloadMore = function() {
    var increamented = vm.limit + 5;
    vm.limit = increamented > $scope.agencyList.length ? $scope.agencyList.length : increamented;
  };
// tables code end  
});