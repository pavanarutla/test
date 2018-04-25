app.controller('OwnerRegistrationCtrl', function ($scope, $mdDialog, $http, $rootScope, $auth, toastr, AdminUserService) {
console.log($auth.getPayload().user);
  $scope.msg = {};
  $rootScope.gridUsers = {};
  $scope.allPermissions = {};

 

  $scope.registrationPopup = function (ev,addType,popuptype) {

    $mdDialog.show({
      templateUrl: 'views/admin/ownerregistration-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      controller: function($scope, $mdDialog, toastr, $rootScope){   
           $scope.current_user_id = $auth.getPayload().user.id;
           // alert( $scope.current_user_id);                 
           $scope.emailDis = false;
           if(addType=='edit'){
             $scope.emailDis = true;
           }             
           //debugger;
           $scope.addUser = function (response) {
            var responseStatus = false;
             if(addType=='edit'){
                    AdminUserService.updateUserData(ev.id,response).then(function(result){
                     if(result.status == 1){
                      responseStatus = true;                       
                      AdminUserService.getOwners().then(function (response) {    
                         $rootScope.gridOwner.data = response;
                      });
                      $mdDialog.hide();
                      toastr.success('User has been updated successfully.');
                    }
                    else{
                      toastr.error(result.message);
                    }
                  });
              }else{
                  AdminUserService.saveUser(response).then(function(result){
                    if(result.status == 1){
                      responseStatus = true;                     
                      AdminUserService.getOwners().then(function (response) {    
                         $rootScope.gridOwner.data = response;
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
      }
    })
  };



  /* 
  ======== Deleting User ========
  */
  $scope.deleteUser = function (userMongoid) {    
    AdminUserService.deleteUser(userMongoid).then(function(result){
      if(result.status == 1){
        AdminUserService.getOwners().then(function (response) {    
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
        AdminUserService.getOwners().then(function (response) {    
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
  ======== owner Grid ========
  */

  $rootScope.gridOwner = {
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
  
  $rootScope.gridOwner.columnDefs = [
    { name: 'owner_name', displayName: 'Owner Name', enableCellEdit: false },
    { name: 'email', displayName: 'Email id ' },
    { name: 'phone', displayName: 'Phone', type: 'number' },
    { name: 'company_type', displayName: 'TypeofCompany' },
    { name: 'activated', displayName: 'Status' , cellTemplate: ' <button class="transparentbutton" ng-disabled="row.entity.activated" ng-click="grid.appScope.activateUser(row.entity.id);">{{row.entity.activated ? "Activated" : "Activate"}}</button>' },
    { name: 'Action', field: 'Action', cellTemplate: '<div class="ui-grid-cell-contents ">  <a  ng-click="grid.appScope.registrationPopup(row.entity,\'edit\',\'owner\')">Edit</a><button class="transparentbutton">Delete</button></div>', enableFiltering: false}
  ];
 
  AdminUserService.getOwners().then(function (response) {
    $rootScope.gridOwner.data = response;
  });

  /* 
  ======== owner Grid ends ========
  */


});