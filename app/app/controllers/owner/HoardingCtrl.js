app.controller('OwnerHoardingCtrl', function ($scope, $mdDialog, $http,$mdSidenav,$location, AdminCampaignService, ProductService, toastr,MapService,config,CampaignService,$timeout) {
  
    $scope.msg = {};
    $scope.limit = 3;
    $scope.pageNo = 1;

    $scope.productList = [];
    var currentUserId = JSON.parse(localStorage.OwnerloggedInUser).id;
    /*
    ======== Loads product of LoggedIn Owner =======
    */
    $scope.loadProductList = function(){
      ProductService.ProductsOfOwner($scope.pageNo).then(function(result){
        if(localStorage.ownerCampaignForSuggestion){
          var ownerCampaignForSuggestion = JSON.parse(localStorage.ownerCampaignForSuggestion);
          if(ownerCampaignForSuggestion.products && ownerCampaignForSuggestion.products.length > 0){
            _.map(result, function(p){
              if(_.find(JSON.parse(localStorage.ownerCampaignForSuggestion).products, {id: p.id}) !== undefined){
                p.alreadyAdded = true;
                return p;
              } 
            });  
          } 
        }
        $scope.pageNo += 1;
        $scope.productList = $scope.productList.concat(result);
      });
    }
    $scope.loadProductList();
    /*
    ======== Loads product of LoggedIn Owner Ends =======
    */    
  
   // Load More
    $scope.loadMore = function () {
      $scope.limit = $scope.items.length
    }

    // shortlist product list from server side
    function getShortListedProducts() {
        MapService.getshortListProduct(currentUserId).then(function (response) {
          console.log(response);
          $scope.shortListedProducts = response;
        });
    }

    // shortlist popup
    $scope.shortlistProduct = function() {
        $mdSidenav('shortlistAndSaveOwnerSidenav').toggle();
        getShortListedProducts();
    };

    // add product
    $scope.addProductOwner = function() {
        $mdSidenav('addProductOwnerSidenav').toggle();
    };
    $scope.shareProducts = function() {
        $mdSidenav('shareProductOwner').toggle();
    };
    $scope.addCamapginSidenav = function() {
        $mdSidenav('ownerAddcmapgin').toggle();
    };
    $scope.toggleProductDetailSidenav = function() {
      $mdSidenav('productDetails').close();
    }
    $scope.addProductstoCampaignsSidenav =function(){
      $mdSidenav('addProductstoCampaigns').open();
    }
    $scope.toggleSaveCampaignSidenav = function () {
      $mdSidenav('ownerAddcmapgin').open();
    };
    
    //Shortlist the product
    $scope.shortlistSelected = function (id) {
      MapService.shortListProduct(id, currentUserId).then(function (response) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('Shortlist Product')
            .textContent(response.message)
            .ariaLabel('shortlist-success')
            .ok('Got it!')
            .targetEvent(),
            $mdSidenav('shortlistAndSaveOwnerSidenav').close()
        );
      });
    }
        
    // show the product detail 
    $scope.viewProduct = function(product){
      $scope.product = {};
      $scope.product.image = config.serverUrl + product.image;
      $scope.product.siteNo = product.siteNo;
      $scope.product.panelSize = product.panelSize;
      $scope.product.address = product.address;
      $scope.product.impressions = product.impressions;
      $scope.product.direction = product.direction;
      $scope.product.lighting = product.lighting;
      $scope.product.availableDates = product.availableDates;
      $scope.product.id = product.id;
      $mdSidenav('shortlistAndSaveOwnerSidenav').close();
      $mdSidenav('productDetails').open();
    }

    //Delete the shortlisted
    $scope.deleteShortlisted = function (ev, productId) {
      MapService.deleteShortlistedProduct(currentUserId, productId).then(function (response) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('ShortList Product')
            .textContent(response.message)
            .ariaLabel('delete-shortlisted')
            .ok('Got it!')
            .targetEvent(ev)
        );
        getShortListedProducts();
     });  
  }
  
    // Add new Campaigns
    $scope.campaign = {};
    $scope.submittedtrue = false;
    $scope.saveCampaign = function($detail){
      if($scope.shortListedProducts.length > 0){
          $scope.campaign.products = [];
          _.each($scope.shortListedProducts, function (v, i) {
            $scope.campaign.products.push(v.id);
          });
           $scope.submittedtrue = true;   
          if($scope.signup.$valid) {
            $scope.campaign.posted_by= currentUserId;
            CampaignService.saveCampaign($scope.campaign).then(function(response){
              $scope.campaignSavedSuccessfully = true;
              $scope.campaign={};
              $mdSidenav('ownerAddcmapgin').close();
              toastr.success("Shortlisted products saved in New campaign");
              $scope.loadPlannedUserCampaigns();
              getShortListedProducts();
            });
          }
      }
      else{
        toastr.error("Please shortlist some products first.");
      }  
    }

    //Planned User Campaigns
    $scope.plannedUserCampaigns = [];
    $scope.loadPlannedUserCampaigns = function () {
      CampaignService.getPlannedCampaigns().then(function (result) {
        $scope.plannedUserCampaigns = result;
      });
    }
    $scope.loadPlannedUserCampaigns();

   // Add product to exixting Campaigns
   $scope.addProductToExistingCampaign = function(product_id,existingCampaign){
      var productToCampaign = {
        product_id: product_id,
        campaign_id: existingCampaign.id
      };
      CampaignService.addProductToExistingCampaign(productToCampaign).then(function(result){
        if(result.status == 1){
          toastr.success(result.message);
        }
        else{
          toastr.error(result.message);
        }
        $mdSidenav('productDetails').close();
        $mdSidenav('addProductstoCampaigns').close();

      });
  }
  
});
 