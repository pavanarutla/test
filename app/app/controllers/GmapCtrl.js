app.controller('GmapCtrl',
  ['$scope', 'NgMap', '$mdSidenav', '$mdDialog', '$timeout', '$rootScope', 'MapService', 'LocationService', 'ProductService', 'CampaignService', 'config', 'toastr',
    function ($scope, NgMap, $mdSidenav, $mdDialog, $timeout, $rootScope, MapService, LocationService, ProductService, CampaignService, config, toastr) {
      $scope.address = {
        // name: 'Hyderabad, Telangana, India',
        name: 'People tech group hyderabad',
        place: '',
        components: {
          placeId: '',
          streetNumber: '',
          street: '',
          city: '',
          state: '',
          countryCode: '',
          country: '',
          postCode: '',
          district: '',
          location: {
            lat: 17.3850,
            lng: 78.4867
          }
        }
      };

      $scope.today = new Date();

      $scope.mapObj;
      var markersOnMap = [];
      $scope.selectedProduct = null;
      $scope.selectedForNewCampaign = [];
      $scope.newCampaign = {};
      $scope.serverUrl = config.serverUrl;
      var trafficOn = false;
      $scope.siteNoSearch = "";
      $scope.showTrafficLegend = false;

      $scope.$watch(
        function() { return $mdSidenav('productDetails').isOpen(); },
        function(newValue, oldValue) {
          if(newValue == false){
            $scope.selectedProduct = null;
            selectorMarker.setMap(null);
            $scope.$parent.existingCampaignSidenavVisible = false;
          }
        }
      );

      var trafficLayer = new google.maps.TrafficLayer();
      var selectorMarker = new google.maps.Marker({
        icon: {
          url: 'assets/images/maps/Ellipse 75.png',
          scaledSize: new google.maps.Size(30, 30),
          // origin: new google.maps.Point(0, 0), // origin
          // anchor: new google.maps.Point(20, 30) // anchor
        }
      });

      $scope.product = {};
      MapService.markers().then(function (markers) {
        $scope.filteredMarkers = markers;
        NgMap.getMap().then(function (map) {
          $scope.mapObj = map;
          $scope.processMarkers();
        });
      });
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
      $scope.countries = [];
      $scope.states = [];
      $scope.cities = [];
      $scope.areas = [];
      LocationService.getCountries().then(function (countries) {
        $scope.countries = countries;
      });
      $scope.Sectors = [];
      // MapService.getIndustrySectors().then(function(Sectors){
      //   $scope.Sectors = Sectors;
      // });
      $scope.DurationSectors = [];
      // MapService.getDurationSectors().then(function(DurationSectors){
      //   $scope.DurationSectors = DurationSectors;
      // });

      // range circle
      $scope.radius = 0;
      circle = new google.maps.Circle({
        strokeColor: '#FF0099',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#009ee0',
        fillOpacity: 0.2
      });
      $scope.updateCircleRadius = function (val) {
        circle.setCenter($scope.address.components.location);
        circle.setRadius(Number(val));
        circle.setMap($scope.mapObj);
      }
      circleBounds = circle.getBounds();

      // range end

      // clender
      $scope.opened = {
        start: false,
        end: false
      };

      $scope.today = new Date();
      $scope.filter = false;
      $scope.format = false;
      $scope.shortlist = false;
      $scope.savedcampaign = false;

      $scope.Recommended = false;
      $scope.Popular = false;
      $scope.footerhide = true;

      $scope.locationpageonly = true;

      $scope.dashboardData = false;

      $scope.filters = function () {
        $scope.filter = !$scope.filter;
        $scope.format = false;
        $scope.shortlist = false;
        $scope.savedcampaign = false;
      }
      $scope.formats = function () {
        $scope.filter = false;
        $scope.format = !$scope.format;
        $scope.shortlist = false;
        $scope.savedcampaign = false;
      }

      $scope.shortlistDiv = function () {
        $scope.filter = false;
        $scope.format = false;
        $scope.shortlist = !$scope.shortlist;
        $scope.savedcampaign = false;
      }

      $scope.savedcampaignDiv = function () {
        $scope.filter = false;
        $scope.format = false;
        $scope.shortlist = false;
        $scope.savedcampaign = !$scope.savedcampaign;
      }


      $scope.RecommendedDiv = function () {
        $scope.Recommended = !$scope.Recommended;
        $scope.Popular = false;
      }

      $scope.PopularDiv = function () {
        $scope.Recommended = false;
        $scope.Popular = !$scope.Popular;
      }


      //slider
      function sliderController($scope) {
        $scope.color = {
          red: Math.floor(Math.random() * 255),
          green: Math.floor(Math.random() * 255),
          blue: Math.floor(Math.random() * 255)
        };
        $scope.rating = 0;
        $scope.disabled = 100;
      };
      // $rootScope.address = 'Hyderabad'; 

      // $scope.selectedCountry = { Id: '1', Countryname: 'India' };
      $scope.selectedCountry = {};
      $scope.selectedStates = {};
      $scope.selectedcitys = {};
      $scope.selectedareas = {};

      $scope.searchTerm;
      $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
      };
      $scope.setCountry = function () {
        LocationService.getStates($scope.selectedCountry).then(function (states) {
          $scope.states = states;
        });
      }
      $scope.setStates = function () {
        LocationService.getCities($scope.selectedStates).then(function (cities) {
          $scope.cities = cities;
        });
      }
      $scope.setCities = function () {
        LocationService.getAreas($scope.selectedcitys).then(function (areas) {
          $scope.areas = areas;
        });
      }

      //Confirm Dialog 1
      $scope.showConfirmation = function (ev) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('Your Campaign is successfully Saved!!!!')
            .textContent('You can specify some description text in here.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
      };
      $scope.industrySectorList = [
        { name: "Aerospace" },
        { name: "Agriculture" },
        { name: "Automotive" },
        { name: "Banking, Financial services and Insurance" },
        { name: "Construction, Engineering, Architectural" },
        { name: "Classifieds" },
        { name: "Consumer Durables" },
        { name: "Energy - Oil & Gas" },
        { name: "Energy - Other" },
        { name: "Energy – Utilities" },
        { name: "Entertainment" },
        { name: "Ecommerce" },
        { name: "Environment" },
        { name: "Education" },
        { name: "Forestry" },
        { name: "Fast-moving consumer goods" },
        { name: "Fashion & lifestyle" },
        { name: "GIS/Mapping/Cadastral" },
        { name: "Global Development" },
        { name: "Government – Civil" },
        { name: "Government - Defense &Intelligence" },
        { name: "Healthcare" },
        { name: "Hotels & Restaurant" },
        { name: "Insurance" },
        { name: "Logistics" },
        { name: "Marine / Fishing" },
        { name: "Media / Communications" },
        { name: "Office Supplies" },
        { name: "Public Services" },
        { name: "Retail" },
        { name: "Real Estate & Infrastructure" },
        { name: "Telecom" },
        { name: "Travel & Transport" },
        { name: "Others" }
      ];
      $scope.CampaignDuration = [
        { model: "10 Days" },
        { model: "15 Days" },
        { model: "20 Days" },
        { model: "25 Days" },
        { model: "30 Days" },
        { model: "2 Months" },
        { model: "3 Months" },
        { model: "6 Months" },
        { model: "1 year" }
      ];
      //export all 

      $scope.ExportToExcel = function () {

        var blob = new Blob([document.getElementById('divExport').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "ReportRIS.xls");
    };
      //Suggest Me Dialog 1      
      $scope.suggestionRequest = {};
      $scope.suggestMeRequestSent = false;
      // date picker validation
      // $scope.checkErr = function (startDate, endDate) {
      //   $scope.errMessage = '';
      //   var curDate = new Date();

      //   if (new Date(startDate) > new Date(endDate)) {
      //     $scope.errMessage = 'End Date should be greater than start date';
      //     return false;
      //   }
      //   if (new Date(startDate) < curDate) {
      //     $scope.errMessage = 'Start date should not be before today.';
      //     return false;
      //   }
      // };
      $scope.newDate = new Date();
     // console.log($scope.start_date,"$scope.start_date")
    // $scope.start_date = new Date();
      $scope.endDate = $scope.start_date + 1;

  //    if(start_date > end_date){
  //     $scope.errMessage = 'end date should not be before start day.';
  //     return false;
  //  }

      $scope.sendSuggestionRequest = function (ev) {
        $scope.suggestionRequest.user_mongo_id = $rootScope.loggedInUser.id;
        console.log($scope.suggestionRequest);
        CampaignService.sendSuggestionRequest($scope.suggestionRequest).then(function (result) {
          if (result.status == 1) {
            $scope.suggestMeRequestSent = true;
          }
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('We will get back to you!!!!')
              .textContent(result.message)
              .ariaLabel('Alert Dialog Demo')
              .ok('Got it!')
              .targetEvent(ev)
          );
        });
      };

      function selectMarker(marker) {
        $scope.selectedProduct = marker;
        selectorMarker.setPosition(marker.position);
        selectorMarker.setMap($scope.mapObj);
        $scope.mapObj.setCenter(marker.position);
        $scope.product.image = config.serverUrl + marker.properties['image'];
        $scope.product.siteNo = marker.properties['siteNo'];
        $scope.product.panelSize = marker.properties['panelSize'];
        $scope.product.address = marker.properties['address'];
        $scope.product.impressions = marker.properties['impressions'];
        $scope.product.lighting = marker.properties['lighting'];
        $scope.product.direction = marker.properties['direction'];
        $scope.product.availableDates = marker.properties['availableDates'];
        $scope.hideSelectedMarkerDetail = false;
        $mdSidenav('productDetails').toggle();
      }

      function selectSpideredMarker(marker) {
        $scope.selectedProduct = marker;
        selectorMarker.setMap(null);
        $scope.mapObj.setCenter(marker.position);
        $scope.product.image = config.serverUrl + marker.properties['image'];
        $scope.product.siteNo = marker.properties['siteNo'];
        $scope.product.panelSize = marker.properties['panelSize'];
        $scope.product.address = marker.properties['address'];
        $scope.product.impressions = marker.properties['impressions'];
        $scope.product.direction = marker.properties['direction'];
        $scope.product.lighting = marker.properties['lighting'];
        $scope.product.availableDates = marker.properties['availableDates'];
        $scope.hideSelectedMarkerDetail = false;
        $mdSidenav('productDetails').toggle();
      }

      google.maps.event.addListener(selectorMarker, 'click', function (e) {
        $scope.selectedProduct = null;
        selectorMarker.setMap(null);
      });


      var productList = [];
      var locArr = [];
      var uniqueMarkers = [];
      var concentricMarkers = {};
      $scope.processMarkers = function () {
        _.each($scope.filteredMarkers, function (v, i) {
          var product = {position: {lat: v.lat, lng: v.lng}, data: v};
          productList.push(product);
          if (locArr[JSON.stringify(product.position)]) {
            locArr[JSON.stringify(product.position)]++;
          } else {
            locArr[JSON.stringify(product.position)] = 1;
          }
        });
        _.each(productList, function(v, i){
          if(locArr[JSON.stringify(v.position)] > 1){
            if(concentricMarkers[JSON.stringify(v.position)]){
              concentricMarkers[JSON.stringify(v.position)].count++;
              concentricMarkers[JSON.stringify(v.position)].markers.push(v.data);
            }
            else {
              concentricMarkers[JSON.stringify(v.position)] = {};
              concentricMarkers[JSON.stringify(v.position)].markers = [];
              concentricMarkers[JSON.stringify(v.position)].count = 1;
              concentricMarkers[JSON.stringify(v.position)].markers.push(v.data);
            }
          }
          else{
            uniqueMarkers.push(v.data);
          }
        });
        // console.log(uniqueMarkers);
        // console.log(concentricMarkers);

        /* 
        //// handling clustering ////
        */
        var uniqueMarkerArr = [];
        _.each(uniqueMarkers, function (markerData, index) {
          var latLng = new google.maps.LatLng(markerData.lat, markerData.lng);
          var marker = new google.maps.Marker({
            position: latLng,
            icon: {
              url: config.serverUrl + markerData.symbol,
              scaledSize: new google.maps.Size(30, 30)
            }
          });
          marker.properties = markerData;
          uniqueMarkerArr.push(marker);
          markersOnMap.push(marker);
          google.maps.event.addListener(marker, 'click', function (e) {
            selectMarker(marker);
          });
        });
        var mc = {
          gridSize: 50,
          maxZoom: 13,
          imagePath: 'assets/images/maps/m'
        };
        $scope.Clusterer = new MarkerClusterer($scope.mapObj, uniqueMarkerArr, mc);

        /*
        //// handling spiderifying ////
        */
        var iw = new google.maps.InfoWindow();
        var circleMarker = new google.maps.Marker({
          icon: {
            url: 'assets/images/maps/Ellipse 55.png',
            scaledSize: new google.maps.Size(55, 55),
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(27.8, 29.5) // anchor
          },
        });
        var oms = new OverlappingMarkerSpiderfier($scope.mapObj, {
          markersWontMove: true,
          markersWontHide: true,
          basicFormatEvents: true,
          circleSpiralSwitchover: Infinity,
          legWeight: 0,
          circleFootSeparation: 32,
          nearbyDistance: 1,
          keepSpiderfied: true
        });

        _.each(concentricMarkers, function (markerData, index) {
          for (var i = 0; i < markerData.count; i++) {
            (function () {  // make a closure over the marker and marker data
              var label = {};
              label.text = " ";
              label.color = "rgba(255, 255, 255, 1)";
              if (i == 0) {
                label.text = markerData.count.toString();
              }
              var icon = {
                url: 'assets/images/maps/unspidered-cluster.png',
                scaledSize: new google.maps.Size(20, 20),
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(10, 10) // anchor
              };
              var marker = new google.maps.Marker({
                position: { lat: parseFloat(markerData.markers[i].lat), lng: parseFloat(markerData.markers[i].lng) },
                icon: icon,
                label: label
              });
              marker.properties = markerData.markers[i];
              marker.groupSize = markerData.count;
              google.maps.event.addListener(marker, 'spider_click', function (e) {
                selectSpideredMarker(marker);
              });
              markersOnMap.push(marker);
              oms.addMarker(marker);  // adds the marker to the spiderfier _and_ the map
              $scope.Clusterer.addMarker(marker);
            })();
          }
        });

        // instantiate oms when click occurs on marker-group
        oms.addListener('format', function (marker, status) {
          var markerIcon;
          var label = marker.getLabel();
          var scaledCoord = 32 + (10 * (marker.groupSize - 1));
          var circleMarkerIcon = {
            url: 'assets/images/maps/Ellipse 55.png',
            scaledSize: new google.maps.Size(scaledCoord, scaledCoord),
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(scaledCoord / 2, scaledCoord / 2),
          };
          if (status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED) {
            // when markers are scattered
            label.color = "rgba(255, 255, 255, 0)";
            marker.setLabel(label);
            circleMarker.setPosition(marker.getPosition());
            circleMarker.setIcon(circleMarkerIcon);
            circleMarker.setMap($scope.mapObj);
            markerIcon = {
              url: config.serverUrl + marker.properties['symbol'],//'assets/images/maps/spidered-marker.png',
              scaledSize: new google.maps.Size(30, 30),
              origin: new google.maps.Point(0, 0), // origin
              anchor: new google.maps.Point(15, 15) // anchor
            };
          }
          else {
            // when markers are grouped as one
            markerIcon = {
              url: 'assets/images/maps/unspidered-cluster.png',
              scaledSize: new google.maps.Size(20, 20),
              origin: new google.maps.Point(0, 0), // origin
              anchor: new google.maps.Point(10, 10) // anchor
            };
            label.color = "rgba(255, 255, 255, 1)";
            marker.setLabel(label);
            // spiderCircle.setMap(null);
            circleMarker.setMap(null);
            iw.close();
          }
          marker.setIcon(markerIcon);
        });
      }

      $scope.$parent.$watch('trafficOn', function(oldValue, newValue){        
        var mapVal = null;
        if (!newValue) {
          mapVal = $scope.mapObj;
        }
        trafficLayer.setMap(mapVal);
      });
 
      $scope.applyFilter = function(){
        productList = [];
        locArr = [];
        uniqueMarkers = [];
        concentricMarkers = {};
        var filterObj = {area: $scope.selectedAreas, product_type: $scope.selectedFormats};
        MapService.filterProducts(filterObj).then(function (markers) {
          _.each(markersOnMap, function(v, i){
            v.setMap(null);
            $scope.Clusterer.removeMarker(v);
          });
          markersOnMap = [];
          $scope.filteredMarkers = markers;
          $scope.processMarkers();
          if(markers.length > 0){
            var bounds = new google.maps.LatLngBounds();
            _.each(markersOnMap, function (v, i) {
              bounds.extend(v.getPosition());
            });
            $scope.mapObj.fitBounds(bounds);
          }
          else{
            toastr.error("no marker found for the criteria you selected");
          }
        });
      }

      $scope.setNewAddress = function () {
        // console.log($scope.address.components.location);
      }

      $scope.shortlistSelected = function (ev) {
        MapService.shortListProduct($scope.selectedProduct.properties.id, JSON.parse(localStorage.loggedInUser).id).then(function (response) {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('ShortList Product')
              .textContent(response.message)
              .ariaLabel('shortlist-success')
              .ok('Got it!')
              .targetEvent(ev)
          );
          getShortListedProducts();
        });
      }

      function getShortListedProducts() {
        MapService.getshortListProduct(JSON.parse(localStorage.loggedInUser).id).then(function (response) {
          $scope.shortListedProducts = response;
        });
      }
      getShortListedProducts();

      $scope.deleteShortlisted = function (ev, productId) {
        // console.log(productId);
        MapService.deleteShortlistedProduct(JSON.parse(localStorage.loggedInUser).id, productId).then(function (response) {
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
      };

      $scope.resetFilters = function () {
        productList = [];
        locArr = [];
        uniqueMarkers = [];
        concentricMarkers = {};
        $scope.selectedAreas = null;
        $scope.selectedcitys = null;
        $scope.selectedStates = null;
        _.each(markersOnMap, function (v, i) {
          v.setMap(null);
          $scope.Clusterer.removeMarker(v);
          delete v;
        });
        markersOnMap = [];
        MapService.markers().then(function (markers) {
          console.log(markers);
          $scope.filteredMarkers = markers;
          $scope.processMarkers();
          var bounds = new google.maps.LatLngBounds();
          _.each(markersOnMap, function (v, i) {
            bounds.extend(v.getPosition());
          });
          $scope.mapObj.fitBounds(bounds);
        });
      }

      $scope.campaign = {};
      $scope.saveCampaign = function () {
        // If we finally decide to use selecting products for a campaign
        // if($scope.selectedForNewCampaign.length == 0){
        //   // add all shortlisted products to campaign
        //   console.log($scope.shortListedProducts);
        //   // CampaignService.saveCampaign($scope.shortListedProducts).then(function(response){
        //   //   $scope.campaignSavedSuccessfully = true;
        //   // });
        // }
        // else{
        //   // add all shortlisted products for new campaign
        //   console.log($scope.selectedForNewCampaign);
        //   // CampaignService.saveCampaign($scope.selectedForNewCampaign).then(function(response){
        //   //   $scope.campaignSavedSuccessfully = true;
        //   // });
        // }
        // campaign.products = $scope.selectedForNewCampaign;
        $scope.campaign.products = [];
        $scope.campaign.user_mongo_id = $rootScope.loggedInUser.id;
        _.each($scope.shortListedProducts, function (v, i) {
          $scope.campaign.products.push(v.id);
        });
        CampaignService.saveCampaign($scope.campaign).then(function(response){
          $scope.campaignSavedSuccessfully = true;
          $scope.loadUserCampaigns();
          getShortListedProducts();
        });
      }

      $scope.searchBySiteNo = function () {
        MapService.searchBySiteNo($scope.siteNoSearch).then(function (markerProperties) {
          console.log(markerProperties);
          if (markerProperties.id) {
            var marker = {};
            marker.properties = markerProperties;
            selectMarker(marker);
            var bounds = new google.maps.LatLngBounds();
            bounds.extend({ lat: parseFloat(markerProperties.lat), lng: parseFloat(markerProperties.lng) });
            $scope.mapObj.fitBounds(bounds);
          }
          else {
            toastr.error('No product found with that tab id', 'error');
          }
        });
      }

      $scope.userCampaigns = [];
      $scope.loadPlannedUserCampaigns = function () {
        CampaignService.getPlannedCampaigns().then(function (result) {
          console.log(result);
          $scope.plannedUserCampaigns = result;
        });
      }
      $scope.loadPlannedUserCampaigns();

      $scope.deletePlannedCampaign = function (campaignId) {
        CampaignService.deleteCampaign(campaignId).then(function (result) {
          if (result.status == 1) {
            $scope.loadUserCampaigns();
            toastr.success(result.message);
          }
          else {
            toastr.error(result.message);
          }
        });
      }

      $scope.toggleFormatSelection = function (formatId) {
        if (_.contains($scope.selectedFormats, formatId)) {
          $scope.selectedFormats = _.reject($scope.selectedFormats, function (v) { return v == formatId });
          // console.log(_.reject($scope.selectedFormats, function(v){return v == formatId}));
        }
        else {
          $scope.selectedFormats.push(formatId);
        }
        $scope.applyFilter();
      }

      $scope.isFormatSelected = function (formatId) {
        return _.contains($scope.selectedFormats, formatId);
      }

      $scope.toggleTrafficLegends = function(){
        $scope.showTrafficLegend = !$scope.showTrafficLegend;
      }

      // Drawing a circle
      // var rangeCircle = new google.maps.Marker({
      //   icon: {
      //     path: google.maps.SymbolPath.CIRCLE,
      //     fillOpacity: 0.3,
      //     fillColor: "#ffffff",
      //     strokeOpacity: 1.0,
      //     strokeColor: "red",
      //     strokeWeight: 1.0,
      //     size: 26000,
      //     scale: 1.0
      //   },
      //   position: $scope.address.location
      // });

      rangeCircle = new google.maps.Circle({
        strokeColor: "#0000ff",
        strokeOpacity: 1.0,
        strokeWeight: 0.5,
        fillColor: "#0000ff",
        fillOpacity: 0.2,
      });

      $scope.updateCircle = function(){        
        rangeCircle.setMap(null);
        rangeCircle.setRadius($scope.circleRadius*1000);
        rangeCircle.setCenter($scope.mapObj.getCenter());
        // rangeCircle.setPosition($scope.mapObj.getCenter());
        rangeCircle.setMap($scope.mapObj);
      }
      // Drawing a circle ends

      $scope.viewCampaignDetails = function(campaignId){
        CampaignService.getCampaignWithProducts(campaignId).then(function(campaignDetails){
          $scope.campaignDetails = campaignDetails;
          $scope.toggleCampaignDetailSidenav();
        });
      }

      $scope.addProductToExistingCampaign = function(existingCampaign){
        var productToCampaign = {
          product_id: $scope.selectedProduct.properties.id,
          campaign_id: existingCampaign.id
        };
        CampaignService.addProductToExistingCampaign(productToCampaign).then(function(result){
          if(result.status == 1){
            toastr.success(result.message);
          }
          else{
            toastr.error(result.message);
          }
        });

      }

      $scope.shareShortlistedProducts = function (shareShortlisted) {
        var sendObj = {
          email: shareShortlisted.email,
          receiver_name: shareShortlisted.name
        };
        CampaignService.shareShortListedProducts(sendObj).then(function (result) {
          if(result.status == 1){
            toastr.success(result.message);
          }
          else{
            toastr.error(result.message);
          }
        });
      };

      $scope.shareCampaign = function(ev, shareCampaign){
        var campaignToEmail = {
          campaign_id: $scope.campaignToShare.id,
          email: shareCampaign.email,
          receiver_name: shareCampaign.receiver_name
        };
        CampaignService.shareCampaignToEmail(campaignToEmail).then(function(result){
          if(result.status == 1){
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
          }
          else{
            toastr.error(result.message);
          }
        });
      }

    }
  ]
);
