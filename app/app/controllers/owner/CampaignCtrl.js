app.controller('OwnerCampaignCtrl', function ($scope, $mdDialog, $mdSidenav, $interval, $stateParams, $window, $rootScope, $location, Upload, OwnerCampaignService, OwnerProductService, toastr, CampaignService, MetroService, ProductService, config, $state, FileSaver) {
    $scope.forms = [];
    $scope.serverUrl = config.serverUrl;

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
        } else if ($scope.pagination.pageNo >= ($scope.pagination.pageCount - mid) && $scope.pagination.pageNo <= $scope.pagination.pageCount) {
            lowest = $scope.pagination.pageCount - pageLinks;
        } else if ($scope.pagination.pageNo > 0 && $scope.pagination.pageNo <= pageLinks / 2) {
            lowest = 1;
        } else {
            lowest = $scope.pagination.pageNo - mid + 1;
        }
        highest = $scope.pagination.pageCount < $scope.pagination.pageSize ? $scope.pagination.pageCount : lowest + pageLinks;
        $scope.pagination.pageArray = _.range(lowest, highest + 1);
    }

    /*===================
     | Pagination Ends
     ===================*/
    //  With Service
    //  $scope.downloadPdf = function () {
    //     var fileName = "file_name.pdf";
    //     var a = document.createElement("a");
    //     document.body.appendChild(a);
    //     OwnerCampaignService.downloadPdf().then(function (result) {
    //         var file = new Blob([result.data], {type: 'application/pdf'});
    //         var fileURL = window.URL.createObjectURL(file);
    //         a.href = fileURL;
    //         a.download = fileName;
    //         a.click();
    //     });
    // };

    // With out Service
    // $scope.getConvas=function()
    // 		{
    // 			html2canvas($("#barcodeHtml"), {
    // 				onrendered: function(canvas) {
    // 					document.body.appendChild(canvas);

    // 				}
    // 			});
    // 		}

    /*=======================
     | MdDialogs and sidenavs
     =======================*/
    $scope.showPaymentdailog = function () {
        $mdDialog.show({
            templateUrl: 'views/updatepaymentDailog.html',
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose: true
        })
    };
    // $scope.addOwnerCampagin = function (ev) {
    //   $mdDialog.show({
    //     templateUrl: 'views/owner/addcampaign.html',
    //     fullscreen: $scope.customFullscreen,
    //     clickOutsideToClose: true
    //   })
    // };
    $scope.ownerCampaign = {};
    $scope.toggleAddCamapginSidenav = function () {
        $mdSidenav('ownerAddCmapginSidenav').toggle();
    };

    $scope.cancel = function () {
        $mdDialog.hide();
    };
    $scope.sharePerson = false;
    $scope.shareCampaign = function () {
        $scope.sharePerson = !$scope.sharePerson;
    }

    $scope.showCampaignPaymentSidenav = function () {
        $mdSidenav('campaignPaymentDetailsSidenav').toggle();
    };

    //campaign share
    // $scope.toggleShareCampaignSidenav = function (campaignDetails) {
    //     $scope.OwnerShareCampaign = campaignDetails;
    //     $mdSidenav('shareCampaignSidenav').toggle();
    // };

    $scope.paymentrefImage = function (img_src) {
        $mdDialog.show({
            locals: { src: config.serverUrl + img_src },
            templateUrl: 'views/owner/image-large.html',
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose: true,
            controller: function ($scope, src) {
                $scope.img_src = src;
                $scope.closeMdDialog = function () {
                    $mdDialog.hide();
                }
            }
        });
    };

    /*===========================
     | MdDialogs and sidenavs end
     ===========================*/
$scope.hidebutton = function(){
    if($scope.campaignDetails.status >= 700){
     return false;
    } else{
        return true;
    }
}
    /*================================
     | Multi date range picker options
     ================================*/
     $scope.suggestProductOpts = {
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
            if (moment(dt) < moment()) {
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
            if (moment(dt) < moment()) {
                return 'gray-blocked';
            }
        },
        eventHandlers: {
            'apply.daterangepicker': function (ev, picker) {
                //selectedDateRanges = [];
            }
        },
    };
    /*====================================
     | Multi date range picker options end
     ====================================*/

    ////data for image uploading 

    // $scope.data = {};
    // $scope.uploadFile = function (input) {
    //   $scope.data.fileName = input.files[0].name;
    //   if (input.files && input.files[0]) {
    //     var reader = new FileReader();
    //     reader.onload = function (e) {
    //       //Sets the Old Image to new New Image
    //       $('#photo-id').attr('src', e.target.result);
    //       //Create a canvas and draw image on Client Side to get the byte[] equivalent
    //       var canvas = document.createElement("canvas");
    //       var imageElement = document.createElement("img");
    //       imageElement.setAttribute('src', e.target.result);
    //       canvas.width = imageElement.width;
    //       canvas.height = imageElement.height;
    //       var context = canvas.getContext("2d");
    //       context.drawImage(imageElement, 0, 0);
    //       var base64Image = canvas.toDataURL("image/jpeg");
    //       //Removes the Data Type Prefix 
    //       //And set the view model to the new value
    //       $scope.data.uploadedPhoto = e.target.result.replace(/data:image\/jpeg;base64,/g, '');
    //     }
    //     //Renders Image on Page
    //     reader.readAsDataURL(input.files[0]);
    //   }
    // };
    $scope.ProductTypes = [
        { name: "Bulletin" },
        { name: "Digital Bulletin" },
        { name: "Transit" }
      ];
    function setDatesForOwnerProductsToSuggest(campaign) {
        $scope.SuggestprodStartDate = new Date(campaign.start_date);
        $scope.SuggestprodEndDate = new Date(campaign.end_date);
        $scope.SuggestprodfromMinDate = moment(campaign.start_date).toDate();
        $scope.SuggestprodfromMaxDate = moment(campaign.end_date).toDate();
        $scope.SuggestprodfromMaxDate = moment(campaign.end_date).toDate();
    }
    function setMinMaxDatesForCamapign() {
        $scope.minStartDate = new Date();
        $scope.minEndDate = moment($scope.ownerCampaign.start_date).add(1, 'days').toDate();
        $scope.ownerCampaign.end_date = $scope.minEndDate;
        $scope.defaultStartDate = new Date();
    }
    $scope.updateEndDateValidations = function () {
        $scope.minEndDate = moment($scope.ownerCampaign.start_date).add(1, 'days').toDate();
        if ($scope.ownerCampaign.end_date <= $scope.ownerCampaign.start_date) {
            $scope.ownerCampaign.end_date = $scope.minEndDate;
        }
    }
    // get all Campaigns by a user to show it in campaign management page
    $scope.getUserCampaignsForOwner = function () {
        return new Promise((resolve, reject) => {
            OwnerCampaignService.getUserCampaignsForOwner().then(function (result) {
                $scope.userCampaignPayments = result;
                $scope.plannedCampaigns = _.filter(result, function (c) {
                    //  return c.status < 800 ;
                    return c.status == 300 || c.status == 400 || c.status == 500 || c.status == 600;
                });
                $scope.scheduledCampaigns = _.filter(result, function (c) {
                    return c.status >= 700;
                });
//        $scope.runningCampaigns = _.where(result, {
//            status: 600
//        });
                $scope.runningCampaigns = _.filter(result.user_campaigns, function (c) {
                    //    return c.status == 1141 && typeof c.name !== "undefined";
                    return c.status >= 800;
                });
                $scope.closedCampaigns = _.filter(result, function (c) {
                    //return c.status > 800;
                    return c.status == 1000 || c.status == 900;
                });
                resolve(result);
            });
        });
    }
    var loadOwnerCampaigns = function () {
        return new Promise((resolve, reject) => {
            OwnerCampaignService.getOwnerCampaigns().then(function (result) {
                $scope.ownerCampaigns = result;
                $scope.ownerCampaigns = _.filter(result, function (c) {
                    return c.status < 800;
                });
                $scope.scheduledCampaigns = _.filter(result, function (c) {
                    return c.status >= 800;
                });
                resolve(result);
            });
        });
    }
    var loadMetroCampaigns = function () {
        return new Promise((resolve, reject) => {
            MetroService.getMetroCampaigns().then(function (result) {
                $scope.metrocampaign = _.filter(result, function (c) {
                    return c.status >= 1101;
                });
                resolve(result);
            });
        });
    }
    var loadOwnerProductList = function () {        
        OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function (result) {
            if (localStorage.selectedOwnerCampaign) {
                var selectedOwnerCampaign = JSON.parse(localStorage.selectedOwnerCampaign);
                $scope.campaignStartDate = selectedOwnerCampaign.start_date;
                $scope.campaignEndDate = selectedOwnerCampaign.end_date;
                $scope.campaignEstBudget = selectedOwnerCampaign.est_budget;
                $scope.campaignActBudget = selectedOwnerCampaign.act_budget;
                if (selectedOwnerCampaign.products && selectedOwnerCampaign.products.length > 0) {
                    _.map(result.products, function (p) {
                        if (_.find(JSON.parse(localStorage.selectedOwnerCampaign).products, {id: p.id}) !== undefined) {
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
    }
    // get all Campaigns by a user to show it in campaign management page ends  
    $scope.saveOwnerCampaign = function () {
        OwnerCampaignService.saveOwnerCampaign($scope.ownerCampaign).then(function (result) {
            if (result.status == 1) {
                // $scope.forms.ownerCampaignForm.$setPristine();
                // $scope.forms.ownerCampaignForm.$setUntouched();
                loadOwnerCampaigns();
                $scope.ownerCampaign = {};
                toastr.success(result.message);
                OwnerCampaignService.getCampaignWithProductsForOwner(result.camp_id).then(function (result) {
                    localStorage.selectedOwnerCampaign = JSON.stringify(result);
                    $location.path('/owner/' + $rootScope.clientSlug + '/add-campagin-product');
                });
            } else if (result.status == 0) {
                $rootScope.closeMdDialog();
                if (result.message.constructor == Array) {
                    $scope.ownerCampaignErrors = result.message;
                } else {
                    toastr.error(result.message);
                }
            } else {
                toastr.error(result.message);
            }
            CreatecampFunction();
        });
    }
    function CreatecampFunction() {
        document.getElementById("createcampDropdown").classList.toggle("show");
    }
    // function CreatecampFunctions() {
    //     document.getElementById("myDropdownView").classList.toggle("show");
    // }
    $scope.saveMetroCampaign = function (metroCampagin) {
        MetroService.saveMetroCampaign(metroCampagin).then(function (result) {
            if (result.status == 1) {
                $scope.metroCampagin = {};
                // $scope.forms.MetroCampaign.$setPristine();
                // $scope.forms.MetroCampaign.$setUntouched();
                loadMetroCampaigns();
                $window.location.href = '#/owner/{{clientSlug}}/metro-campaign-details/' + result.metro_camp_id;
                toastr.success(result.message);
            } else if (result.status == 0) {
                $rootScope.closeMdDialog();
                if (result.message.constructor == Array) {
                    $scope.MetroCampaignErrors = result.message;
                } else {
                    toastr.error(result.message);
                }
            } else {
                toastr.error(result.message);
            }
            CreatecampFunction();
        });
    }

    $scope.toggleShareCampaignSidenav = function (campaign) {
        $scope.currentOwnerShareCampaign = campaign;
        $mdSidenav('shareCampaignSidenav').toggle();
    };

    $scope.changeQuoteRequest = function (campaignId, remark, type) {
        $scope.changeRequest = {};
        $scope.changeRequest.for_campaign_id = campaignId;
        $scope.changeRequest.remark = remark;
        $scope.changeRequest.type = type;
        OwnerCampaignService.requestChangeInQuote($scope.changeRequest).then(function (result) {
            if (result.status == 1) {
                $scope.getUserCampaignDetails(campaignId);
                //$mdDialog.hide();
                toastr.success(result.message);
            } else {
                toastr.error(result.message);
            }
        });
    }

    $scope.suggestProductForOwnerCampaign = function (ownerProduct) {
        if (!localStorage.selectedOwnerCampaign) {
            toastr.error("No Campaign is seleted. Please select which campaign you're adding this product in to.")
        } else {
            var postObj = {
                campaign_id: JSON.parse(localStorage.selectedOwnerCampaign).id,
                product: {
                    id: ownerProduct.id,
                    booking_dates: ownerProduct.booking_dates,
                    price: ownerProduct.default_price,
                    views:ownerProduct.impressions
                }
            };
            OwnerCampaignService.proposeProductForCampaign(postObj).then(function (result) {              
                if (result.status == 1) {
                    OwnerCampaignService.getOwnerCampaignDetails(JSON.parse(localStorage.selectedOwnerCampaign).id).then(function (updatedCampaignData) {
                        localStorage.selectedOwnerCampaign = JSON.stringify(updatedCampaignData);
                        $scope.campaignActBudget = updatedCampaignData.act_budget;
                        _.map($scope.productList, function (product) {
                            if (product.id == ownerProduct.id) {
                                product.alreadyAdded = true;
                            }
                            return product;
                        });
                    });
                    toastr.success(result.message);
                    $state.reload();
                } else {
                    toastr.error(result.message);
                }
            });
        }
    }
    
    $scope.getProductUnavailableDates = function (productId, ev) {
        OwnerProductService.getProductUnavailableDates(productId).then(function (dateRanges) {
            $scope.unavailalbeDateRanges = dateRanges;
            $(ev.target).parent().parent().find('input').trigger('click');
        });
    }

    /* ============================
     | Campaign details section
     ============================= */

    $scope.campaignDetails = {};

    $scope.getUserCampaignDetails = function (campaignId) {
        OwnerCampaignService.getCampaignWithProductsForOwner(campaignId).then(function (result) {
            $scope.campaignDetails = result;
            if (typeof result.act_budget === 'number' && result.act_budget % 1 == 0) {
                // $scope.campaignDetails.gst = result.act_budget * 18 / 100;
                $scope.campaignDetails.subTotal = result.act_budget;
                $scope.campaignDetails.grandTotal = $scope.campaignDetails.subTotal;
                $scope.PendingPay = $scope.campaignDetails.act_budget - result.total_paid;
            }
            // if ($scope.campaignDetails.gst_price != "0") {
            //     $scope.onchecked = true;
                // $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
            // $scope.TOTAL = $scope.campaignDetails.act_budget;
            //   } else {
            //     $scope.onchecked = false;
            //     $scope.GST = "0";
            //     $scope.TOTAL = $scope.campaignDetails.act_budget;
            //   }  
            $scope.TOTAL = $scope.campaignDetails.act_budget         
        });
    }
    $scope.getOwnerCampaignDetails = function (campaignId) {
        OwnerCampaignService.getOwnerCampaignDetails(campaignId).then(function (result) {
            $scope.campaignDetails = result;
            if (typeof result.act_budget === 'number' && result.act_budget % 1 == 0) {
                // $scope.campaignDetails.gst = result.act_budget * 18 / 100;
                // $scope.campaignDetails.subTotal = result.act_budget ;
                // $scope.campaignDetails.grandTotal = $scope.campaignDetails.subTotal;
                //$scope.PendingPay = $scope.campaignDetails.act_budget - result.total_paid;
            }
            // if ($scope.campaignDetails.gst_price != "0") {
            //     $scope.onchecked = true;
            //     $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
            // $scope.TOTAL = $scope.campaignDetails.act_budget + $scope.GST;
            //   } else {
            //     $scope.onchecked = false;
            //     $scope.GST = "0";
            //     $scope.TOTAL = $scope.campaignDetails.act_budget +  parseInt($scope.GST);
            //   }
        });
    }
    // $scope.uncheck = function(checked) {
    //     if (!checked) {
    //       $scope.GST = "0";
    //       $scope.TOTAL = $scope.campaignDetails.act_budget + parseInt($scope.GST);
    //     }else{
    //       $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
    //         $scope.TOTAL = $scope.campaignDetails.act_budget + $scope.GST;
    //     }
    // };
    
  $scope.uncheck = function(checked) {
    if (!checked) {
      $scope.GST = "0";
      $scope.onchecked = false;
      $scope.TOTAL = $scope.campaignDetails.act_budget + parseInt($scope.GST);
    } else {
      $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
      $scope.TOTAL = $scope.campaignDetails.act_budget + $scope.GST;
      $scope.onchecked = true;
    }
  };
    function getMetroCampaignDetails() {
        MetroService.getMetroCampaigns().then((result) => {
            $scope.metrocampaign = result;
        });
    }
    function getMetroCampDetails(metroCampaignId) {
        MetroService.getMetroCampDetails(metroCampaignId).then((result) => {
            $scope.metroCampaginDetails = result;
        });
    }


    $scope.viewProductImage = function (image) {
        var imagePath = config.serverUrl + image;
        $mdDialog.show({
            locals: {src: imagePath},
            templateUrl: 'views/image-popup-large.html',
            preserveScope: true,
            scope: $scope,
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose: true,
            controller: function ($scope, src) {
                $scope.img_src = src;
            }
        });
    }
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
    $scope.finalizeCampaign = function () {
        OwnerCampaignService.finalizeCampaignByOwner($scope.campaignDetails.id).then(function (result) {
            if (result.status == 1) {
                toastr.success("Campaign Finalized!");
            } else {
                toastr.error(result.message);
            }
        });
    }

    $scope.editProposedProduct = function (productId, from_date, to_date, price) {
        var productObj = {
            id: productId,
            from_date: $scope.campaignDetails.start_date,
            to_date: $scope.campaignDetails.end_date,
            price: price
        };
        $mdDialog.show({
            locals: {campaign: $scope.campaignDetails, productObj: productObj, ctrlScope: $scope},
            templateUrl: 'views/owner/edit-proposed-product.html',
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose: true,
            controller: function ($scope, $mdDialog, ctrlScope, campaign, productObj) {
                $scope.product = productObj;
                $scope.OwnerProposalStartDate = new Date(campaign.start_date);
                $scope.OwnerProposalEndDate = new Date(campaign.end_date);
                $scope.OwnerProposalFromMinDate = moment(campaign.start_date).toDate();
                $scope.OwnerProposalFromMaxDate = moment(campaign.end_date).toDate();
                $scope.OwnerProposaltoMinDate = moment($scope.product.start_date).toDate();
                $scope.OwnerProposalToMaxDate = moment(campaign.end_date).toDate();
                $scope.updateProposedProduct = function (product) {
                    OwnerCampaignService.updateProposedProduct(campaign.id, $scope.product).then(function (result) {
                        if (result.status == 1) {
                            // update succeeded. update the grid now.
                            if (campaign.type != "2") {
                                ctrlScope.getUserCampaignDetails(campaign.id);
                            } else {
                                ctrlScope.getOwnerCampaignDetails(campaign.id);
                            }
                            $mdDialog.hide();
                            toastr.success(result.message);
                        } else {
                            toastr.error(result.message);
                        }
                    });
                }
                $scope.closeMdDialog = function () {
                    $mdDialog.hide();
                }
            }
        });
    }
    $scope.addNewProductToCampaign = function () {
        localStorage.selectedOwnerCampaign = JSON.stringify($scope.campaignDetails);
        $location.path('/owner/' + $rootScope.clientSlug + '/add-campagin-product');
    }

    $scope.removeProductFromCampaignSuggestion = function (productId) {
        var campaignId = JSON.parse(localStorage.selectedOwnerCampaign).id;
        OwnerCampaignService.deleteProductFromCampaign(campaignId, productId).then(function (result) {
            if (result.status == 1) {
                OwnerCampaignService.getOwnerCampaignDetails(JSON.parse(localStorage.selectedOwnerCampaign).id).then(function (updatedCampaignData) {
                    localStorage.selectedOwnerCampaign = JSON.stringify(updatedCampaignData);
                    $scope.campaignActBudget = updatedCampaignData.act_budget;
                    _.map($scope.productList, function (product) {
                        if (product.id == productId) {
                            product.alreadyAdded = false;
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

    $scope.bookOwnerCampaign = function (campaignId, ev) {
        // if ($scope.onchecked === true) {
        //     $scope.flag = 1;
        //     // $scope.GST = ($scope.campaignDetails.act_budget / 100) * 18;
        //   } else if ($scope.onchecked === false) {
        //     $scope.flag = 0;
        //     // $scope.GST = "0";
        //   } else{
        //     $scope.flag = 1;
        //   }    
        OwnerCampaignService.bookNonUserCampaign(campaignId).then(function (result) {
            if (result.status == 1) {
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
                $scope.getOwnerCampaignDetails(campaignId);
                $state.reload();
            } else {
                if (result.product_ids && result.product_ids.length > 0) {
                    toastr.error(result.message);
                    _.map($scope.campaignDetails.products, (p) => {
                        if (_.contains(result.product_ids, p.product_id)) {
                            p.unavailable = true;
                        }
                    });
                } else {
                    toastr.error(result.message);
                }
            }
        });
    }

    $scope.deleteOwnerCampaign = function (campaignId) {
        OwnerCampaignService.deleteOwnerCampaign(campaignId).then(function (result) {
            if (result.status == 1) {
                loadOwnerCampaigns();
                toastr.success(result.message);
            } else {
                toastr.error(result.message);
            }
        })
    }

    $scope.closeCampaign = function (campaignId, ev) {
        OwnerCampaignService.closeCampaign(campaignId).then(function (result) {
            if (result.status == 1) {
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
                $scope.getOwnerCampaignDetails(campaignId);
            } else {
                toastr.error(result.message);
            }
        });
    }

    $scope.deleteProductFromCampaign = function (campaignId, productId) {
        OwnerCampaignService.deleteProductFromCampaign(campaignId, productId).then(function (result) {
            if (result.status == 1) {
                if ($stateParams.campaignType == 2) {
                    $scope.getOwnerCampaignDetails(campaignId);
                } else {
                    $scope.getUserCampaignDetails(campaignId);
                }
                toastr.success(result.message);
            } else {
                toastr.error(result.message);
            }
        });
    }

    $scope.productOwnerPrice=function(productPrice,productId ) {
        $scope.campaignDetails.products.forEach(element => {
            if(element.owner_price === undefined && element.id === productId){
                element.owner_price = productPrice;
            }
        });
}
    /* ==============================
     | Campaign details section ends
     =============================== */
    // filter-code
    $scope.viewSelectedProduct = function (product) {
        $scope.pagination.pageCount = 1;
        $scope.productList = [product];
    }
    $scope.productSearch = function (query) {
        return ProductService.searchProducts(query.toLowerCase()).then(function (res) {
            $scope.productList = res;
            $scope.pagination.pageCount = 1;
            return res;
        });
    }

    $scope.applymethod = function (product) {
        var data = {};
        var pageNo = $scope.pagination.pageNo;
        var pageSize = $scope.pagination.pageSize;
        var format = product.type;
        var budget = product.budgetprice;
        var start_date = product.start_date;
        var end_date = product.end_date;
        if (!format) {
            format = '';
        }
        if (!budget) {
            budget = '';
        }
        if (pageNo || pageSize || format || budget || start_date || end_date) {
            data.page_no = pageNo;
            data.page_size = pageSize;
            data.format = format;
            data.budget = budget;
            data.start_date = start_date;
            data.end_date = end_date;
        }
        OwnerProductService.getApprovedProductList(data).then(function (result) {
            $scope.productList = result.products;
            $scope.pagination.pageCount = result.page_count;
            if ($window.innerWidth >= 420) {
                createPageLinks();
            } else {
                $scope.getRange(0, result.page_count);
            }
        });
    }
    var getFormatList = function () {
        OwnerProductService.getFormatList().then(function (result) {
            $scope.formatList = result;
        });
    }
    getFormatList();
// Filter-code ends
    function getActiveUserCampaigns() {
        CampaignService.getActiveUserCampaigns().then(function (result) {
            $scope.ownerSaved = result;
            $scope.ownerSavedCampaigns = _.filter(result, function (c) {
                return c.status == 100 || c.status == 200;
            });
        });
    }

    /* ==============================
     | Campaign payment section
     =============================== */
    function getCampaignWithPayments() {
        OwnerCampaignService.getCampaignWithPayments().then(function (result) {
            $scope.campaignsWithPayments = result;
        });
    }

    $scope.getCampaignPaymentDetails = function (campaignId) {
        // localStorage.campaignPaymentDetailsCampaignId= campaignId;
        OwnerCampaignService.getCampaignPaymentDetails(campaignId).then(function (result) {
            //$scope.showCampaignPaymentSidenav();
            $scope.campaignPaymentDetails = result;
            var campaignPayments = $scope.campaignPaymentDetails.payment_details;
            $scope.paid = 0;
            _.each(campaignPayments, function (p) {
                $scope.paid += p.amount;
            });
            //$scope.unpaid = $scope.campaignPaymentDetails.act_budget + parseInt($scope.campaignPaymentDetails.gst_price);
        });
    }

    $scope.paymentTypes = [
        {name: "Cash"},
        {name: "Cheque"},
        {name: "Online"},
        {name: "Transfer"}
    ];
    $scope.files = {};
    $scope.updateOwnerCampaignPayment = function (id) {
        $scope.campaignPayment.campaign_id = id;
        Upload.upload({
            url: config.apiPath + '/update-campaign-payment-owner',
            data: {image: $scope.files.image, campaign_payment: $scope.campaignPayment}
        }).then(function (result) {
            if (result.data.status == "1") {
                toastr.success(result.data.message);
                $scope.campaignPayment = {};
                $scope.files.image = "";
                // setTimout(() => {
                //     $location.path('/owner/' + $rootScope.clientSlug + '/payments');
                // }, 2500);
                addPayment();
                $state.reload();
            } else {
                if (result.data.message.constructor == Array) {
                    $scope.updateCampaignPaymentErrors = result.data.message;
                } else {
                    toastr.error(result.data.message);
                }
            }
        }, function (resp) {
            toastr.error("somthing went wrong try again later");
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
    function addPayment() {
        document.getElementById("addpaymentdrop").classList.toggle("show");
    }

    /* ==============================
     | Campaign payment section ends
     =============================== */


    /*==============================
     | Campaign Search
     ==============================*/
    // $scope.simulateQuery = false;
    $scope.isDisabled = false;
    // $scope.querySearch   = querySearch;
    // $scope.selectedItemChange = selectedItemChange;
    // $scope.searchTextChange   = searchTextChange;


    $scope.campaignSearch = function (query) {
        return OwnerCampaignService.searchCampaigns(query.toLowerCase()).then(function (res) {
            return res;
        });
    }

    // function shareEmailCampaign() {
    //     document.getElementById("myDropdown").classList.toggle("hide");
    //   }
    //   function close() {
    //     angular.element(document.querySelector("#shareDropdown")).addClass("hide");
    //     angular.element(document.querySelector("#shareDropdown")).removeClass("show");
    // }
    $scope.viewSelectedCampaign = function (campaign) {
        $location.path('/owner/' + $rootScope.clientSlug + '/campaign-details/' + campaign.id + "/" + campaign.type);
    }
    $scope.shareCampaignToEmail = function (ev, shareCampaign, campaignID) {
        $scope.campaignToShare = $scope.campaignDetails;
        var campaignToEmail = {
            campaign_id: campaignID,
            email: shareCampaign.email,
            receiver_name: shareCampaign.receiver_name,
            campaign_type: $scope.campaignToShare.type
        };
        CampaignService.shareCampaignToEmail(campaignToEmail).then(function (result) {
            if (result.status == 1) {
                $mdSidenav('shareCampaignSidenav').close();
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('body')))
                        .clickOutsideToClose(true)
                        .title(result.message)
                        // .textContent('You can specify some description text in here.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!')
                        .targetEvent(ev)
                        );
                //close();  
                shareOwnerCampaign();
            } else {
                toastr.error(result.message);
            }
            $scope.shareCampaign = '';
        });
    }
    //campaign share closed
    function selectedItemChange(item) {
    }
    /*==============================
     | Campaign Search
     ==============================*/
    // function shareownerCampaign() {
    //     angular.element(document.querySelector("#sharecampDrop")).addClass("hide");
    //     angular.element(document.querySelector("#ownerupdatepaymentDrop")).removeClass("show");
    // }
    function shareOwnerCampaign() {
        document.getElementById("shareownercampDrop").classList.toggle("show");   
      }
    /*=========================
     | Page based initial loads
     =========================*/
    if ($rootScope.currStateName == "owner.campaigns") {
        $scope.getUserCampaignsForOwner();
        loadOwnerCampaigns();
        setMinMaxDatesForCamapign();
    }
    if ($rootScope.currStateName == "owner.bbi-campaigns") {
        $scope.getUserCampaignsForOwner();
    }
    if ($rootScope.currStateName == "owner.add-campagin-product") {
        loadOwnerProductList();
        $scope.selectedOwnerCampaign = JSON.parse(localStorage.selectedOwnerCampaign);
    }
    if (typeof $stateParams.campaignId !== 'undefined' && typeof $stateParams.campaignType !== 'undefined') {
        if ($stateParams.campaignType == 2) {
            $scope.getOwnerCampaignDetails($stateParams.campaignId);
        } else {
            $scope.getUserCampaignDetails($stateParams.campaignId);
        }
    }

    if ($rootScope.currStateName == 'owner.payments') {
        $scope.getUserCampaignsForOwner();
        loadOwnerCampaigns();
    }

    if ($rootScope.currStateName == 'owner.updatepayment') {
        $scope.getCampaignPaymentDetails($stateParams.id)
        getCampaignWithPayments();
        $scope.allCampaignsForOwner = [];
        loadOwnerCampaigns().then(function (result) {
            $scope.getUserCampaignsForOwner().then(function (result2) {
                $scope.allCampaignsForOwner = _.filter(result.concat(result2), function (c) {
                    return c.status >= 600;
                });
            });
        })
    }

    //call campaign count for hoarding list
    $scope.getCampaignList = function () {
        var productId = $stateParams.productId;
        OwnerCampaignService.getCampaignsFromProducts(productId).then(function (result) {
            if (result) {
                $scope.shortlistedproduct = result;
                //toastr.success(result.message);        
            } else {
                toastr.error(result.data.message);
            }
        });
    }
    if ($location.$$path.search("product-shortlist-campagin") !== -1) {
        $scope.getCampaignList();
    }


    $scope.changeCampaignProductPrice = function (campaign_id, owner_price, id, product_id) {
        product = {};
        product.campaign_id = campaign_id;
        product.owner_price = owner_price;
        product.product_id = product_id;
        product.product = id;
        OwnerProductService.changeCampaignProductPrice(product).then(function (result) {
            if (result.status == 1) {
                toastr.success(result.message);
                $state.reload();
            } else {
                toastr.error(result.data.message);
            }
        });

    }

    $scope.downloadOwnerQuote = function (campaignId) {
        OwnerCampaignService.downloadQuote(campaignId).then(function (result) {
            var campaignPdf = new Blob([result], {type: 'application/pdf;charset=utf-8'});
            FileSaver.saveAs(campaignPdf, 'campaigns.pdf');
            if (result.status) {
                toastr.error(result.meesage);
            }
        });
    };
    $scope.downloadOwnerPop = function (campaignId) {
        OwnerCampaignService.generatepop(campaignId).then(function (result) {
            var campaignPdf = new Blob([result], {type: 'application/pdf;charset=utf-8'});
            FileSaver.saveAs(campaignPdf, 'POP_Report.pdf');
            if (result.status) {
                toastr.error(result.meesage);
            }
        });
    };
    // if ($rootScope.currStateName == 'owner.update-payments') {

    // }

    /*=============================
     | Page based initial loads end
     =============================*/



     /* ----------------------------
                    New Hording profuct Nav bars starts
                -------------------------------*/
                $scope.yearlyWeeks =[];
                $scope.weeksArray = [];
                var  weeklyPackageValue = 4;
                var selectWeekValue = 0;
                for(var i=1;i<=25;i++){
                    $scope.yearlyWeeks.push({weeklyPackage : weeklyPackageValue})
                    weeklyPackageValue +=2
                }
                
                for(var i=1;i<=26;i++){
                    $scope.weeksArray.push({twoWeeks : 2})
                }
                var currentDay =  moment().format('LLLL').split(',')[0];

                function productDatesCalculator(){
                    var slotPrices =0;
                    for(item in $scope.yearlyWeeks){
                        if(item == 0){
                            slotPrices = $scope.ownerProductPrice;
                            $scope.yearlyWeeks[item].price = slotPrices;
                        }else{
                            slotPrices = parseInt(slotPrices) + (parseInt($scope.ownerProductPrice)/2)
                            $scope.yearlyWeeks[item].price = slotPrices;
                        }
                    }
                    var unavailBoundaries = [];
                    $scope.unavailalbeDateRanges.forEach((dates) => {
                        unavailBoundaries.push(moment(dates.booked_from))
                        unavailBoundaries.push(moment(dates.booked_to))
                    });
                    if(currentDay == 'Monday'){
                        var startDay = moment(new Date()).add(7,'days').format('LLLL');
                        var endDay = moment(new Date()).add(7+13,'days').format('LLLL');
                        $scope.weeksArray[0].startDay = startDay;
                        $scope.weeksArray[0].endDay = endDay;
                        unavailBoundaries.forEach((date) => {
                            $scope.weeksArray[0].isBlocked = date.isSameOrAfter(startDay) && date.isSameOrBefore(endDay);
                        });

                    }else{
                        var tempDay;
                        for(i=1;i<=6;i++){
                             tempDay = moment(new Date()).add(i,'days').format('LLLL').split(',')[0];
                             tempDay = moment(new Date()).add(i,'days').format('LLLL').split(',')[0];
                             if(tempDay == 'Monday'){
                                var startDay = moment(new Date()).add(i+7,'days').format('LLLL');
                                var endDay = moment(new Date()).add(i+7+13,'days').format('LLLL');
                                $scope.weeksArray[0].startDay = startDay;
                                $scope.weeksArray[0].endDay = endDay;
                                var isBlocked = false;
                                for (var date of unavailBoundaries) {
                                    if (date.isSameOrAfter(startDay) && date.isSameOrBefore(endDay)) {
                                        isBlocked = true;
                                        break;
                                    }
                                }
                                $scope.weeksArray[0].isBlocked = isBlocked;
                             }

                        }
                       
                    }

                    var tempororyStartDate = $scope.weeksArray[0].endDay;
                    $scope.weeksArray.forEach(function(item,index){
                        if(index > 0){
                            item.startDay = moment(tempororyStartDate).add(1,'days').format('LLLL');
                            item.endDay = moment(tempororyStartDate).add(14,'days').format('LLLL');
                            tempororyStartDate = item.endDay;
                            var isBlocked = false;
                            for (var date of unavailBoundaries) {
                                if (date.isSameOrAfter(item.startDay) && date.isSameOrBefore(item.endDay)) {
                                    isBlocked = true;
                                    break;
                                }
                            }
                            $scope.weeksArray[index].isBlocked = isBlocked;
                            // unavailBoundaries.forEach((date) => {
                            //     $scope.weeksArray[index].isBlocked = date.isSameOrAfter(moment(tempororyStartDate).add(1,'days').format('LLLL')) && date.isSameOrBefore(moment(tempororyStartDate).add(14,'days').format('LLLL'));
                            // });
                        }

                    })

                }
                // productDatesCalculator();
                $scope.selectHordingWeeks = function(weeks) {
                    $scope.yearlyWeeks.filter((week) => week.selectedWeek).forEach((week) => {
                        week.selectedWeek = false;
                    });
                    for(var i=0;i<$scope.yearlyWeeks.length; i++){
                        if($scope.yearlyWeeks[i].weeklyPackage == weeks.weeklyPackage){
                            $scope.yearlyWeeks[i].selectedWeek = true;
                            selectWeekValue = $scope.yearlyWeeks[i];
                            $scope.ownerTotalPrice = selectWeekValue.price;
                        }
                    }
                    $scope.weeksArray.filter((week) => week.selected).forEach((week) => {
                        week.selected = false;
                    });
                    var countWeeks = 0;
                    for(var nextSelected in $scope.weeksArray){
                        if($scope.weeksArray[nextSelected].isBlocked && $scope.weeksArray[nextSelected].isBlocked == true){
                            $scope.weeksArray.filter((week) => week.selected).forEach((week) => {
                                 week.selected = false;
                            });
                            countWeeks =0;
                        }else{ 
                            $scope.weeksArray[nextSelected].selected = true;
                            countWeeks +=1;
                            var leftPos = $('#scrollFind').scrollLeft();
                            $("#scrollFind").animate({scrollLeft: leftPos*0}, 0);
                            if(countWeeks == weeks.weeklyPackage/2){
                                $("#scrollFind").animate({scrollLeft: leftPos + ((nextSelected - (weeks.weeklyPackage/2)) * 115)}, 800);
                                break;
                            }
                        }
                    }
                    if(weeks.weeklyPackage/2 > countWeeks ){
                        $scope.packagePopUp = true;
                        $scope.weeksArray.filter((week) => week.selected).forEach((week) => {
                            week.selected = false;
                        });
                        alert("we don't have slots please select another slots")
                        // $scope.selectPackageAbove = {head : "slots are not available",dsc : "we don't have slots please select another slots"}
                        // $scope.totalSlotAmount = 0
                        return false;
                        } 
                        // $scope.totalSlotAmount = selectWeekValue.price;

                    }
                $scope.packagePopUp = false;
                $scope.closeSelectedPopup = function(){
                    $scope.packagePopUp = false;
                }
                $scope.selectUserWeeks = function(weeks,index,ev){
                    if(!(Object.prototype.toString.call(selectWeekValue) == "[object Object]") || Object.keys(selectWeekValue).length == 0 ){
                        alert("please select package above")
                        // $scope.packagePopUp = true;
                        // $scope.selectPackageAbove = {head : "select the package above",dsc : "please Select Campaign Duration"}
                        return false;
                    }else{
                        $scope.weeksArray.filter((week) => week.selected).forEach((week) => {
                            week.selected = false;
                        });
                        if((selectWeekValue.weeklyPackage/2) > ($scope.weeksArray.length - index)){
                            
                            alert("please Select Campaign Duration")
                            // $scope.packagePopUp = true;
                            // $scope.selectPackageAbove = {head : "select the package above",dsc : "please Select Campaign Duration"}    
                            return false;
                        };
                        for(var i=index; i < (selectWeekValue.weeklyPackage/2 + index); i++) {   
                            if($scope.weeksArray[i].isBlocked && $scope.weeksArray[i].isBlocked == true){
                                $scope.weeksArray.filter((week) => week.selected).forEach((week) => {
                                    week.selected = false;
                                });
                                alert("select the another slots")
                                // $scope.packagePopUp = true;
                                // $scope.selectPackageAbove = {head : "select the another slots",dsc : "please Select another slots these are not available"}
                                return false;                                
                            } else{
                                $scope.weeksArray[i].selected = true;
                            }
                        };
                    };
                };
                $scope.toggleProductDetailSidenav = function(type){
                    if(type == "Bulletin"){
                        $("#exampleModalcalendar").modal("hide"); 
                        selectWeekValue = 0;
                        $scope.yearlyWeeks.filter((week) => week.selectedWeek).forEach((week) => {
                            week.selectedWeek = false;
                        });
                        $scope.weeksArray.filter((week) => week.selected).forEach((week) => {
                            week.selected = false;
                        });
                    }else{
                        $scope.weeksDigitalArray.filter(function(week) {
                            if(week.selected || week.isBlocked){
                                return true;
                            }
                        }).forEach((week) => {
                            week.selected = false;
                            week.isBlocked = false;
                            // week.availableSlots = 0;
                        });
                        $scope.digitalNumOfSlots.value = 0;
                        
                        $("#digitalTransitCalender").modal("hide"); 
                    }
                   
                    
                }

                /* ----------------------------
                    New Hording profuct Nav bars ends
                -------------------------------*/


                 /* ----------------------------
              New Hording digital bullitin product Nav bars Start
          -------------------------------*/

  var digitalSlots = 0;
  $scope.digitalSlots = [];
  $scope.weeksDigitalArray = [];
  $scope.digitalSlotsClosed = false;

  for (var i = 1; i <= 26; i++) {
    $scope.weeksDigitalArray.push({ twoWeeks: 1 })
  }
  $scope.digitalNumOfSlots = {value : 0};
  $scope.blockSlotChange = function () {
    $scope.weeksDigitalArray.forEach((item) => { item.selected = false; item.isBlocked = false; $scope.totalDigitalSlotAmount = 0 })
    $scope.weeksDigitalArray.forEach(function (item) {
      $scope.unavailalbeDateRanges.forEach(function (unAvailable) {
        if ((moment(item.startDay).format('DD-MM-YYYY') == moment(unAvailable.booked_from).format('DD-MM-YYYY')) && (moment(item.endDay).format('DD-MM-YYYY') == moment(unAvailable.booked_to).format('DD-MM-YYYY'))) {
            item.availableSlots = ($scope.digitalSlots.length - unAvailable.booked_slots)
          if (item.availableSlots == 0) {
            item.isBlocked = true;
          }
        } else if ((moment(unAvailable.booked_from).isSameOrAfter(moment(item.startDay).format('YYYY-MM-DD')) && moment(unAvailable.booked_from).isSameOrBefore(moment(item.endDay).format('YYYY-MM-DD'))) || (moment(moment(unAvailable.booked_to).format('YYYY-MM-DD')).isSameOrAfter(moment(item.startDay).format('YYYY-MM-DD')) && moment(moment(unAvailable.booked_to).format('YYYY-MM-DD')).isSameOrBefore(moment(item.endDay).format('YYYY-MM-DD')))) {
          item.availableSlots = ($scope.digitalSlots.length - unAvailable.booked_slots)
          if (item.availableSlots == 0) {
            item.isBlocked = true;
          }
        }
      })
    })
  }
  function productDatesDigitalCalculator() {
    for (var i = 1; i <= digitalSlots; i++) {
      $scope.digitalSlots.push(i)
    }
    var slotPrices =0;
    for (item in $scope.weeksDigitalArray) {
      $scope.weeksDigitalArray[item].price = $scope.ownerProductPrice;
    }
    if (currentDay == 'Monday') {
      var startDay = moment(new Date()).add(7, 'days').format('LLLL');
      var endDay = moment(new Date()).add(7 + 6, 'days').format('LLLL');
      $scope.weeksDigitalArray[0].startDay = startDay;
      $scope.weeksDigitalArray[0].endDay = endDay;
    } else {
      var tempDay;
      for (i = 1; i <= 6; i++) {
        tempDay = moment(new Date()).add(i, 'days').format('LLLL').split(',')[0];
        if (tempDay == 'Monday') {
          var startDay = moment(new Date()).add(i, 'days').format('LLLL');
          var endDay = moment(new Date()).add(i + 6, 'days').format('LLLL');
          $scope.weeksDigitalArray[0].startDay = startDay;
          $scope.weeksDigitalArray[0].endDay = endDay;
        }

      }

    }
    var tempororyStartDate = $scope.weeksDigitalArray[0].endDay;
    $scope.weeksDigitalArray.forEach(function (item, index) {
      if (index > 0) {
        item.startDay = moment(tempororyStartDate).add(1, 'days').format('LLLL');
        item.endDay = moment(tempororyStartDate).add(7, 'days').format('LLLL');
        tempororyStartDate = item.endDay;
      }

    })
  }

  
  $scope.totalDigitalSlotAmount = 0;
  $scope.selectUserDigitalWeeks = function (weeks, index, ev) {
    if ($scope.digitalNumOfSlots.value == 0) {
      alert("please select no. of slots")
      return false;
    }
    if ($scope.digitalNumOfSlots.value > weeks.availableSlots) {
      alert("As you are exceeding the slots. you can't book it");
      return false;
    }
    if ($scope.weeksDigitalArray[index].selected == true) {
      $scope.weeksDigitalArray[index].selected = false;
      $scope.totalDigitalSlotAmount -= parseInt(parseInt($scope.digitalNumOfSlots.value) * parseInt($scope.weeksDigitalArray[index].price));

    } else {
      $scope.totalDigitalSlotAmount += parseInt(parseInt($scope.digitalNumOfSlots.value) * parseInt($scope.weeksDigitalArray[index].price));
      $scope.weeksDigitalArray[index].selected = true;

    }
  };
//   $scope.digitalSelectUserWeeks = function (weeks, index, ev) {

//     if ($scope.weeksDigitalArray[index].selected && $scope.weeksDigitalArray[index].selected == true) {
//       $scope.weeksDigitalArray[index].selected = false;

//     } else {
//       $scope.weeksDigitalArray[index].selected = true;
//     }
//   }
  $scope.digitalSlotedDatesPopupClosed = function () {
    $scope.digitalSlotsClosed = false;
  }
  $scope.digitalBlockedSlotesbtn = function (weeksArray) {
    $scope.product.dates = [];
    weeksArray.filter((week) => week.selected).forEach(function (item) {
      var startDate = moment(item.startDay).format('YYYY-MM-DD')
      var endDate = moment(item.endDay).format('YYYY-MM-DD')

      $scope.product.dates.push({ startDate: startDate, endDate: endDate })
      $scope.digitalSlotedDatesPopupClosed();
    })

  }

  /* ----------------------------
  New Hording Digital bullitin product Nav bars Ends
-------------------------------*/




//page width
    $scope.innerWidth = $window.innerWidth;
    // loadMetroCampaigns();
    // getMetroCampaignDetails();
    getActiveUserCampaigns();
    //getMetroCampDetails($stateParams.metroCampaignId);
});