app.controller('callCenterCtrl', function($scope,$http,toastr) {
    
       $scope.gridcallCenter = {  
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            enableCellEditOnFocus: false,
            multiSelect: false,
            enableCellEdit: false,
            rowHeight: 45,
            enableFiltering: true,
            enableSorting: true,
            showColumnMenu: false,
            enableGridMenu: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
       };
        
       $scope.gridcallCenter.columnDefs = [
            { name: 'id', displayName: 'Sr.no', enableCellEdit: false, width: '20%',enableFiltering: false,},
            { name: 'phonenumber', displayName: 'Phone Number', width: '40%', enableCellEdit: false },
           
            {
            name: 'Action', field: 'Action', width: '40%',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">remove_red_eye</i></md-icon></a></span><span><a href="" ng-click="grid.appScope.deleteCallCenterInfo(row.entity)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
            enableFiltering: false,
            }
        ];
      
 $scope.msg = {};
 $scope.gridcallCenter.onRegisterApi = function(gridApi){
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
      $scope.gridcallCenter.data = data;
    });

 //deleteCallCenterInfo

 $scope.deleteCallCenterInfo = function(row){
  var index = $scope.gridcallCenter.data.indexOf(row);
  $scope.gridcallCenter.data.splice(index, 1);
  toastr.success("CallCenterInfo deleted successfully");
 }
});