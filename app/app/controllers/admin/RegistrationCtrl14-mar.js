app.controller('AdminRegistrationCtrl', function ($scope, $mdDialog, $http, $rootScope, $auth, toastr, AdminUserService) {

  $scope.msg = {};

  $scope.registrationPopup = function (ev) {
   // console.log(ev);
   // $scope.userData= ev;

    $mdDialog.show({
      templateUrl: 'views/admin/registration-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      controller: function($scope, $mdDialog, toastr){
        //alert("Hiiii");
            $scope.user= ev;
             console.log(ev);
               $scope.addUser = function (response) {
                  if(ev){
                        AdminUserService.updateUserData(ev.id,response).then(function(result){
                         console.log(result);
                      });
                    }
                  else{
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
              }
           
       /* $scope.FeedbackData = data;
        $scope.response = {};
        if(data.call_feedback){
           $scope.response.call_feedback = data.call_feedback;
        }
        if( $rootScope.mydataid == dataId){
           $scope.response.call_feedback = $rootScope.updated_feedback;
        }
        $scope.savefeedback = function(response){
          AdminContactService.updateCustomerData(dataId,response).then(function(result){
            if(result.status == 1){
              console.log(result);
              toastr.success(result.message);
              $("#feedbackButton"+dataId).css('background-color','limegreen');
              $rootScope.updated_feedback = result.data.call_feedback;
              $rootScope.mydataid = dataId;
              $mdDialog.hide();
            }
            else{
              toastr.error(result.message);
            }
          });
        }
        $scope.cancelFeedbackBox = function(){
          $mdDialog.hide();
        }*/
      }
    })
  };

  /*
  ==== checking if user has owner role ====
  */

  $scope.current_user_id = $auth.getPayload().user.id;
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

  $scope.gridUsers = {
    paginationPageSizes: [10,25, 50],
    paginationPageSize: 10,
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: false,
    enableSorting: false,
    showColumnMenu: false,
    enableGridMenu: false,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
     enableCellEdit: false,
  };
  $scope.gridUsers.columnDefs = [
    { name: 'name', displayName: 'Name ', width: '20%',
      cellTemplate: '<div>{{row.entity.first_name}} {{row.entity.last_name}}</div>'
    },
   
    { name: 'email', displayName: 'Email id ', width: '20%' },
    { name: 'phone', displayName: 'Phone', type: 'number', width: '10%' },
    { name: 'company_name', displayName: 'Company', width: '15%' },
    { name: 'company_type', displayName: 'TypeofCompany', width: '15%' },
     { name: 'activated', displayName: 'Status' , cellTemplate: 
' <button class="transparentbutton" ng-disabled="row.entity.activated" ng-click="grid.appScope.activateUser(row.entity.id);">{{row.entity.activated ? "Activated" : "Activate"}}</button>' },
    {
      name: 'Action', field: 'Action',
       cellTemplate: '<div class="ui-grid-cell-contents ">  <a  ng-click="grid.appScope.registrationPopup(row.entity)">Edit</a><button class="transparentbutton">Delete</button></div>',
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
     $scope.userList = response;
     console.log($scope.userList);
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
      cellTemplate: '<div class="ui-grid-cell-contents"><span > <md-menu><md-button ng-click="$mdOpenMenu($event)" class="md-icon-button"><md-icon><i class="material-icons">settings</i></md-icon> </md-button><md-menu-content><md-menu-item><md-button ng-href="#">Edit</md-button></md-menu-item><md-menu-item><md-button>Share</md-button></md-menu-item><md-menu-item><md-button>Delete</md-button></md-menu-item></md-menu-content</md-menu></span></div>',
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
  
  /* 
  ======== Adding New User ends ========
  */

  /* 
  ======== Deleting User ========
  */
  $scope.deleteUser = function (userMongoid) {    
    AdminUserService.deleteUser(userMongoid).then(function(result){
      if(result.status == 1){
        AdminUserService.getUsers().then(function (response) {    
          $scope.gridUsers.data = response;
        });
        $mdDialog.hide();
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }
  /* 
  ======== Deleting User ends ========
  */

  /* 
  ======== Activating New User ========
  */
  $scope.activateUser = function(userMId){
    console.log($scope.isUserOwner);
    if( $scope.isUserOwner){
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
    }else{
       toastr.error("You dont have authority to activate User");
    }
    
  }
  /* 
  ======== Activating New User ends ========
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
    $scope.loadMore = function() {
      var increamented = vm.limit + 5;
      vm.limit = increamented > $scope.userList.length ? $scope.userList.length : increamented;
    };
  // tables code end
});