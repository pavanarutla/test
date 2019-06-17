app.controller('OwnerProductCtrl', function ($scope, $mdDialog, $mdSidenav, $stateParams, $rootScope, $window, MapService, OwnerProductService, ProductService, OwnerLocationService, OwnerCampaignService, Upload, config, toastr, $state) {

  $scope.unavailalbeDateRanges = [];
  // $scope.loadCalendar = false;

  /*===================
  | Sidenavs and popups
  ===================*/

  $scope.toggleRequestHoardingFormSidenav = function () {
    $mdSidenav('request-hoarding-sidenav').toggle();
  };

  $scope.openScreen = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/owner/requesthoardingadd.html',
      clickOutsideToClose: true,
    });
  };

  $scope.viewImage = function () {
    $mdDialog.show({
      templateUrl: 'views/owner/view-image.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  $scope.toggleShareProductSidenav = function () {
    $mdSidenav('shareProductSidenav').toggle();
  };

  $scope.toggleShortlistProductsSidenav = function () {
    $mdSidenav('shortlistedProductsSidenav').toggle();
  }

  $scope.toggleShareProductsSidenav = function () {
    $mdSidenav('shareProductsSidenav').toggle();
  }

  $scope.toggleOwnerAddCampaignSidenav = function () {
    $mdSidenav('ownerAddCampaignSidenav').toggle();
  }
  /*========================
  | Sidenavs and popups ends
  ========================*/

  /*===================
  | Pagination
  ===================*/
  $scope.pagination = {};
  $scope.pagination.pageNo = 1;
  $scope.pagination.pageSize = 500;
  $scope.pagination.pageCount = 0;
  var pageLinks = 20;
  var lowest = 1;
  var highest = lowest + pageLinks - 1;
  function createPageLinks() {
    var mid = Math.ceil(pageLinks / 2);
    if ($scope.pagination.pageCount < $scope.pagination.pageSize) {
      lowest = 1;
    }
    else if ($scope.pagination.pageNo >= ($scope.pagination.pageCount - mid) && $scope.pagination.pageNo <= $scope.pagination.pageCount) {
      lowest = $scope.pagination.pageCount - pageLinks;
    }
    else if ($scope.pagination.pageNo > 0 && $scope.pagination.pageNo <= pageLinks / 2) {
      lowest = 1;
    }
    else {
      lowest = $scope.pagination.pageNo - mid + 1;
    }
    highest = $scope.pagination.pageCount < $scope.pagination.pageSize ? $scope.pagination.pageCount : lowest + pageLinks;
    $scope.pagination.pageArray = _.range(lowest, highest + 1);
  }
  $scope.getRange = function (b, e) {
    $scope.pageRange = [];
    for (i = b + 1; i <= e; i++) {
      $scope.pageRange.push(i);
    }
    return $scope.pageRange;
  }
  /*===================
  | Pagination Ends
  ===================*/


  $scope.getProductByFormat = function (format) {
    $scope.format = format;
    OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize, format).then(function (result) {
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      if ($window.innerWidth >= 420) {
        createPageLinks();
      }
      else {
        $scope.getRange(0, result.page_count);
      }
    });
  };
  $scope.getBudget = function (price) {
    $scope.price = price;
    OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize, format, price).then(function (result) {
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      if ($window.innerWidth >= 420) {
        createPageLinks();
      }
      else {
        $scope.getRange(0, result.page_count);
      }
    });
  };
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
      }
      else {
        $scope.getRange(0, result.page_count);
      }
    });
  }

  /*================================
  | Multi date range picker options
  ================================*/
  $scope.rqstHrdngsOpts = {
    multipleDateRanges: true,
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
    }
  };
  $scope.inventoryListOpts = {
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
    },
    isCustomDate: function (dt) {
      for (var i = 0; i < $scope.unavailalbeDateRanges.length; i++) {
        if (moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)) {
          if (moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_from), 'day')) {
            return ['red-blocked', 'left-radius'];
          }
          else if (moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_to), 'day')) {
            return ['red-blocked', 'right-radius'];
          }
          else {
            return 'red-blocked';
          }
        }
      }
    },
  };
  /*====================================
  | Multi date range picker options end
  ====================================*/
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
      $rootScope.$emit("shortListedProducts", shortListedProductsLength)
    });
  }
  getShortListedProducts();
  $scope.getProductUnavailableDates = function (productId, ev) {
    MapService.getProductUnavailableDates(productId).then(function (dateRanges) {
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


  var getFormatList = function () {
    OwnerProductService.getFormatList().then(function (result) {
      $scope.formatList = result;
    });
  }
  getFormatList();

  var getCountryList = function () {
    OwnerLocationService.getCountries().then(function (result) {
      $scope.countryList = result;
    });
  }
  getCountryList();

  $scope.getApprovedProductList = function () {
    OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function (result) {
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      if ($window.innerWidth >= 420) {
        createPageLinks();
      }
      else {
        $scope.getRange(0, result.page_count);
      }
    });
  }

  $scope.filterOwnerProductsWithDates = function (dateFilter) {
    OwnerProductService.getApprovedProductListByDates(moment(dateFilter.start_date).toISOString(), moment(dateFilter.end_date).toISOString()).then(function (result) {
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      if ($window.innerWidth >= 420) {
        createPageLinks();
      }
      else {
        $scope.getRange(0, result.page_count);
      }
    });
  }

  var getRequestedProductList = function () {
    OwnerProductService.getRequestedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function (result) {
      $scope.requestedProductList = result.products;
      $scope.pagination.pageCount = result.page_count;
      if ($window.innerWidth >= 420) {
        createPageLinks();
      }
      else {
        $scope.getRange(0, result.page_count);
      }
    });
  }

  $scope.getStateList = function (product) {
    OwnerLocationService.getStates($scope.product.country).then(function (result) {
      $scope.stateList = result;
    });
  }
  $scope.getCityList = function () {
    OwnerLocationService.getCities($scope.product.state).then(function (result) {
      $scope.cityList = result;
    });
  }
  $scope.getAreaList = function () {
    OwnerLocationService.getAreas($scope.product.city).then(function (result) {
      $scope.areaList = result;
    });
  }

  $scope.searchableAreas = function (query) {
    return OwnerLocationService.searchAreas(query.toLowerCase()).then(function (res) {
      return res;
    });
  }
  $scope.productdetails = [{
    id: 1,
    price: '60000'
  }]

  $scope.requestedAddProduct = function (product) {
  }

  $scope.editUtterance = function (data) {
    data.edit = true;
  }
  $scope.save = function (data) {
    data.edit = false;
  }




  /*=====================
  | Product Section
  =====================*/
  $scope.product = {};

  $scope.ProductTypes = [
    { name: "Bulletin" },
    { name: "Digital Bulletin" },
    { name: "Transit" }
  ];
  $scope.bulletinresult = true;
  $scope.trasitResult = false;
  $scope.DigitalResult = false;
  $scope.product.type = $scope.ProductTypes[0];
  $scope.getdetails = function () {
    if ($scope.product.type.name == "Bulletin") {
      $scope.bulletinresult = true;
      $scope.trasitResult = false;
      $scope.DigitalResult = false;
    }
    else if ($scope.product.type.name == "Digital Bulletin") {
      $scope.DigitalResult = true;
      $scope.trasitResult = false;
      $scope.bulletinresult = false;
    } else if ($scope.product.type.name == "Transit") {
      $scope.trasitResult = true;
      $scope.bulletinresult = false;
      $scope.DigitalResult = false;
    } else {
      $scope.bulletinresult = false;
    }
  }

  $scope.files = {};
  $scope.requestAddProduct = function (product) {
    product.type = product.type.name;
    product.area = $scope.areaObj.id;
    Upload.upload({
      url: config.apiPath + '/save-product-details',
      data: {
        image: $scope.files.image,
        symbol: $scope.files.symbol,
        product: $scope.product
      }
    }).then(function (result) {
      if (result.data.status == "1") {
        // getRequestedProductList();
        $scope.product = null;
        // document.getElementById("myDropdown").classList.toggle("show");
        toastr.success(result.data.message);
        $state.reload();
      }
      else if (result.data.status == 0) {
        $scope.requestProductErrors = result.data.message;
        toastr.error(result.data.message);
      }
      $scope.hordinglistform.$setPristine();
      $scope.hordinglistform.$setUntouched();
    }, function (resp) {
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    });
  };

  var getOwnerProductDetails = function (productId) {
    OwnerProductService.getOwnerProductDetails(productId).then(function (result) {
      $scope.productDetails = result;
      $scope.runningCampaignDetails = _.filter(result.campaigns, function (c) {
        return c.status == 6;
      })[0];
      $scope.nonRunningCampaigns = _.filter(result.campaigns, function (c) {
        return c.status != 6;
      });
    });
  }

  $scope.viewProductImage = function (image) {
    var imagePath = config.serverUrl + image;
    $mdDialog.show({
      locals: { src: imagePath },
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

  function getShortlistedProductsByOwner() {
    OwnerProductService.getShortlistedProductsByOwner().then(function (result) {
      $scope.shortlistedProducts = result;
    });
  }

  $scope.shortlistProductByOwner = function (productId) {
    OwnerProductService.shortListProductByOwner(productId).then(function (result) {
      if (result.status == 1) {
        getShortlistedProductsByOwner();
        _.map($scope.productList, (p) => {
          if (p.id == productId) {
            p.shortlisted = true;
            return p;
          }
        });
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  $scope.deleteShortlistedByOwner = function (productId) {
    OwnerProductService.deletedShortListedByOwner(productId).then(function (result) {
      if (result.status == 1) {
        getShortlistedProductsByOwner();
        _.map($scope.productList, (p) => {
          if (p.id == productId) {
            p.shortlisted = false;
            return p;
          }
        });
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  $scope.shareShortlistedProductsByOwner = function (recipientObj) {
    OwnerProductService.shareShortlistedProductsByOwner(recipientObj).then(function (result) {
      if (result.status == 1) {
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  $scope.getProductUnavailableDatesEdit = function (Type) {
    if(Type == 'Bulletin'){
      var productId = $stateParams.id;
      OwnerProductService.getProductUnavailableDates(productId).then(function (dateRanges) {
        $scope.unavailalbeDateRanges = dateRanges;
        productDatesCalculator()
        // $(ev.target).parent().parent().find('input').trigger('click');
      });
    }else{
      var productId = $stateParams.id;
      OwnerProductService.getProductUnavailableDates(productId).then(function (dateRanges) {
        $scope.unavailalbeDateRanges = dateRanges;
        productDatesDigitalCalculator()
        // $(ev.target).parent().parent().find('input').trigger('click');
      });
    }
   
  }

  $scope.getProductUnavailableDates = function (productId, ev) {
    OwnerProductService.getProductUnavailableDates(productId).then(function (dateRanges) {
      $scope.unavailalbeDateRanges = dateRanges;
      $(ev.target).parent().parent().find('input').trigger('click');
    });
  }
  /*=====================
  | Product Section Ends
  =====================*/

  //updated edited product details

  $scope.updateeditProductdetails = function (editRequestedhordings) {
    //editRequestedhordings.area = $scope.areaObj.id;
    editRequestedhordings.id = $stateParams.id;
    editRequestedhordings.dates = $scope.product.dates;
    Upload.upload({
      url: config.apiPath + '/save-product-details',
      data: { image: $scope.files.image, editRequestedhordings: $scope.editRequestedhordings }
    }).then(function (result) {
      if (result.data.status == "1") {
        getRequestedProductList();
        toastr.success(result.data.message);
      }
      else if (result.data.status == 0) {
        $scope.requestProductErrors = result.data.message;
        toastr.error(result.data.message);
      }
    }, function (resp) {
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    });
  }

  /*=====================
 | Requested hordings
 =====================*/

  $scope.editRequestedhordings = function (id) {
    OwnerProductService.getProductDetails(id).then(function (res) {
      $scope.editRequestedhordings = res.product_details
      $scope.location = $scope.editRequestedhordings.area_name + ', ' + $scope.editRequestedhordings.city_name + ', ' + $scope.editRequestedhordings.country_name
      return res.product_details;
    })
  };

  /*=====================
| Requested hordings Ends
=====================*/

  // filter-code
  $scope.viewSelectedProduct = function (product) {
    $scope.pagination.pageCount = 1;
    $scope.productList = [product];
  }
  $scope.viewSearchText = function (text) {

    if (text == '') {
      $scope.getApprovedProductList();
    }
  }
  $scope.productSearch = function (query) {
    return OwnerProductService.searchOwnerProducts(query.toLowerCase()).then(function (res) {
      $scope.productList = res;
      $scope.pagination.pageCount = 1;
      return res;
    });
  }
  // Filter-code ends


  /*=====================
  | Campaign Section
  =====================*/
  $scope.ownerCampaign = {};
  $scope.ownerCampaign.from_shortlisted = 1;
  $scope.minStartDate = new Date();
  $scope.minEndDate = moment($scope.minStartDate).add(1, 'days').toDate();
  $scope.ownerCampaign.end_date = $scope.minEndDate;
  $scope.defaultStartDate = new Date();

  $scope.updateEndDateValidations = function () {
    $scope.minEndDate = moment($scope.ownerCampaign.start_date).add(1, 'days').toDate();
    if ($scope.ownerCampaign.end_date <= $scope.ownerCampaign.start_date) {
      $scope.ownerCampaign.end_date = $scope.minEndDate;
    }
  }

  $scope.saveOwnerCampaign = function () {
    OwnerCampaignService.saveOwnerCampaign($scope.ownerCampaign).then(function (result) {
      if (result.status == 1) {
        $scope.ownerCampaign = {};
        $scope.forms.ownerCampaignForm.$setPristine();
        $scope.forms.ownerCampaignForm.$setUntouched();
        toastr.success(result.message);
        setTimeout(function () {
          window.location.reload();
        }, 500);
      }
      else if (result.status == 0) {
        if (result.message.constructor == Array) {
          $scope.ownerCampaignErrors = result.message;
        }
        else {
          toastr.error(result.message);
        }
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  /*=====================
  | Campaign Section
  =====================*/


  /*=========================
  | Page based initial loads
  =========================*/

  if ($rootScope.currStateName == "owner.product-details") {
    if (typeof $stateParams.productId !== 'undefined') {
      getOwnerProductDetails($stateParams.productId);
    }
    else {
      toastr.error("Product not found.");
    }
  }

  if ($rootScope.currStateName == 'owner.hoarding-list') {
    $scope.getApprovedProductList();
    getShortlistedProductsByOwner();
    $scope.getdetails();
  }

  if ($rootScope.currStateName == 'owner.requested-hoardings') {
    getRequestedProductList();
    // $scope.getApprovedProductList()
  }

  if ($rootScope.currStateName == 'owner.editproduct-details') {
    $scope.editRequestedhordings($stateParams.id)
  }

  $scope.changeProductPrice = function (data) {
    product = {};
    product.id = data.id;
    product.default_price = data.default_price;
    OwnerProductService.changeProductPrice(product).then(function (result) {
      if (result.status == 1) {
        toastr.success(result.message);
      }
      else {
        toastr.error(result.data.message);
      }
    });

  }

  $scope.product_visibility = function (product_visibility, product_id) {
    visibility = {};
    visibility.product_visibility = product_visibility;
    OwnerProductService.changeProductVisibility(product_id, visibility).then(function (result) {
      if (result.status == 1) {
        toastr.success(result.message);
      }
      else {
        toastr.error(result.data.message);
      }
    });

  }


  /*=============================
  | Page based initial loads end
  =============================*/


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
    var unavailBoundaries = [];
    $scope.unavailalbeDateRanges.forEach((dates) => {
      unavailBoundaries.push(moment(dates.booked_from))
      unavailBoundaries.push(moment(dates.booked_to))
    });
    // var slotPrices =0;
    for (item in $scope.weeksDigitalArray) {
      $scope.weeksDigitalArray[item].price = $scope.product.price;
    }
    var digitalCurrentDay = moment().format('LLLL').split(',')[0];
    if (digitalCurrentDay == 'Monday') {
      var startDay = moment(new Date()).add(7, 'days').format('LLLL');
      var endDay = moment(new Date()).add(7 + 6, 'days').format('LLLL');
      $scope.weeksDigitalArray[0].startDay = startDay;
      $scope.weeksDigitalArray[0].endDay = endDay;
      unavailBoundaries.forEach((date) => {
        $scope.weeksDigitalArray[0].isBlocked = date.isSameOrAfter(startDay) && date.isSameOrBefore(endDay);
      });
    } else {
      var tempDay;
      for (i = 1; i <= 6; i++) {
        tempDay = moment(new Date()).add(i, 'days').format('LLLL').split(',')[0];
        if (tempDay == 'Monday') {
          var startDay = moment(new Date()).add(i, 'days').format('LLLL');
          var endDay = moment(new Date()).add(i + 6, 'days').format('LLLL');
          $scope.weeksDigitalArray[0].startDay = startDay;
          $scope.weeksDigitalArray[0].endDay = endDay;
          var isBlocked = false;
          for (var date of unavailBoundaries) {
            if (date.isSameOrAfter(startDay) && date.isSameOrBefore(endDay)) {
              isBlocked = true;
              break;
            }
          }
          $scope.weeksDigitalArray[0].isBlocked = isBlocked;
        }

      }

    }
    var tempororyStartDate = $scope.weeksDigitalArray[0].endDay;
    $scope.weeksDigitalArray.forEach(function (item, index) {
      if (index > 0) {
        item.startDay = moment(tempororyStartDate).add(1, 'days').format('LLLL');
        item.endDay = moment(tempororyStartDate).add(7, 'days').format('LLLL');
        tempororyStartDate = item.endDay;
        var isBlocked = false;
        for (var date of unavailBoundaries) {
          if (date.isSameOrAfter(item.startDay) && date.isSameOrBefore(item.endDay)) {
            isBlocked = true;
            break;
          }
        }
        $scope.weeksDigitalArray[index].isBlocked = isBlocked;
      }

    })    
  }

  // };
  productDatesDigitalCalculator()
  $scope.totalDigitalSlotAmount = 0;
  $scope.selectUserDigitalWeeks = function (weeks, index, ev) {
    if ($scope.numOfSlots == 0) {
      alert("please select no. of slots")
      return false;
    }
    if ($scope.numOfSlots > weeks.availableSlots) {
      alert("As you are exceeding the slots. you can't book it");
      return false;
    }
    if ($scope.weeksDigitalArray[index].selected == true) {
      $scope.weeksDigitalArray[index].selected = false;
      $scope.totalDigitalSlotAmount -= parseInt(parseInt($scope.numOfSlots) * parseInt($scope.weeksDigitalArray[index].price));

    } else {
      $scope.totalDigitalSlotAmount += parseInt(parseInt($scope.numOfSlots) * parseInt($scope.weeksDigitalArray[index].price));
      $scope.weeksDigitalArray[index].selected = true;

    }
  };
  $scope.digitalSelectUserWeeks = function (weeks, index, ev) {

    if ($scope.weeksDigitalArray[index].selected && $scope.weeksDigitalArray[index].selected == true) {
      $scope.weeksDigitalArray[index].selected = false;

    } else {
      $scope.weeksDigitalArray[index].selected = true;
    }
  }
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


  /*=============================
  | owner slots blocking starts
  =============================*/

  $scope.weeksArray = [];
  for (var i = 1; i <= 26; i++) {
    $scope.weeksArray.push({ twoWeeks: 2 })
  }
  var currentDay = moment().format('LLLL').split(',')[0];
  function productDatesCalculator() {
    var unavailBoundaries = [];
    $scope.unavailalbeDateRanges.forEach((dates) => {
      unavailBoundaries.push(moment(dates.booked_from))
      unavailBoundaries.push(moment(dates.booked_to))
    });
    if (currentDay == 'Monday') {
      var startDay = moment().add(7, 'days').format('LLLL');
      var endDay = moment().add(7 + 13, 'days').format('LLLL');
      $scope.weeksArray[0].startDay = startDay;
      $scope.weeksArray[0].endDay = endDay;
      unavailBoundaries.forEach((date) => {
        $scope.weeksArray[0].isBlocked = date.isSameOrAfter(startDay) && date.isSameOrBefore(endDay);
      });
    } else {
      var tempDay;
      for (i = 1; i <= 6; i++) {
        tempDay = moment(new Date()).add(i, 'days').format('LLLL').split(',')[0];
        if (tempDay == 'Monday') {
          var startDay = moment(new Date()).add(i + 7, 'days').format('LLLL');
          var endDay = moment(new Date()).add(i + 7 + 13, 'days').format('LLLL');
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
    $scope.weeksArray.forEach(function (item, index) {
      if (index > 0) {
        item.startDay = moment(tempororyStartDate).add(1, 'days').format('LLLL');
        item.endDay = moment(tempororyStartDate).add(14, 'days').format('LLLL');
        tempororyStartDate = item.endDay;
        var isBlocked = false;
        for (var date of unavailBoundaries) {
          if (date.isSameOrAfter(item.startDay) && date.isSameOrBefore(item.endDay)) {
            isBlocked = true;
            break;
          }
        }
        $scope.weeksArray[index].isBlocked = isBlocked;
      }
    })
  }
  productDatesCalculator()
  $scope.slotsClosed = false;
  $scope.selectUserWeeks = function (weeks, index, ev) {

    if ($scope.weeksArray[index].selected && $scope.weeksArray[index].selected == true) {
      $scope.weeksArray[index].selected = false;

    } else {
      $scope.weeksArray[index].selected = true;
    }
  }
  $scope.slotedDatesPopupClosed = function (Type) {
    if(Type == 'Bulletin'){
      $scope.slotsClosed = false;
    }else{
      $scope.digitalSlotsClosed = false;
      }
    }
  $scope.blockedSlotesbtn = function (weeksArray,Type) {
    $scope.product.dates = []  
    weeksArray.filter((week) => week.selected).forEach(function (item) {
      var startDate = moment(item.startDay).format('YYYY-MM-DD')
      var endDate = moment(item.endDay).format('YYYY-MM-DD')

      $scope.product.dates.push({ startDate: startDate, endDate: endDate })
      $scope.slotedDatesPopupClosed(Type);
    })
  }
  /*=============================
 | owner slots blocking ends
 =============================*/

});