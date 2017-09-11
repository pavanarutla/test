app.controller('GmapCtrl',
  ['$scope', 'NgMap', '$mdSidenav', '$mdDialog', '$timeout', '$rootScope', 'MapService', 'LocationService', 'config',
    function ($scope, NgMap, $mdSidenav, $mdDialog, $timeout, $rootScope, MapService, LocationService, config) {
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
      $scope.mapObj;
      var markersOnMap = [];
      $scope.selectedProduct = null;
      var trafficOn = false;
      var trafficLayer = new google.maps.TrafficLayer();
      var selectorMarker = new google.maps.Marker({
        icon: {
          url: 'assets/images/maps/Ellipse 75.png',
          scaledSize: new google.maps.Size(40, 40),
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
      $scope.countries=[];
      $scope.states = [];
      $scope.cities=[];      
      $scope.areas = [];
      LocationService.getCountries().then(function (countries) {
        $scope.countries = countries;
        // console.log(countries);
      });
      $scope.Sectors=[];
      // MapService.getIndustrySectors().then(function(Sectors){
      //   $scope.Sectors = Sectors;
      // });
      $scope.DurationSectors=[];
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
      $scope.locationpageonly = true;
      
      $scope.filters = function(){
        $scope.filter = !$scope.filter;
        $scope.format = false;
        $scope.shortlist = false;
        $scope.savedcampaign = false;
      }
      $scope.formats = function(){
        $scope.filter= false;
        $scope.format= !$scope.format;
        $scope.shortlist = false;
        $scope.savedcampaign = false;  
      }

      $scope.shortlistDiv = function(){
        $scope.filter = false;
        $scope.format = false;
        $scope.shortlist = !$scope.shortlist;
        $scope.savedcampaign = false; 
      }

      $scope.savedcampaignDiv = function(){
        $scope.filter = false;
        $scope.format = false;
        $scope.shortlist = false;
        $scope.savedcampaign = !$scope.savedcampaign;
      }


      $scope.RecommendedDiv = function(){
        $scope.Recommended = !$scope.Recommended;
        $scope.Popular = false;
      }

      $scope.PopularDiv = function(){
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

      $scope.selectedCountry = { Id: '1', Countryname: 'India' };
      $scope.selectedStates={};
      $scope.selectedcitys={};
      $scope.selectedareas={};
      
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
      
      // shortlist
      $scope.closeSideViewAll = function() {
        $mdSidenav('viewAll').toggle();
      };

      //saved campaign
      $scope.closeSideSavedCampaign = function() {
          $mdSidenav('savedCampaign').toggle();
      };

      // saved view all side nav
      $scope.closeSideViewAll = function() {
          $mdSidenav('savedViewAll').toggle();
      };

      // edit list saved campgin
      $scope.closeSideEditList = function() {
          $mdSidenav('savedEdit').toggle();
      };

      // saved campgin
      $scope.closeSideSavedCampaign = function() {
          $mdSidenav('savedSavedCampaign').toggle();
      };

      // Save Campgin Details
      $scope.saveCampaignDetails = function() {
        $mdSidenav('saveCampaignDetails').toggle();
      };

      // Thanks Message
      $scope.closeSideThanksSidenav = function() {
        $mdSidenav('thanksCampaign').toggle();
      };
      // Product Details
      $scope.closeProductDetailSidenav = function() {
        $mdSidenav('productDetails').toggle();
      };
      // Share Message
      $scope.shareSidenav = function() {
        $mdSidenav('shareCampaign').toggle();
      };
      // Suggest Me dialog 
      $scope.suggestMe = function() {
        $mdSidenav('suggestMe').toggle();
      };
      // Save Campgin Name
      $scope.saveCampaignName = function() {
        $mdSidenav('saveCampaignName').toggle();
      };
      // View All Campaign List
      $scope.viewAllCampaginList = function() {
        $mdSidenav('viewAll').toggle();
      };
      // Create Campaign  
      $scope.createCampaign = function() {
        $mdSidenav('createCampaign').toggle();
      };

      //Confirm Dialog
      $scope.showAlert = function(ev) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title('Your Campaign is successfully shared!!!!')
          .textContent('You can specify some description text in here.')
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
        );
      };
      //Confirm Dialog 1
      $scope.showConfirmation = function(ev) {
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
      $scope.IndustrySector = [
        { model: "Aerospace" },
        { model: "Agriculture" },
        { model: "Automotive" },
        { model: "Banking, Financial services and Insurance" },
        { model: "Construction, Engineering, Architectural" },
        { model: "Classifieds" },
        { model: "Consumer Durables" },
        { model: "Energy - Oil & Gas" },
        { model: "Energy - Other" },
        { model: "Energy – Utilities" },
        { model: "Entertainment" },
        { model: "Ecommerce" },
        { model: "Environment" },
        { model: "Education" },
        { model: "Forestry" },
        { model: "Fast-moving consumer goods" },
        { model: "Fashion & lifestyle" },
        { model: "GIS/Mapping/Cadastral" },
        { model: "Global Development" },
        { model: "Government – Civil" },
        { model: "Government - Defense &Intelligence" },
        { model: "Healthcare" },
        { model: "Hotels & Restaurant" },
        { model: "Insurance" },
        { model: "Logistics" },
        { model: "Marine / Fishing" },
        { model: "Media / Communications" },
        { model: "Office Supplies" },
        { model: "Public Services" },
        { model: "Retail" },
        { model: "Real Estate & Infrastructure" },
        { model: "Telecom" },
        { model: "Travel & Transport" },
        { model: "Others" }

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
      //$scope.agents = [1,2]

      //Suggest Me Dialog 1
      $scope.suggestMeConfirm = function (project) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('We will get back to you!!!!')
            .textContent('You can specify some description text in here.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(project)
        );
      };

      function selectMarker(marker){
        $scope.selectedProduct = marker;
        selectorMarker.setPosition(marker.position);
        selectorMarker.setMap($scope.mapObj);
        $scope.product.image = config.serverUrl + marker.properties['image'];
        $scope.product.siteNo = marker.properties['siteNo'];
        $scope.product.panelSize = marker.properties['panelSize'];
        $scope.product.address = marker.properties['address'];
        $scope.product.impressions = marker.properties['impressions'];
        $scope.product.direction = marker.properties['direction'];
        $scope.product.availableDates = marker.properties['availableDates'];
        $mdSidenav('productDetails').toggle();
      }

      google.maps.event.addListener(selectorMarker, 'click', function(e){
        $scope.selectedProduct = null;
        selectorMarker.setMap(null);
      });

      var productList = [];
      var locArr = [];
      var uniqueMarkers = [];
      var concentricMarkers = {};
      $scope.processMarkers = function () {  
        // console.log($scope.filteredMarkers);
        _.each($scope.filteredMarkers, function (v, i) {
          var product = {position: {lat: v.lat, lng: v.lng}, data: {v}};
          productList.push(product);
          if (locArr[JSON.stringify(product.position)]) {
            locArr[JSON.stringify(product.position)]++;
          } else {
            locArr[JSON.stringify(product.position)] = 1;
          }
        });
        // console.log(locArr);
        _.each(productList, function(v, i){
          if(locArr[JSON.stringify(v.position)] > 1){            
            if(concentricMarkers[JSON.stringify(v.position)]){
              concentricMarkers[JSON.stringify(v.position)].count++;
              concentricMarkers[JSON.stringify(v.position)].markers.push(v.data.v);
            }
            else{
              concentricMarkers[JSON.stringify(v.position)] = {};
              concentricMarkers[JSON.stringify(v.position)].markers = [];
              concentricMarkers[JSON.stringify(v.position)].count = 1;
              concentricMarkers[JSON.stringify(v.position)].markers.push(v.data.v);
            }
          }
          else{
            uniqueMarkers.push(v.data.v);
          }
        });

        // console.log(uniqueMarkers);
        console.log(concentricMarkers);

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
              scaledSize: new google.maps.Size(40, 40)
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

        _.each(concentricMarkers, function (markerData, index){          
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
              marker.groupSize = markerData.count;
              markersOnMap.push(marker);
              oms.addMarker(marker);  // adds the marker to the spiderfier _and_ the map
            })();
          }
        });

        // instantiate oms when click occurs on marker-group
        oms.addListener('format', function (marker, status) {
          console.log(marker);
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
              url: 'assets/images/maps/spidered-marker.png',
              scaledSize: new google.maps.Size(36, 36),
              origin: new google.maps.Point(0, 0), // origin
              anchor: new google.maps.Point(18, 18) // anchor
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

      $scope.toggleTraffic = function () {
        trafficOn = !trafficOn;
        var mapVal = null;
        if (trafficOn) {
          mapVal = $scope.mapObj;
        }
        trafficLayer.setMap(mapVal);
      }
 
      $scope.applyFilter = function(){
        var filterObj = {area: $scope.selectedAreas, product_type: null};
        MapService.filterProducts(filterObj).then(function (markers) {          
          if(markers != null){
            _.each(markersOnMap, function(v, i){
              v.setMap(null);
              $scope.Clusterer.removeMarker(v);
            });
            markersOnMap = [];
            $scope.filteredMarkers = markers;
            $scope.processMarkers();
            var bounds = new google.maps.LatLngBounds();
            _.each(markersOnMap, function(v, i){
              bounds.extend(v.getPosition());
            });
            $scope.mapObj.fitBounds(bounds);
          }
          else{
            alert("no marker found in the area(s) you selected");
          }
        });
      }

      $scope.setNewAddress = function () {
        // console.log($scope.address.components.location);
      }

      $scope.shortlistSelected = function(){
        MapService.shortListProduct($scope.selectedProduct.properties.id, "23fkf23vlh").then(function(response){
          alert(response.message);
        });
      }
      MapService.getshortListProduct("23fkf23vlh").then(function(response){ 
          $scope.shortListeddata = response;
          // console.log($scope.shortListeddata,"$scope.shortListeddata");
        })
        $scope.deletShortlisted =function (product){
        MapService.deleteshortListProduct("23fkf23vlh","product").then(function(response){
          console.log(response,"deleted data")
        })
      };

      $scope.resetFilters = function(){
        $scope.selectedAreas = null;
        $scope.selectedcitys = null;
        $scope.selectedStates = null;
        _.each(markersOnMap, function(v, i){
          v.setMap(null);
          $scope.Clusterer.removeMarker(v);
        });
        markersOnMap = [];
        MapService.markers().then(function (markers) {
          $scope.filteredMarkers = markers;
          $scope.processMarkers();
          var bounds = new google.maps.LatLngBounds();
          _.each(markersOnMap, function(v, i){
            bounds.extend(v.getPosition());
          });
          $scope.mapObj.fitBounds(bounds);
        });
      }
    }
  ]
);
