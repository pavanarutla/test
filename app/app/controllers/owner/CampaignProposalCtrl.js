app.controller('OwnerCampaignProposalCtrl', function ($scope, $mdDialog, $stateParams,$mdSidenav, $location, CampaignService, AdminCampaignService, config, toastr,OwnerCampaignService) {
 

  var currentUser = JSON.parse(localStorage.OwnerloggedInUser);

  function loadCampaignData(campaignId){    
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      $scope.campaignDetails = result;
      $scope.hoardingitems = result.products;
     // $scope.gridCampaignProducts.data = result.products;
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
 /*function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }
    function highlightDay(data) {
      console.log("mydata");
      console.log(data);
        var date = data.date,
        mode = data.mode;
        console.log(mode);
        if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
        for (var i = 0; i < $scope.events.length; i++) {
           var currentDay =
                new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
             if ($scope.events[i].type == "Corporate")
                return "lime";
             else
                return "orange";
             }
          }
       }
       return '';
    }
*/

  $scope.addNewProductToCampaign = function(){
    localStorage.ownerCampaignForSuggestion = JSON.stringify($scope.campaignDetails);
    $location.path('/owner/'+currentUser.username+'/suggestproducts');
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
      locals:{ campaignDetails: $scope.campaignDetails, campaignId: $scope.campaignDetails.id, productObj : productObj, ctrlScope : $scope },
      templateUrl: 'views/owner/edit-proposed-product.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      preserveScope: true,
      controller:function($scope, $mdDialog, CampaignService, AdminCampaignService, ctrlScope, campaignId, productObj,campaignDetails){
        $scope.product = productObj;
        $scope.campaignDetails = campaignDetails;
        /************ Datepicker *******************/

       // $scope.dateOptions = {
        //   customClass: highlightDay,
          // customMessage: tooltipMsg,
       // };

     //init();

    
   
    //init();

        $scope.updateProposedProduct = function(product){
          AdminCampaignService.updateProposedProduct(campaignId, $scope.product).then(function(result){
            if(result.status == 1){
              // update succeeded. update the grid now.
              CampaignService.getCampaignWithProducts(campaignId).then(function(result){
                ctrlScope.campaignDetails = result;
                ctrlScope.hoardingitems = result.products;
              });
              $mdDialog.hide();
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
        OwnerCampaignService.ownerCamapignLaunch($scope.campaignDetails.id).then(function(result){
          if(result.status == 1){
            $scope.campaignDetails.status = 6;
            toastr.success("Campaign Finalized!"); // now we wait for launch request from user.
          }
          else{
            toastr.error(result.message);
          }
        });
      }
    }
    else{
      OwnerCampaignService.ownerCamapignLaunch($scope.campaignDetails.id).then(function(result){
        if(result.status == 1){
          $scope.campaignDetails.status = 6;
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
