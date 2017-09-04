app.controller('GmapCtrl',
  ['$scope', 'NgMap', '$mdSidenav', '$mdDialog', '$timeout', 'MapService', 'LocationService', 'config',
    function ($scope, NgMap, $mdSidenav, $mdDialog, $timeout, MapService, LocationService, config) {
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
      });
      $scope.countries=[];
      $scope.states=[];
      $scope.cities=[];
      LocationService.getCountries().then(function (countries) {
        $scope.countries = countries;
      });
      
      var trafficOn = false;
      var trafficLayer = new google.maps.TrafficLayer();
      NgMap.getMap().then(function (map) {
        $scope.mapObj = map;
        $scope.processMarkers();
      });

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
      $scope.allcountries = [];
      $scope.states = [];
      $scope.citys = [];
      $scope.areas = [];
      
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

       };

      //Toaster Function Call
      var isDlgOpen;
      $scope.showCustomToast = function () {
        $mdToast.show({
          hideDelay: 5000,
          position: 'top center',
          controller: 'GmapCtrl',
          templateUrl: 'views/toast-template.html'
        });
      };
      $scope.closeToast = function() {
        if (isDlgOpen) return;
        $mdToast
          .hide()
          .then(function() {
            isDlgOpen = false;
          });
      };
        
      //Toaster Function Call

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
      $scope.suggestMeConfirm = function (ev) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('We will get back to you!!!!')
            .textContent('You can specify some description text in here.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
      };

      function Marker(markerObj) {
        var arr = [];
        arr["lat"] = parseFloat(markerObj.lat);
        arr["lng"] = parseFloat(markerObj.lng);
        return arr;
      }

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

      $scope.processMarkers = function () {
        var counts = [];
        var uniq_markers = [];
        _.each($scope.filteredMarkers, function (v, i) {
          var coordObj = JSON.stringify(v);
          if (counts[coordObj]) {
            counts[coordObj]++;
          } else {
            counts[coordObj] = 1;
          }
        });
        var uniq_coords = _.pick(counts, function (value, key) {
          return value == 1;
        });
        var repeated_coords = _.pick(counts, function (value, key) {
          return value > 1;
        });

        /* 
        //// handling clustering ////
        */
        _.each(uniq_coords, function (value, key) {
          key = JSON.parse(key);
          var latLng = new google.maps.LatLng(key['lat'], key['lng']);
          var marker = new google.maps.Marker({
            position: latLng,
            icon: {
              url: config.serverUrl + key["symbol"],
              scaledSize: new google.maps.Size(40, 40)
            }
          });
          marker.properties = key;
          uniq_markers.push(marker);
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
        $scope.keyClusterer = new MarkerClusterer($scope.mapObj, uniq_markers, mc);

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

        _.each(repeated_coords, function (value, key) {
          for (var i = 0; i < value; i++) {
            (function () {  // make a closure over the marker and marker data
              var label = {};
              label.text = " ";
              label.color = "rgba(255, 255, 255, 1)";
              if (i == 0) {
                label.text = value.toString();
              }
              var ll = key.split(',');
              var icon = {
                url: 'assets/images/maps/unspidered-cluster.png',
                scaledSize: new google.maps.Size(20, 20),
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(10, 10) // anchor
              };
              var marker = new google.maps.Marker({
                position: { lat: parseFloat(ll[0]), lng: parseFloat(ll[1]) },
                icon: icon,
                label: label
              });
              marker.groupSize = value;
              markersOnMap.push(marker);
              oms.addMarker(marker);  // adds the marker to the spiderfier _and_ the map
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
<<<<<<< HEAD
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

  $scope.savedata = function () {
    // handles the submitted form data from map-filtering.
  }
=======

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
              $scope.keyClusterer.removeMarker(v);
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
>>>>>>> 65730cc5744148868d20729d4c35e7ab930a2a92

      $scope.shortlistSelected = function(){
        MapService.shortListProduct($scope.selectedProduct.properties.id, "23fkf23vlh").then(function(response){
          alert(response.message);
        });
      }

      $scope.resetFilters = function(){
        $scope.selectedAreas = null;
        $scope.selectedcitys = null;
        $scope.selectedStates = null;
        _.each(markersOnMap, function(v, i){
          v.setMap(null);
          $scope.keyClusterer.removeMarker(v);
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
