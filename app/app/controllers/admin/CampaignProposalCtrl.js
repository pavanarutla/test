app.controller('CampaignProposalCtrl', function(
  $scope,
  $mdDialog,
  $stateParams,
  $mdSidenav,
  $location,
  $rootScope,
  CampaignService,
  AdminCampaignService,
  ProductService,
  config,
  toastr,
  OwnerProductService,
  Upload
) {
  $scope.productList = [];
  //$scope.isChecked = true;

  /*===================
  | Pagination
  ===================*/
  $scope.pagination = {};
  $scope.pagination.pageNo = 1;
  $scope.pagination.pageSize = 15;
  $scope.pagination.pageCount = 0;
  var pageLinks = 20;
  var lowest = 1;
  var highest = lowest + pageLinks - 1;
  function createPageLinks() {
    var mid = Math.ceil(pageLinks / 2);
    if ($scope.pagination.pageCount < $scope.pagination.pageSize) {
      lowest = 1;
    } else if (
      $scope.pagination.pageNo >= $scope.pagination.pageCount - mid &&
      $scope.pagination.pageNo <= $scope.pagination.pageCount
    ) {
      lowest = $scope.pagination.pageCount - pageLinks;
    } else if (
      $scope.pagination.pageNo > 0 &&
      $scope.pagination.pageNo <= pageLinks / 2
    ) {
      lowest = 1;
    } else {
      lowest = $scope.pagination.pageNo - mid + 1;
    }
    highest =
      $scope.pagination.pageCount < $scope.pagination.pageSize
        ? $scope.pagination.pageCount
        : lowest + pageLinks;
    $scope.pagination.pageArray = _.range(lowest, highest + 1);
  }

  /*===================
  | Pagination Ends
  ===================*/

  /*=======================
  | MdDialogs and sidenavs
  =======================*/

  $scope.toggleQuoteChangeRequestDetailsSidenav = function() {
    $mdSidenav("quoteChangeRequestDetailsSidenav").toggle();
  };

  $scope.toggleShareCampaignSidenav = function() {
    $mdSidenav("shareCampaignSidenav").toggle();
  };

  /*===========================
  | MdDialogs and sidenavs end
  ===========================*/

  $scope.loadProductList = function() {
    if ($scope.searchAll) {
      var search = $scope.searchAll;
    } else {
      search = "";
    }
    ProductService.getSearchProductList(
      $scope.pagination.pageNo,
      $scope.pagination.pageSize,
      search
    ).then(function(result) {
      if (localStorage.campaignForSuggestion) {
        var campaignForSuggestion = JSON.parse(
          localStorage.campaignForSuggestion
        );
        $scope.campaignId = campaignForSuggestion.id;
        $scope.campaignStartDate = campaignForSuggestion.start_date;
        $scope.campaignEndDate = campaignForSuggestion.end_date;
        $scope.campaignEstBudget = campaignForSuggestion.est_budget;
        $scope.campaignActBudget = campaignForSuggestion.act_budget;
        if (
          campaignForSuggestion.products &&
          campaignForSuggestion.products.length > 0
        ) {
          _.map(result.products, function(p) {
            if (
              _.find(JSON.parse(localStorage.campaignForSuggestion).products, {
                id: p.id
              }) !== undefined
            ) {
              p.alreadyAdded = true;
              return p;
            }
          });
        }
      }
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      createPageLinks();
    });
  };

  /****** Search ************/
  $scope.searchAll = "";

  $scope.clearSearch = function() {
    $scope.searchAll = "";
    $scope.pageNo = 1;
    $scope.loadProductList();
  };
  $scope.searchHoardingData = function() {
    $scope.pageNo = 1;
    $scope.loadProductList();
  };

  function setDatesForProductsToSuggest(campaign) {
    $scope.campaignStartDate = new Date(campaign.start_date);
    $scope.campaignEndDate = new Date(campaign.end_date);
    $scope.fromMinDate = moment(campaign.start_date).toDate();
    $scope.fromMaxDate = moment(campaign.end_date).toDate();
    $scope.toMaxDate = moment(campaign.end_date).toDate();
  }

  $scope.loadCampaignData = function(campaignId) {
    return new Promise(function(resolve, reject) {
      CampaignService.getCampaignWithProducts(campaignId).then(function(
        result
      ) {
        console.log(result);
        $scope.campaignDetails = result;
        $scope.campaignProducts = result.products;
        setDatesForProductsToSuggest($scope.campaignDetails);
        $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
        $scope.TOTAL = $scope.campaignDetails.act_budget + $scope.GST;

        if (result.status > 7) {
          loadCampaignPayments(campaignId);
        }
        resolve(result);
      });
    });
  };

  $scope.uncheck = function() {
    if (!$scope.checked) {
      $scope.GST = "0";
      $scope.TOTAL = $scope.campaignDetails.act_budget + parseInt($scope.GST);
    }else{
      $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
        $scope.TOTAL = $scope.campaignDetails.act_budget + $scope.GST;
    }
  };

  function loadCampaignPayments(campaignId) {
    if ($scope.campaignDetails.status >= 6) {
      AdminCampaignService.getCampaignPaymentDetails(campaignId).then(function(
        result
      ) {
        $scope.campaignPayments = result;
      });
    } else {
      toastr.error(
        "Payments are only available for running or stopped campaigns."
      );
    }
  }

  if ($stateParams.campaignId) {
    var campaignId = $stateParams.campaignId;
    $scope.loadCampaignData(campaignId);
  }

  $scope.addNewProductToCampaign = function() {
    $scope.campaignForSuggestion = {};
    localStorage.campaignForSuggestion = JSON.stringify($scope.campaignDetails);
    $location.path("/admin/suggest-products");
  };

  // adds a product in the campaign
  $scope.suggestProductForCampaign = function(suggestedProduct) {
    if (!localStorage.campaignForSuggestion) {
      toastr.error(
        "No Campaign is seleted. Please select which campaign you're adding this product in to."
      );
    } else {
      var postObj = {
        campaign_id: JSON.parse(localStorage.campaignForSuggestion).id,
        product: {
          id: suggestedProduct.id,
          from_date: suggestedProduct.start_date,
          to_date: suggestedProduct.end_date,
          price: suggestedProduct.price
        }
      };
      AdminCampaignService.proposeProductForCampaign(postObj).then(function(
        result
      ) {
        if (result.status == 1) {
          AdminCampaignService.getCampaignWithProducts(
            JSON.parse(localStorage.campaignForSuggestion).id
          ).then(function(updatedCampaignData) {
            localStorage.campaignForSuggestion = JSON.stringify(
              updatedCampaignData
            );
            $scope.campaignActBudget = updatedCampaignData.act_budget;
            _.map($scope.productList, function(product) {
              if (product.id == suggestedProduct.id) {
                product.alreadyAdded = true;
              }
              return product;
            });
          });
          toastr.success(result.message);
        } else {
          toastr.error(result.message);
        }
      });
    }
  };

  $scope.removeProductFromCampaignSuggestion = function(productId) {
    var campaignId = JSON.parse(localStorage.campaignForSuggestion).id;
    AdminCampaignService.deleteProductFromCampaign(campaignId, productId).then(
      function(result) {
        if (result.status == 1) {
          AdminCampaignService.getCampaignWithProducts(
            JSON.parse(localStorage.campaignForSuggestion).id
          ).then(function(updatedCampaignData) {
            localStorage.campaignForSuggestion = JSON.stringify(
              updatedCampaignData
            );
            // console.log(JSON.stringify(updatedCampaignData));
            $scope.campaignActBudget = updatedCampaignData.act_budget;
          });
          _.map($scope.productList, function(product) {
            if (product.id == productId) {
              product.alreadyAdded = false;
            }
            return product;
          });
          toastr.success("Product removed from campaign");
        } else {
          toastr.error(result.message);
        }
      }
    );
  };

  $scope.viewProductImage = function(image) {
    var imagePath = config.serverUrl + image;
    $mdDialog.show({
      locals: { src: imagePath },
      templateUrl: "views/image-popup-large.html",
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      controller: function($scope, src) {
        $scope.img_src = src;
      }
    });
  };

  $scope.changeProductPrice = function(data) {
    product = {};
    product.id = data.product_id;
    product.default_price = data.default_price;
    AdminCampaignService.changeProductPrice(product).then(function(result) {
      if (result.status == 1) {
        toastr.success(result.message);
      } else {
        toastr.error(result.data.message);
      }
    });
  };
  $scope.editProposedProduct = function(bookingId, price) {
    var bookingObj = {
      booking_id: bookingId,
      price: price
    };
    $mdDialog.show({
      locals: {
        campaign: $scope.campaignDetails,
        bookingObj: bookingObj,
        ctrlScope: $scope
      },
      templateUrl: "views/admin/edit-proposed-product.html",
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      controller: function(
        $scope,
        $mdDialog,
        CampaignService,
        AdminCampaignService,
        ctrlScope,
        campaign,
        bookingObj
      ) {
        $scope.booking = bookingObj;
        $scope.updateProposedProduct = function() {
          AdminCampaignService.updateProposedProduct(
            campaign.id,
            $scope.booking
          ).then(function(result) {
            if (result.status == 1) {
              // update succeeded. update the grid now.
              $mdDialog.hide();
              CampaignService.getCampaignWithProducts(campaign.id).then(
                function(result) {
                  ctrlScope.campaignDetails = result;
                  ctrlScope.campaignProducts = result.products;
                  // setDatesForAdminProposalToSuggest($scope.campaignDetails);
                }
              );
              toastr.success(result.message);
            } else {
              toastr.error(result.message);
            }
          });
        };
        $scope.closeMdDialog = function() {
          $mdDialog.hide();
        };
      }
    });
  };

  $scope.shareCampaignToEmail = function(ev, shareCampaign) {
    $scope.campaignToShare = $scope.campaignDetails;
    var campaignToEmail = {
      campaign_id: $scope.campaignToShare.id,
      email: shareCampaign.email,
      receiver_name: shareCampaign.receiver_name,
      campaign_type: $scope.campaignToShare.type
    };
    CampaignService.shareCampaignToEmail(campaignToEmail).then(function(
      result
    ) {
      if (result.status == 1) {
        $mdSidenav("shareCampaignSidenav").close();
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("body")))
            .clickOutsideToClose(true)
            .title(result.message)
            // .textContent('You can specify some description text in here.')
            .ariaLabel("Alert Dialog Demo")
            .ok("Got it!")
            .targetEvent(ev)
        );
      } else {
        toastr.error(result.message);
      }
    });
  };

  $scope.notifyProductOwnersForQuote = function() {
    AdminCampaignService.notifyProductOwnersForQuote(
      $scope.campaignDetails.id
    ).then(function(result) {
      if (result.status == 1) {
        $scope.campaignDetails.status = 2;
        toastr.success("Owners notified!"); // now we wait for launch request from user.
      } else {
        toastr.error(result.message);
      }
    });
  };

  $scope.finalizeCampaign = function() {
    if ($scope.campaignDetails.act_budget > $scope.campaignDetails.exp_budget) {
      var budget_check = confirm(
        "Actual budget is larger than Expected budget. Are you sure you want to finalize this campaign?"
      );
      if (budget_check) {
        AdminCampaignService.finalizeCampaignByAdmin(
          $scope.campaignDetails.id
        ).then(function(result) {
          console.log(result);
          if (result.status == 1) {
            $scope.campaignDetails.status = 3;
            $scope.loadCampaignData($scope.campaignDetails.id);
            toastr.success("Quote Sent!"); // now we wait for launch request from user.
          } else {
            toastr.error(result.message);
          }
        });
      }
    } else {
      AdminCampaignService.finalizeCampaignByAdmin(
        $scope.campaignDetails.id
      ).then(function(result) {
        if (result.status == 1) {
          $scope.campaignDetails.status = 3;
          $scope.loadCampaignData($scope.campaignDetails.id);
          toastr.success("Quote Sent!"); // now we wait for launch request from user.
        } else {
          toastr.error(result.message);
        }
      });
    }
  };

  $scope.confirmCampaignBooking = function(campaignId, ev) {
    AdminCampaignService.confirmCampaignBooking(campaignId).then(function(
      result
    ) {
      if (result.status == 1) {
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("body")))
            .clickOutsideToClose(true)
            .title("Congrats!!")
            .textContent(result.message)
            .ariaLabel("Alert Dialog Demo")
            .ok("Got it!")
            .targetEvent(ev)
        );
        $scope.loadCampaignData(campaignId);
      } else {
        $scope.loadCampaignData(campaignId).then(function() {
          if (result.product_ids && result.product_ids.length > 0) {
            toastr.error(result.message);
            _.map($scope.campaignProducts, p => {
              if (_.contains(result.product_ids, p.product_id)) {
                p.unavailable = true;
              }
            });
          }
        });
      }
    });
  };
  $scope.paymentTypes = [
    { name: "Cash" },
    { name: "Cheque" },
    { name: "Online" },
    { name: "Transfer" }
  ];
  $scope.files = {};
  $scope.updateCampaignPayment = function(cid) {
    $scope.campaignPayment.campaign_id = cid;
    Upload.upload({
      url: config.apiPath + "/campaign-payment",
      data: {
        image: $scope.files.image,
        campaign_payment: $scope.campaignPayment
      }
    }).then(
      function(result) {
        if (result.data.status == "1") {
          toastr.success(result.data.message);
          $scope.campaignPayment = {};
          $scope.files.image = "";
          /*setTimout(() => {
                    $location.path('/owner/' + $rootScope.clientSlug + '/payments');
                }, 2500);*/
        } else {
          if (result.data.message.constructor == Array) {
            $scope.updateCampaignPaymentErrors = result.data.message;
          } else {
            toastr.error(result.data.message);
          }
        }
      },
      function(resp) {
        toastr.error("somthing went wrong try again later");
        // console.log('Error status: ', resp);
      },
      function(evt) {
        var progressPercentage = parseInt((100.0 * evt.loaded) / evt.total);
        //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
      }
    );
  };

  /* $scope.showUpdatePaymentForm = function(){
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
              $rootScope.closeMdDialog();
            }
            else{
              toastr.error(result.message);
            }
          });
        }
      }
    });
  }*/

  $scope.launchCampaign = function(campaignId, ev) {
    AdminCampaignService.launchCampaign(campaignId).then(function(result) {
      console.log(result);
      if (result.status == 1) {
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("body")))
            .clickOutsideToClose(true)
            .title("Congrats!!")
            .textContent(result.message)
            .ariaLabel("Alert Dialog Demo")
            .ok("Got it!")
            .targetEvent(ev)
        );
        $scope.loadCampaignData(campaignId);
      } else {
        toastr.error(result.message);
      }
    });
  };

  $scope.closeCampaign = function(campaignId, ev) {
    AdminCampaignService.closeCampaign(campaignId).then(function(result) {
      if (result.status == 1) {
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("body")))
            .clickOutsideToClose(true)
            .title("Success!!")
            .textContent(result.message)
            .ariaLabel("Alert Dialog Demo")
            .ok("Got it!")
            .targetEvent(ev)
        );
        $scope.loadCampaignData(campaignId);
      } else {
        toastr.error(result.message);
      }
    });
  };

  $scope.deleteProductFromCampaign = function(campaignId, productId) {
    AdminCampaignService.deleteProductFromCampaign(campaignId, productId).then(
      function(result) {
        if (result.status == 1) {
          $scope.loadCampaignData(campaignId);
          toastr.success(result.message);
        } else {
          toastr.error(result.message);
        }
      }
    );
  };

  $scope.getChangeRequestHistory = function(campaignId) {
    AdminCampaignService.getChangeRequestHistory(campaignId).then(function(
      result
    ) {
      $scope.changeRequestHistory = result;
      $scope.toggleQuoteChangeRequestDetailsSidenav();
    });
  };

  $scope.changeCampaignProductPrice = function(
    campaign_id,
    admin_price,
    product_id,
    product_n
  ) {
    product = {};
    product.campaign_id = campaign_id;
    product.admin_price = admin_price;
    product.product_id = product_id;
    product.product = product_n;
    OwnerProductService.changeCampaignProductPrice(product).then(function(
      result
    ) {
      if (result.status == 1) {
        $scope.loadCampaignData(campaign_id);
        toastr.success(result.message);
      } else {
        toastr.error(result.data.message);
      }
    });
  };

  $scope.changeQuoteRequest = function(campaignId, remark) {
    $scope.changeRequest = {};
    $scope.changeRequest.for_campaign_id = campaignId;
    $scope.changeRequest.remark = remark;
    $scope.changeRequest.type = "bbi";
    CampaignService.requestChangeInQuote($scope.changeRequest).then(function(
      result
    ) {
      if (result.status == 1) {
        $scope.loadCampaignData(campaignId);
        //$mdDialog.hide();
        toastr.success(result.message);
      } else {
        toastr.error(result.message);
      }
    });
  };

  /*=========================
  | Page based initial loads
  =========================*/

  if ($rootScope.currStateName == "admin.suggest-products") {
    if (!localStorage.campaignForSuggestion) {
      toastr.error(
        "No Campaign is seleted. Please select which campaign you're adding this product in to."
      );
    } else {
      $scope.loadProductList();
      setDatesForProductsToSuggest(
        JSON.parse(localStorage.campaignForSuggestion)
      );
    }
  }

  /*=============================
  | Page based initial loads end
  =============================*/
});
