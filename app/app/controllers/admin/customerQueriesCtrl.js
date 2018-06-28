app.controller('customerQueriesCtrl', function ($scope, $http,AdminContactService,$mdDialog,toastr) {


  $scope.gridQueries  = {
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
    columnDefs : [
    { name: 'id', displayName: 'Sr.no', enableCellEdit: false, width: '5%', enableFiltering: false, cellTemplate: '<span>{{rowRenderIndex+1}}</span>', },
    { name: 'name', displayName: 'Name',  enableCellEdit: false },
    { name: 'email', displayName: 'Email Id',  enableCellEdit: false },
    { name: 'companyName', displayName: 'Company name',  enableCellEdit: false },
    { name: 'message', displayName: 'Message', enableCellEdit: false },

    { name: 'Action', field: 'Action', 
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-click=""><md-icon><i class="material-icons" id="feedbackButton{{row.entity.id}}" ng-style="row.entity.viewed && {\'color\':\'limegreen\'} " ng-click="grid.appScope.showConfirm(row.entity)">remove_red_eye</i></md-icon></a></span></div>',
      enableFiltering: false,
    }]
  };
  
 
    AdminContactService.userQuery().then(function (response) {    
      $scope.gridQueries.data = response.data;
      // console.log(response);
    });

  $scope.showConfirm = function(data) {
    var response = {};
    var dataId = data.id;
    if(data.viewed){
        $mdDialog.show(
          $mdDialog.alert()
          .title('Have you view this query?')
          .textContent('Message: '+data.message)
          .ok('Already viewed')
          .targetEvent(data)
        );
    }else{
           var confirm = $mdDialog.confirm()
          .title('Have you checked this query?')
          .textContent('Message: '+data.message)
          .targetEvent(data)
          .ok('Yes,its checked')
          .cancel('Not yet');
    
       $mdDialog.show(confirm).then(function() {      
        response.viewed = 'true';
        // console.log(response);
        AdminContactService.updateCustomerData(dataId,response).then(function(result){
                if(result.status == 1){
                  // console.log(result);
                  toastr.success(result.message);
                  $("#feedbackButton"+dataId).css('color','limegreen');
                  $mdDialog.hide();
                }
                else{
                  toastr.error(result.message);
                }
              });
        });
    }
   

  };


});