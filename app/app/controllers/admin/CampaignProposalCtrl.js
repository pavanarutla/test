app.controller('CampaignProposalCtrl', function ($scope, $mdDialog, $stateParams, CampaignService, AdminCampaignService) {

  if($stateParams.campaignId){
    var campaignId = $stateParams.campaignId;
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      console.log(result);
    });
  }

  $scope.gridCampaignProducts.columnDefs = [
    { name: 'created_by', displayName: 'Created By', enableCellEdit: false, width: '5%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'name', displayName: 'Campagin Name ', width: '15%', enableCellEdit: false, headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'user_full_name', displayName: 'Client Name', width: '15%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'user_phone', displayName: 'Client Contact', type: 'number', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'start_date', displayName: 'Start Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
      cellTemplate: '<div>{{ row.entity.start_date | dateify | date:"dd-MM-yyyy" }}</div>'
    },
    { name: 'end_date', displayName: 'End Date', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
      cellTemplate: '<div>{{ row.entity.end_date | dateify | date:"dd-MM-yyyy" }}</div>'
    },
    { name: 'status', displayName: 'Status', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
      cellTemplate: '<div>{{ row.entity.status | stringifyCampaignStatus }}</div>'
    },
    { name: 'est_budget', displayName: 'Estimated Budget', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', },
    { name: 'products', displayName: 'Products', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align', 
      cellTemplate: '<div>{{row.entity.products.length}}</div>'
    },
    {
      name: 'Action', field: 'Action', width: '10%', headerCellClass: 'grid-align', cellClass: 'grid-align',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a ng-href="#/admin/campaign-proposal-summary/{{row.entity.id}}" ng-click=""><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">share</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];

});
