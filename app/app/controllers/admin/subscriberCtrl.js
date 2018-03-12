app.controller('subscriberCtrl', function ($scope, $http,AdminContactService,toastr) {


  $scope.gridSubscribers  = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    enableCellEditOnFocus: false,
    //multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
   // enableRowHeaderSelection: false,
  //{ name: 'id', displayName: 'Sr.no', enableCellEdit: false, width: '20%', enableFiltering: false, cellTemplate: '<span>{{rowRenderIndex+1}}</span>', },
    columnDefs : [
    { name: 'id', displayName: 'Id ', enableCellEdit: false, width: '20%', enableFiltering: false },
    { name: 'email', displayName: 'Email Id', width: '40%', enableCellEdit: false, enableFiltering: false },

    { name: 'Action', field: 'Action', width: '40%', enableCellEdit: false,
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-click=""><md-icon><i class="material-icons">remove_red_eye</i></md-icon></a></span></div>',
      enableFiltering: false,
    }],
    onRegisterApi: function(gridApi){ 
      $scope.gridApi = gridApi;
    },
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [10, 10, 10, 10]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500, 

  }; 
 
  AdminContactService.subscribe().then(function (response) {    
    $scope.gridSubscribers.data = response.data;
    console.log(response);
  });
   
  $scope.export = function(){
    if ($scope.export_format == 'csv') {
      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      $scope.gridApi.exporter.csvExport( $scope.export_row_type, $scope.export_column_type, myElement );
    }else if ($scope.export_format == 'pdf') {
      $scope.gridApi.exporter.pdfExport( $scope.export_row_type, $scope.export_column_type );
    }
  };


  $scope.selected_rows = function(){
    var response = {};
    var mySelectedRows = $scope.gridApi.selection.getSelectedRows();
    angular.forEach(mySelectedRows, function(value, key) {
      response.softdelete = 'true';
      AdminContactService.updateCustomerData(value.id,response).then(function(result){
        if(result.status == 1){
          console.log(result);
          var index = $scope.gridSubscribers.data.indexOf(value);
          $scope.gridSubscribers.data.splice(index, 1);
          toastr.success("CallCenterInfo deleted successfully");      
        }
        else{
          toastr.error(result.message);
        }
      });
      
    });
   
  };

  
});