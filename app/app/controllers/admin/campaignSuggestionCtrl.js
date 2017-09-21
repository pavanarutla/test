app.controller('campaignSuggestionCtrl', function($scope,$mdDialog,$http) {

    $scope.viewImage = function () { 
    $mdDialog.show({
      templateUrl: 'views/admin/viewimage.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
  $scope.setPrice = function () { 
    $mdDialog.show({
      templateUrl: 'views/admin/setpricepopup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
   $scope.showPaymentdailog = function () { 
    $mdDialog.show({
      templateUrl: 'views/updatepaymentDailog.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

          // campagin Closed grid

        $scope.gridProposalSummary = {  
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
             rowHeight: 60,
       };
       $scope.gridProposalSummary.columnDefs = [
            { name: 'id',displayName: 'ID ', enableCellEdit: false, width: '5%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
            { name: 'type', displayName: 'Type ', width: '15%', enableCellEdit: false,headerCellClass: 'grid-align',cellClass: 'grid-align', },
            { name: 'area', displayName: 'Area', width: '15%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
            { name: 'size', displayName: 'Size' , type: 'number', width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
            { name: 'light', displayName: 'Lighting' , width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
            { name: 'sdate', displayName: 'Start Date' , width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
            { name: 'edate', displayName: 'End Date' , width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
            {
            name: 'View',displayName: 'Image ', field: 'Action', width: '7%',headerCellClass: 'grid-align',cellClass: 'grid-align',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><md-button  ng-click="grid.appScope.viewImage()" class="md-icon-button"><md-icon><i class="material-icons">remove_red_eye</i></md-icon></md-button></span></div>',
            enableFiltering: false,
            },

             {
            name: 'SetPrice',displayName: 'Price', field: 'Action', width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><md-button  ng-click="grid.appScope.setPrice()">SetPrice</md-button></span></div>',
            enableFiltering: false,
            },            
            {
            name: 'Action', field: 'Action', width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#"><md-icon><i class="material-icons">edit</i></md-icon></a></span><span><a ng-href="#"><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a ng-href="#"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
            enableFiltering: false,
                            }
        ];
        $scope.msg = {};
        $scope.gridProposalSummary.onRegisterApi = function(gridApi){
          //set gridApi on scope
          
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
          });
        };
        $http.get('fakedb/hoardingitem.json')
        .success(function(data) {
        for(i = 0; i < data.length; i++){
          data[i].registered = new Date(data[i].registered);
        }
          $scope.gridProposalSummary.data = data;
        });
   
});