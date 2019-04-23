app.controller('ProductlistCtrl', function ($scope,MapService,$mdSidenav,$mdDialog,ProductService,CampaignService,$rootScope,toastr) {
  MapService.mapProducts().then(function (markers) {
     $scope.actualDataCopy=markers;
    $scope.productmarkerslist = markers;
  })
  ProductService.getFormatList().then(function (formats) {
      // $scope.formatList = formats;
      $scope.formatGrid = [];
      $scope.selectedFormats = [];
      var x = 3;
      var y = formats.length / x;
      var k = 0;
      for (var i = 0; i < y; i++) {
        var tempArr = [];
        for (var j = 0; j < x; j++) {
          tempArr.push(formats[k]);
          if (formats[k]) {
            $scope.selectedFormats.push(formats[k].id);
            k++;
          }
        }
        $scope.formatGrid.push(tempArr);
      }
    });
   $scope.FormatData=function (selectedZone) {
       $scope.productmarkerslist=$scope.actualDataCopy.filter(function (item) {
           return item.product_details[0].format_name===selectedZone;
       });
   };
   $scope.resetData=function(){
       $scope.productmarkerslist=$scope.actualDataCopy;
       $scope.siteNo='';
       $scope.area_name='';
   };
    $scope.getproddata = function (proddetails) {            
      $scope.productListDetails = proddetails;      
      $mdSidenav('productDetails').toggle();
    }
    $scope.formats = function () {
      $scope.filter = false;
      $scope.format = !$scope.format;
      $scope.shortlist = false;
      $scope.savedcampaign = false;
    }
    /*================================
| Multi date range picker options
================================*/
$scope.mapProductOpts = {
  multipleDateRanges: true,
  opens: 'center',
  locale: {
      applyClass: 'btn-green',
      applyLabel: "Book Now",
      fromLabel: "From",
      format: "DD-MMM-YY",
      toLabel: "To",
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
  },
  isInvalidDate: function (dt) {
    for (var i = 0; i < $scope.unavailalbeDateRanges.length; i++) {
        if (moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)) {
            return true;
        }
    }
    if(moment(dt) < moment()){
        return true;
    }
},
isCustomDate: function (dt) {
    for (var i = 0; i < $scope.unavailalbeDateRanges.length; i++) {
        if (moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)) {
            if (moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_from), 'day')) {
                return ['red-blocked', 'left-radius'];
            } else if (moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_to), 'day')) {
                return ['red-blocked', 'right-radius'];
            } else {
                return 'red-blocked';
            }
        }
    }
    if(moment(dt) < moment()){
        return 'gray-blocked';
    }
},
eventHandlers: {
    'apply.daterangepicker': function(ev, picker) { 
        //selectedDateRanges = [];
    }
} 
};
/*====================================
| Multi date range picker options end
====================================*/      
$scope.addProductToExistingCampaign = function (existingCampaignId, productId, selectedDateRanges) {
  var productToCampaign = {
      product_id: productId,
      campaign_id: existingCampaignId
  };
  if (selectedDateRanges.length > 0) {
      productToCampaign.dates = selectedDateRanges;
  } else {
      toastr.error("Please select dates.");
      return false;
  }
  CampaignService.addProductToExistingCampaign(productToCampaign).then(function (result) {
      if (result.status == 1) {
          toastr.success(result.message);
          $mdSidenav('productDetails').close();
      } else {
          toastr.error(result.message);
      }
  });
}
$scope.IsDisabled = true;
$scope.EnableDisable = function () {
  $scope.IsDisabled = $scope.campaign.name.length == 0;
}
$scope.FilterProductlist = function(booked_from,booked_to){
  MapService.filterProducts(booked_from,booked_to).then(function (result) {
   productList = [];
              locArr = [];
              uniqueMarkers = [];
              concentricMarkers = {};
              var filterObj = {area: $scope.selectedAreas, product_type: $scope.selectedFormats, booked_from,booked_to};
              $scope.plottingDone = false;
              MapService.filterProducts(filterObj).then(function (markers) {
                  _.each(markersOnMap, function (v, i) {
                      v.setMap(null);
                      $scope.Clusterer.removeMarker(v);
                  });
                  markersOnMap = Object.assign([]);
                  $scope.filteredMarkers = markers;
                  $scope.processMarkers();
                  if (markers.length > 0) {
                      var bounds = new google.maps.LatLngBounds();
                      _.each(markersOnMap, function (v, i) {
                          bounds.extend(v.getPosition());
                      });
                  } else {
                      toastr.error("no marker found for the criteria you selected");
                  }
              });
});
}
    // SHORT-LIST
    $scope.shortlistSelected = function (productId, selectedDateRanges, ev) {
      var sendObj = {
        product_id: productId,
        dates: selectedDateRanges
      }
      MapService.shortListProduct(sendObj).then(function (response) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('Shortlist Product')
            .textContent(response.message)
            .ariaLabel('shortlist-success')
            .ok('Got it!')
            .targetEvent(ev),
          $mdSidenav('productDetails').close()
        );
        getShortListedProducts();
        $mdSidenav('productDetails').close();
      });
    }
    function getShortListedProducts() {
      MapService.getshortListProduct(JSON.parse(localStorage.loggedInUser).id).then(function (response) {
         shortListedProductsLength = response.length;
        $scope.shortListedProducts = response;
        $rootScope.$emit("shortListedProducts",shortListedProductsLength)
      });
    }
    getShortListedProducts();
    $scope.getProductUnavailableDates = function(productId, ev){
      MapService.getProductUnavailableDates(productId).then(function(dateRanges){
        $scope.unavailalbeDateRanges = dateRanges;
        $(ev.target).parents().eq(3).find('input').trigger('click');
      });
    }
    // SHORT-LIST ENDs
    // Save-camp
    $scope.toggleExistingCampaignSidenav = function () {
      $scope.showSaveCampaignPopup = !$scope.showSaveCampaignPopup;
    }
    // Save-camp-end
    // SAVE-CAMPPP
    $scope.saveCampaign = function (product_id, selectedDateRanges) {
      if (product_id) {
          $scope.campaign.products = [];
          var sendObj = {
              product_id: product_id,
          }

          if (selectedDateRanges.length > 0) {
              sendObj.dates = selectedDateRanges;
          } else {
              toastr.error("Please select dates.");
              return false;
          }
          $scope.campaign.products.push(sendObj);
          $form = $scope.forms.mySaveCampaignForm;
      } else {
          if ($scope.shortListedProducts.length > 0) {
              $scope.campaign.products = [];
              _.each($scope.shortListedProducts, function (v, i) {
                  $scope.campaign.products.push(v.id);
              });
              $form = $scope.forms.viewAndSaveCampaignForm;
          } else {
              toastr.error("Please shortlist some products first.");
          }

      }
      if ($scope.campaign.products) {
          CampaignService.saveUserCampaign($scope.campaign).then(function (response) {
              if (response.status == 1) {
                  //$scope.campaignSavedSuccessfully = true;
                  $timeout(function () {
                      $scope.campaign = {};
                      $form.$setPristine();
                      $form.$setUntouched();
                      toastr.success(response.message);
                      //$scope.campaignSavedSuccessfully = false;
                  }, 3000);
                  $scope.loadActiveUserCampaigns();
                  getShortListedProducts();
              } else {
                  $scope.saveUserCampaignErrors = response.message;
              }
          });
      }

  }
    // SAVE-CAMPPP END
})