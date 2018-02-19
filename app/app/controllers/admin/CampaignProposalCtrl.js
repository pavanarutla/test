app.controller('CampaignProposalCtrl', function ($scope, $mdDialog, $stateParams,$mdSidenav, $location, CampaignService, AdminCampaignService, config, toastr) {

  function loadCampaignData(campaignId){    
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      $scope.campaignDetails = result;
      $scope.gridCampaignProducts.data = result.products;
      if(result.status > 7){
        loadCampaignPayments(campaignId);
      }
    });
  }

  function loadCampaignPayments(campaignId){
    if($scope.campaignDetails.status >= 7 ){
      AdminCampaignService.getCampaignPaymentDetails(campaignId).then(function(result){
        $scope.campaignPayments = result;
      });
    }
    else{
      toastr.error('Payments are only available for running or stopped campaigns.');
    }
  }

  if($stateParams.campaignId){
    var campaignId = $stateParams.campaignId;
    loadCampaignData(campaignId);
  }
  // if(!localStorage.campaignForSuggestion){
  //   toastr.error("Choose a campaign first.");
  //   $location.path('/admin/campaign');
  // }

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
      cellTemplate: '<div class="ui-grid-cell-contents"><span><md-button ng-click="grid.appScope.viewProductImage(row.entity.image)" class="md-icon-button"><md-icon><i class="material-icons">remove_red_eye</i></md-icon></md-button></span></div>',
      enableFiltering: false,
    },

    {
      name: 'price', displayName: 'Price', width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align',
      // cellTemplate: '<div class="ui-grid-cell-contents"><span><md-button  ng-click="grid.appScope.setPrice()">SetPrice</md-button></span></div>',
      enableFiltering: false,
    },            
    {
      name: 'Action', field: 'Action', width: '10%',headerCellClass: 'grid-align',cellClass: 'grid-align',
      cellTemplate: `
        <div class="ui-grid-cell-contents" ng-if="grid.appScope.campaignDetails.status < 4 || grid.appScope.campaignDetails.status == 5">
          <span>
            <a ng-click="grid.appScope.editProposedProduct(row.entity.id, row.entity.from_date, row.entity.to_date, row.entity.price)" style="cursor:pointer;">
              <md-icon><i class="material-icons">edit</i></md-icon>
            </a>
          </span>
          <span>
            <a ng-href="#"><md-icon><i class="material-icons">done</i></md-icon></a>
          </span>
          <span>
            <a ng-href="#"><md-icon><i class="material-icons">delete</i></md-icon></a>
          </span>
        </div>`,
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

  $scope.addNewProductToCampaign = function(){
    localStorage.campaignForSuggestion = JSON.stringify($scope.campaignDetails);
    $location.path('/admin/suggest-products');
  }

  $scope.viewProductImage = function(image){
    var imagePath = config.serverUrl + image;
    $mdDialog.show({
      locals:{ src: imagePath },
      templateUrl: 'views/image-popup-large.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, src){
        $scope.img_src = src;
      }
    });
  }

  $scope.editProposedProduct = function(productId, from_date, to_date, price){
    var productObj = {
      id: productId,
      from_date: from_date,
      to_date: to_date,
      price: price
    };
    $mdDialog.show({
      locals:{ campaignId: $scope.campaignDetails.id, productObj : productObj, ctrlScope : $scope },
      templateUrl: 'views/admin/edit-proposed-product.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, $mdDialog, CampaignService, AdminCampaignService, ctrlScope, campaignId, productObj){
        $scope.product = productObj;
        $scope.updateProposedProduct = function(product){
          AdminCampaignService.updateProposedProduct(campaignId, $scope.product).then(function(result){
            if(result.status == 1){
              // update succeeded. update the grid now.
              CampaignService.getCampaignWithProducts(campaignId).then(function(result){
                ctrlScope.campaignDetails = result;
                ctrlScope.gridCampaignProducts.data = result.products;
                $mdDialog.hide();
              });
              toastr.success(result.message);
            }
            else{
              toastr.error(result.message);
            }
          });
        }

        $scope.cancel = function(){
          $mdDialog.hide();
        }
      }
    });
  }

  $scope.finalizeCampaign = function(){
    if($scope.campaignDetails.act_budget > $scope.campaignDetails.exp_budget){
      var budget_check = confirm("Actual budget is larger than Expected budget. Are you sure you want to finalize this campaign?");
      if(budget_check){
        AdminCampaignService.finalizeCampaignByAdmin($scope.campaignDetails.id).then(function(result){
          if(result.status == 1){
            $scope.campaignDetails.status = 4;
            toastr.success("Campaign Finalized!"); // now we wait for launch request from user.
          }
          else{
            toastr.error(result.message);
          }
        });
      }
    }
    else{
      AdminCampaignService.finalizeCampaignByAdmin($scope.campaignDetails.id).then(function(result){
        if(result.status == 1){
          $scope.campaignDetails.status = 4;
          toastr.success("Campaign Finalized!"); // now we wait for launch request from user.
        }
        else{
          toastr.error(result.message);
        }
      });
    }
  }
   /*////popu////////*/
    $scope.closeInputPanel = function() {
      $mdSidenav('ClientRequest').toggle();
    };

  $scope.launchCampaign = function(campaignId, ev){
    AdminCampaignService.launchCampaign(campaignId).then(function(result){
      if(result.status == 1){
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title("Congrats!!")
          .textContent(result.message)
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
        );
        loadCampaignData(campaignId);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.showUpdatePaymentForm = function(){
    $mdDialog.show({
      locals:{ campaignId: $scope.campaignDetails.id, ctrlScope : $scope },
      templateUrl: 'views/admin/update-campaign-payment.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, $mdDialog, CampaignService, AdminCampaignService, ctrlScope, campaignId){
        $scope.paymentTypes = [
          {name: "Cash"},
          {name: "Cheque"},
          {name: "Online"},
          {name: "Transfer"}
        ];
        $scope.updateCampaignPayment = function(){
          $scope.campaignPayment.campaign_id = campaignId;
          AdminCampaignService.updateCampaignPayment($scope.campaignPayment).then(function(result){
            if(result.status == 1){
              // update succeeded. update the grid now.
              loadCampaignPayments(campaignId);
              toastr.success(result.message);
              $scope.cancel();
            }
            else{
              toastr.error(result.message);
            }
          });
        }
        $scope.cancel = function(){
          $mdDialog.hide();
        }
      }
    });
  }

  $scope.closeCampaign = function(campaignId, ev){
    AdminCampaignService.closeCampaign(campaignId).then(function(result){
      if(result.status == 1){
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title("Success!!")
          .textContent(result.message)
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
        );
        loadCampaignData(campaignId);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

    // tables code start
      var vm = $scope;
      vm.limit = 10;
      $scope.loadMore = function() {
        var increamented = vm.limit + 5;
        vm.limit = increamented > $scope.personalcampsdata.length ? $scope.personalcampsdata.length : increamented;
      };
    // tables code end

});
