app.controller('UserRegistrationCtrl', function ($scope, $mdDialog, $http, $rootScope, $auth, toastr, AdminUserService) {
console.log($auth.getPayload().user);
  $scope.msg = {};
  $rootScope.gridUsers = {};
  $scope.allPermissions = {};

 

  $scope.registrationPopup = function (ev,addType,popuptype) {

    $mdDialog.show({
      templateUrl: 'views/admin/userregistration-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      controller: function($scope, $mdDialog, toastr, $rootScope){   
             $scope.user= {};  $scope.agency= {};   $scope.owner= {};   $scope.admin= {};
             $scope.current_user_id = $auth.getPayload().user.id;
             // alert( $scope.current_user_id);
             $scope.isUserOwner = _.indexOf(_.pluck($auth.getPayload().user.roles, "name"), "billboard") != -1;
            
             $scope.emailDis = false;
             if(addType=='edit'){
               $scope.emailDis = true; $scope.user= ev;  $scope.agency= ev;   $scope.owner= ev;   $scope.admin= ev;
             }
             
             //debugger;
             $scope.addUser = function (response) {
              var responseStatus = false;
               if(addType=='edit'){
                      AdminUserService.updateUserData(ev.id,response).then(function(result){
                       if(result.status == 1){
                        responseStatus = true;
                        
                          AdminUserService.getUsers().then(function (response) {    
                             $rootScope.gridUsers.data = response;
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
                       AdminUserService.getUsers().then(function (response) {    
                             $rootScope.gridUsers.data = response;
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
  ======== Users Grid ========
  */

  $rootScope.gridUsers = {
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
  $rootScope.gridUsers.columnDefs = [
    { name: 'name', displayName: 'Full Name ', width: '20%' },  
    { name: 'email', displayName: 'Email id ', width: '20%' },
    { name: 'phone', displayName: 'Phone', type: 'number', width: '10%' },
    { name: 'company_name', displayName: 'Company', width: '15%' },
    { name: 'company_type', displayName: 'TypeofCompany', width: '15%' },
    { name: 'activated', displayName: 'Status' , cellTemplate: ' <button class="transparentbutton" ng-disabled="row.entity.activated" ng-click="grid.appScope.activateUser(row.entity.id);">{{row.entity.activated ? "Activated" : "Activate"}}</button>' },
    { name: 'Action', field: 'Action', cellTemplate: '<div class="ui-grid-cell-contents ">  <a  ng-click="grid.appScope.registrationPopup(row.entity,\'edit\',\'user\')">Edit</a><button class="transparentbutton">Delete</button></div>', enableFiltering: false}
  ];


  AdminUserService.getUsers().then(function (response) {    
    $rootScope.gridUsers.data = response;
    

  });

  /* 
  ======== Users Grid ends ========
  */


  /* 
  ======== Deleting User ========
  */
  $scope.deleteUser = function (userMongoid) {    
    AdminUserService.deleteUser(userMongoid).then(function(result){
      if(result.status == 1){
        AdminUserService.getUsers().then(function (response) {    
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
        AdminUserService.getUsers().then(function (response) {    
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



});