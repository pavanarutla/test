app.controller('GmapCtrl',
  ['$scope', 'NgMap', '$mdSidenav', '$mdDialog', 'MapService', 'config',
    function ($scope, NgMap, $mdSidenav, $mdDialog, MapService, config) {
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
      $scope.product = {};
      MapService.markers().then(function (markers) {
        $scope.filteredMarkers = markers;
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

      //select country
      var countries = [
        { Id: '1', Countryname: 'India' },
        { Id: '2', Countryname: 'USA' },
        { Id: '3', Countryname: 'Australia' },
        { Id: '4', Countryname: 'Brazil' },
        { Id: '5', Countryname: 'Germany' },
        { Id: '6', Countryname: 'NewYork' }
      ];
    
      // select state
      var states = [
        { Id: '1', statename: 'Telangana', countriesId: 1 },
        { Id: '2', statename: 'Karnataka', countriesId: 1 },
        { Id: '3', statename: 'Maharashtra', countriesId: 1 },
        { Id: '4', statename: 'Kerala', countriesId: 1 },
        { Id: '5', statename: 'Odisha', countriesId: 1 },
        { Id: '6', statename: 'Tamil Nadu', countriesId: 1 }
      ]
      $scope.searchTerm;
      $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
      };

      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      // $element.find('input').on('keydown', function (ev) {
      //   ev.stopPropagation();
      // });

      // city selection
      var citys = [
        { Id: '1', cityname: 'Hyderabad ',statesId:1 },
        { Id: '2', cityname: 'Bengaluru',statesId:2 },
        { Id: '3', cityname: 'Mumbai',statesId:3 },
        { Id: '4', cityname: 'Thiruvananthapuram',statesId:4 },
        { Id: '5', cityname: 'Bhubaneswar',statesId:5 },
        { Id: '6', cityname: 'Chennai',statesId:6 }
      ];
      $scope.searchTerm;
      $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
      };

      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      // $element.find('input').on('keydown', function (ev) {
      //   ev.stopPropagation();
      // });
      
      // areas
      var areas = [
        { Id: '1', areaname: 'Amerpet',citysId: 1 },
        { Id: '2', areaname: 'SR nagar',citysId: 2 },
        { Id: '3', areaname: 'Panjagutta',citysId: 3 },
        { Id: '4', areaname: 'Somajigudda',citysId: 4 },
        { Id: '5', areaname: 'Imax',citysId: 5 },
        { Id: '6', areaname: 'Imax',citysId: 6 }
      ];
      $scope.searchTerm;
      $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
      };

      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      // $element.find('input').on('keydown', function (ev) {
      //   ev.stopPropagation();
      // });


      // $scope.Submit = function (data) {
      //   $scope.data = data;
      //   console.log("posting data....");
      //   formData = $scope.form;
      //   console.log(formData);
      // };

      $scope.allcountries = countries;
      $scope.setCountry = function(){
        $scope.states = states.filter(function (st) {
          return st.countriesId == parseInt($scope.selectedCountry);
        });
      }

      $scope.setStates = function(){
        $scope.citys = citys.filter(function (citi) {
          return citi.statesId == parseInt($scope.selectedStates);
        });
      }
      $scope.setcitys = function(){
        $scope.areas = areas.filter(function (ar) {
          return ar.citysId == parseInt($scope.selectedcitys);
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
        console.log(uniq_coords);
        console.log("repeated", repeated_coords);
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
              scaledSize: new google.maps.Size(40, 40),
              // origin: new google.maps.Point(0, 0), // origin
              // anchor: new google.maps.Point(20, 30) // anchor
            }
          });
          uniq_markers.push(marker);
          google.maps.event.addListener(marker, 'click', function (e) {
            $scope.product.image = config.serverUrl + key['image'];
            $scope.product.siteNo = key['siteNo'];
            $scope.product.panelSize = key['panelSize'];
            $scope.product.address = key['address'];
            $scope.product.impressions = key['impressions'];
            $scope.product.direction = key['direction'];
            $scope.product.availableDates = key['availableDates'];
            $mdSidenav('productDetails').toggle();
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
              google.maps.event.addListener(marker, 'spider_click', function (e) {  // 'spider_click', not plain 'click'
                iw.setContent("dummy text");
                iw.open($scope.mapObj, marker);
              });
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

      $scope.setNewAddress = function () {
        console.log($scope.address.components.location);
      }

      $scope.setNewAddress = function () {
        console.log($scope.address.components.location);
      }

    }
  ]
);
