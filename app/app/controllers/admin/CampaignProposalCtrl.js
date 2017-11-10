app.controller('CampaignProposalCtrl', function ($scope, $mdDialog, $stateParams, CampaignService, AdminCampaignService) {

  if($stateParams.campaignId){
    var campaignId = $stateParams.campaignId;
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      $scope.campaignDetails = result;
      $scope.gridCampaignProducts.data = result.products;
    });
  }

  $scope.gridCampaignProducts = {  
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
  $scope.gridCampaignProducts.columnDefs = [
    // { name: 'id',displayName: 'ID ', enableCellEdit: false, width: '5%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
    { name: 'format_name', displayName: 'Type ', width: '15%', enableCellEdit: false,headerCellClass: 'grid-align',cellClass: 'grid-align', },
    { name: 'area_name', displayName: 'Area', width: '15%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
    { name: 'panelSize', displayName: 'Size' , type: 'number', width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align', },
    { name: 'lighting', displayName: 'Lighting' , width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align', 
      cellTemplate: '<div>{{row.entity.lighting | boolToYesNo}}</div>',
    },
    { name: 'from_date', displayName: 'Start Date' , width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align', 
      cellTemplate: '<div>{{ row.entity.from_date | dateify | date:"dd-MM-yyyy" }}</div>'
    },
    { name: 'to_date', displayName: 'End Date' , width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align', 
      cellTemplate: '<div>{{ row.entity.to_date | dateify | date:"dd-MM-yyyy" }}</div>'
    },
    {
      name: 'View',displayName: 'Image ', field: 'Action', width: '7%',headerCellClass: 'grid-align',cellClass: 'grid-align',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><md-button ng-click="grid.appScope.viewImage()" class="md-icon-button"><md-icon><i class="material-icons">remove_red_eye</i></md-icon></md-button></span></div>',
      enableFiltering: false,
    },

    {
      name: 'price',displayName: 'Price', field: 'Action', width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align',
      // cellTemplate: '<div class="ui-grid-cell-contents"><span><md-button  ng-click="grid.appScope.setPrice()">SetPrice</md-button></span></div>',
      enableFiltering: false,
    },            
    {
      name: 'Action', field: 'Action', width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#"><md-icon><i class="material-icons">edit</i></md-icon></a></span><span><a ng-href="#"><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a ng-href="#"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
  $scope.msg = {};
  $scope.gridCampaignProducts.onRegisterApi = function(gridApi){
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
      $scope.$apply();
    });
  };

});
