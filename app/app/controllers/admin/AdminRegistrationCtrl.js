app.controller('AdminRegistrationCtrl', function ($scope, $mdDialog, $http, $rootScope, $auth, toastr, AdminUserService) {
console.log($auth.getPayload().user);
  $scope.msg = {};
  $rootScope.gridUsers = {};
  $scope.allPermissions = {};

 

  $scope.registrationPopup = function (ev,addType,popuptype) {

    $mdDialog.show({
      templateUrl: 'views/admin/adminregistration-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      controller: function($scope, $mdDialog, toastr, $rootScope){   
             $scope.current_user_id = $auth.getPayload().user.id;
             // alert( $scope.current_user_id);
             $scope.isUserOwner = _.indexOf(_.pluck($auth.getPayload().user.roles, "name"), "billboard") != -1;          
             $scope.emailDis = false;
             if(addType=='edit'){
               $scope.emailDis = true;  $scope.admin= ev;
             }
             
             //debugger;
             $scope.addUser = function (response) {
              var responseStatus = false;
               if(addType=='edit'){
                      AdminUserService.updateUserData(ev.id,response).then(function(result){
                       if(result.status == 1){
                        responseStatus = true;
                       AdminUserService.getAdmins().then(function (response) {    
                             $rootScope.gridAdmin.data = response;
                          });
                        $mdDialog.hide();
                        toastr.success('User has been updated successfully.');
                      }
                      else{
                        toastr.error(result.message);
                      }
                    });
                }
                else{
                     AdminUserService.saveUser(response).then(function(result){
                      if(result.status == 1){
                       responseStatus = true;
                       AdminUserService.getAdmins().then(function (response) {    
                             $rootScope.gridAdmin.data = response;
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
             
             /***** get permissions of admin **************/
              
              AdminUserService.getPermissions('admin').then(function (response) {
                $scope.defaultUserpermissions = response.data;
                for(var i = 0; i < $scope.defaultUserpermissions.length; i++) {
                  if(ev){
                    if(ev.permissions){
                         array1 = ev.permissions;
                         array1.forEach(function(element) {
                            if($scope.defaultUserpermissions[i].id == element.id){
                                 $scope.defaultUserpermissions[i].Selected = true;
                            }
                          });
                    }else  $scope.defaultUserpermissions[i].Selected = true;
                  } else  $scope.defaultUserpermissions[i].Selected = true;
               }

                $scope.$watch('defaultUserpermissions', function() {
                var no = 0;
                $scope.admin.permissionsList = [];
                for(var i = 0; i < $scope.defaultUserpermissions.length; i++) {
                    if($scope.defaultUserpermissions[i].Selected == 1){
                      no++;
                      if(no===$scope.defaultUserpermissions.length){
                        $scope.admin.userpermisions = 'default';
                      }else{
                        $scope.admin.userpermisions = 'manual';
                      }
                      $scope.admin.permissionsList.push($scope.defaultUserpermissions[i].id);
                    }
                        
                }
                 }, true);
              });
              /***** get permissions of admin ENDS **************/
            
      }
    })
  };

  

  /* 
  ======== Deleting User ========
  */
  $scope.deleteUser = function (userMongoid) {    
    AdminUserService.deleteUser(userMongoid).then(function(result){
      if(result.status == 1){
        AdminUserService.getAdmins().then(function (response) {    
          $rootScope.gridUsers.data = response;
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
        AdminUserService.getAdmins().then(function (response) {    
          $rootScope.gridUsers.data = response;
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

  

  $scope.cancel = function () {
    $mdDialog.cancel();
  }



/*
======== Admin Grid ========
  */

  $rootScope.gridAdmin = {
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
  
  $rootScope.gridAdmin.columnDefs = [
    { name: 'name', displayName: 'Full Name', enableCellEdit: false },
    { name: 'email', displayName: 'Email id ' },
    { name: 'phone', displayName: 'Phone', type: 'number' },
    { name: 'company_type', displayName: 'TypeofCompany' },
    { name: 'activated', displayName: 'Status' , cellTemplate: ' <button class="transparentbutton" ng-disabled="row.entity.activated" ng-click="grid.appScope.activateUser(row.entity.id);">{{row.entity.activated ? "Activated" : "Activate"}}</button>' },
    { name: 'Action', field: 'Action', cellTemplate: '<div class="ui-grid-cell-contents ">  <a  ng-click="grid.appScope.registrationPopup(row.entity,\'edit\',\'admin\')">Edit</a><button class="transparentbutton">Delete</button></div>', enableFiltering: false}
  ];
 
  AdminUserService.getAdmins().then(function (response) {
    $rootScope.gridAdmin.data = response;
  });

  /* 
  ======== owner Grid ends ========
  */
});