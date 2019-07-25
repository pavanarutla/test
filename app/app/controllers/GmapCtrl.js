app.controller('GmapCtrl',
    ['$scope', '$location', '$auth', 'NgMap', '$mdSidenav', '$mdDialog', '$timeout','$window', '$rootScope', 'MapService', 'LocationService', 'ProductService', 'CampaignService', 'FileSaver', 'Blob', 'config', 'toastr', '$state',
        function ($scope, $location, $auth, NgMap, $mdSidenav, $mdDialog, $timeout, $window, $rootScope, MapService, LocationService, ProductService, CampaignService, FileSaver, Blob, config, toastr, $state) {
            $scope.forms = {};
            $scope.address = {
                // name: 'Hyderabad, Telangana, India',
                name: 'United States of America',
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
                        lat: 40.254050,
                        lng: -100.726083
                    }
                }
            };
            $scope.format = 'yyyy/MM/dd';
            $scope.date = new Date();
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.altInputFormats = ['M!/d!/yyyy'];
            $scope.ranges = {
                selectedDateRanges: []
            };

            /*================================
                 | Multi date range picker options
                 ================================*/
                 $scope.mapProductOpts = {
                    multipleDateRanges: true,
                    opens: 'center',
                    locale: {
                        applyClass: 'btn-green',
                        applyLabel: "Select Dates",
                        fromLabel: "From",
                        format: "DD-MMM-YY",
                        toLabel: "To",
                        cancelLabel: 'X',
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
                            // console.log(ev);
                        }
                    }
                };
                /*====================================
                 | Multi date range picker options end
                 ====================================*/
            $scope.IsDisabled = true;
            $scope.EnableDisable = function () {
                $scope.IsDisabled = $scope.campaign.name.length == 0;
            }

            // FIlter Dates
            $scope.FilterDates = function (booked_from, booked_to) {
                if(booked_from &&  booked_to){
                    productList = [];
                    locArr = [];
                    uniqueMarkers = [];
                    concentricMarkers = {};
                    var filterObj = { area: $scope.selectedAreas, product_type: $scope.selectedFormats, booked_from, booked_to };
                    $scope.plottingDone = false;
                    MapService.filterProducts(filterObj).then(function (markers) {
                        _.each(markersOnMap, function (v, i) {
                            v.setMap(null);
                            $scope.Clusterer.removeMarker(v);
                        });
                        markersOnMap = Object.assign([]);
                        $scope.filteredMarkers = markers;
                        $scope.productmarkerslist = markers;
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
                }else {
                    return false;
                }
              
            };
            // FIlter Dates Ends
            $scope.hidelocations = false;
            var setDefaultArea = function () {
                $scope.selectedArea = JSON.parse(localStorage.areaFromHome);
                var area = $scope.selectedArea;
                $scope.mapObj.setCenter({ lat: Number(area.lat), lng: Number(area.lng) });
                var bounds = new google.maps.LatLngBounds();
                bounds.extend({ lat: Number(area.lat), lng: Number(area.lng) });
                $scope.mapObj.fitBounds(bounds);
                localStorage.removeItem('areaFromHome');
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
            $scope.isMapInitialized = false;
            $scope.plottingDone = false;

            $scope.$watch(
                function () {
                    return $mdSidenav('productDetails').isOpen();
                },
                function (newValue, oldValue) {
                    if (newValue == false) {
                        $scope.selectedProduct = null;
                        selectorMarker.setMap(null);
                        $scope.$parent.existingCampaignSidenavVisible = false;
                    }
                }
            );

            // $scope.$watch(
            //     function () {
            //         return $mdSidenav('digitalProductDetails').isOpen();
            //     },
            //     function (newValue, oldValue) {
            //         if (newValue == false) {
            //             $scope.selectedProduct = null;
            //             selectorMarker.setMap(null);
            //             $scope.$parent.existingCampaignSidenavVisible = false;
            //         }
            //     }
            // );

            $scope.$watch(
                function () {
                    //return $mdSidenav('suggestMe').isOpen();
                },
                function (newValue, oldValue) {
                    if (newValue == false) {
                        $scope.suggestMeRequestSent = false;
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

            MapService.mapProducts().then(function (markers) {
                $scope.filteredMarkers = markers;
                NgMap.getMap().then(function (map) {
                    $scope.mapObj = map;
                    $scope.processMarkers();
                    if (localStorage.areaFromHome) {
                        setDefaultArea();
                    }
                    $scope.mapObj.addListener('zoom_changed', function () {
                        $scope.selectedProduct = null;
                        selectorMarker.setMap(null);
                    });
                });
                $scope.actualDataCopy = markers;
                $scope.productmarkerslist = markers;
            });
            ProductService.getFormatList().then(function (formats) {
                $scope.formatList = formats;
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
            $scope.pointermap = function () {
                $scope.ispointer = !$scope.ispointer;
            };
            // $scope.showProductImagePopup = function (ev, img_src) {
            //     $mdDialog.show({
            //         locals: { src: img_src },
            //         templateUrl: 'views/image-popup-large.html',
            //         fullscreen: $scope.customFullscreen,
            //         clickOutsideToClose: true,
            //         controller: function ($scope, src) {
            //             $scope.img_src = src;
            //             $scope.closeMdDialog = function () {
            //                 $mdDialog.hide();
            //             }
            //         }
            //     });
            // };
             // need to check
            $scope.showProductImagePopup = function (ev, img_src) {
                $mdDialog.show({
                    locals: { src: img_src },
                    templateUrl: 'views/image-popup-large.html',
                    fullscreen: $scope.customFullscreen,
                    clickOutsideToClose: true,
                    controller: function ($scope, src) {
                        $scope.img_src_0 = src.image;
                        $scope.img_src_1 = src.f_image;
                        $scope.closeMdDialog = function () {
                            $mdDialog.hide();
                        }
                    }
                });
            };
            $scope.showProductDate = function (ev,product) {
                $mdDialog.show({
                    templateUrl: 'views/map-calendar-popup.html',
                    fullscreen: $scope.customFullscreen,
                    clickOutsideToClose: true,
                    preserveScope: true,
                    scope: $scope,
                    controller: function ($scope) {
                        $scope.closeMdDialog = function () {
                            $mdDialog.hide();
                        }
                        setTimeout(() => {
                            angular.element($('#calender-autolaod-div')).trigger('click')
                        },100)
                    }
                });
            };
             // need to check
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
                        //.textContent('You can specify some description text in here.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!')
                        .targetEvent(ev)
                );
            };
            // $scope.industrySectorList = [
            //     {name: "Aerospace"},
            //     {name: "Agriculture"},
            //     {name: "Automotive"},
            //     {name: "Banking, Financial services and Insurance"},
            //     {name: "Construction, Engineering, Architectural"},
            //     {name: "Classifieds"},
            //     {name: "Consumer Durables"},
            //     {name: "Energy - Oil & Gas"},
            //     {name: "Energy - Other"},
            //     {name: "Energy – Utilities"},
            //     {name: "Entertainment"},
            //     {name: "Ecommerce"},
            //     {name: "Environment"},
            //     {name: "Education"},
            //     {name: "Forestry"},
            //     {name: "Fast-moving consumer goods"},
            //     {name: "Fashion & lifestyle"},
            //     {name: "GIS/Mapping/Cadastral"},
            //     {name: "Global Development"},
            //     {name: "Government – Civil"},
            //     {name: "Government - Defense &Intelligence"},
            //     {name: "Healthcare"},
            //     {name: "Hotels & Restaurant"},
            //     {name: "Insurance"},
            //     {name: "Logistics"},
            //     {name: "Marine / Fishing"},
            //     {name: "Media / Communications"},
            //     {name: "Office Supplies"},
            //     {name: "Public Services"},
            //     {name: "Retail"},
            //     {name: "Real Estate & Infrastructure"},
            //     {name: "Telecom"},
            //     {name: "Travel & Transport"},
            //     {name: "Others"}
            // ];
            // $scope.CampaignDuration = [
            //     {model: "10 Days"},
            //     {model: "15 Days"},
            //     {model: "20 Days"},
            //     {model: "25 Days"},
            //     {model: "30 Days"},
            //     {model: "2 Months"},
            //     {model: "3 Months"},
            //     {model: "6 Months"},
            //     {model: "1 year"}
            // ];
            //export all 

            // $scope.exportAllCampaigns = function () {
            //     CampaignService.exportCampaignsPdf().then(function (result) {
            //         var campaignPdf = new Blob([result], {type: 'application/pdf;charset=utf-8'});
            //         FileSaver.saveAs(campaignPdf, 'campaigns.pdf');
            //         if (result.status) {
            //             toastr.error(result.meesage);
            //         }
            //     });
            // };
            ////////////////////////////////////////////////////////////////////////
            // tablet filters filtersMap

            $scope.toggleViewAllFilter = function () {
                $mdSidenav('filtersMobile').toggle();
            };
            $scope.mapFilter = function () {
                $mdSidenav('filtersMap').toggle();
            };
            $scope.shortListed = function () {
                $mdSidenav('shortlistedList').toggle();
            };
            $scope.savedCampagin = function () {
                $mdSidenav('savedCamapgin').toggle();
            };
            ////////////////////////////////////////////////////////////////////
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
            // $scope.start_date = new Date();
            $scope.endDate = $scope.start_date + 1;

            //    if(start_date > end_date){
            //     $scope.errMessage = 'end date should not be before start day.';
            //     return false;
            //  }

            function selectMarker(marker) {
                $scope.toggleProductDetailSidenav()
                $scope.$parent.alreadyShortlisted = false;
                $scope.mapObj.setCenter(marker.position);
                selectorMarker.setPosition(marker.position);
                selectorMarker.setMap($scope.mapObj);
                $scope.product.id = marker.properties['id'];
                $scope.product.price = marker.properties['price'];
                $scope.product.image = config.serverUrl + marker.properties['image'];
                $scope.product.siteNo = marker.properties['siteNo'];
                $scope.product.city = marker.properties['city'];
                $scope.product.panelSize = marker.properties['panelSize'];
                $scope.product.type = marker.properties['type'];
                $scope.product.ethnicity =  marker.properties['ethnicity'];
                $scope.product.venue = marker.properties['venue'];
                $scope.product.demographicsage = marker.properties['demographicsage'];
                $scope.product.address = marker.properties['address'];               
                $scope.product.area_name = marker.properties['area_name'];
                $scope.product.impressions = marker.properties['impressions'];
                $scope.product.format = marker.properties['format_name'];
                $scope.product.lighting = marker.properties['lighting'];
                $scope.product.direction = marker.properties['direction'];
                $scope.product.availableDates = marker.properties['availableDates'];
                $scope.product.slots = marker.properties['slots'];
                $scope.product.minimumbooking = marker.properties['minimumbooking'];
                $scope.product.strengths = marker.properties['strengths'];
                $scope.hideSelectedMarkerDetail = false;
                // $scope.getProductUnavailableDatesautoload(marker.properties['id']);
                // if (marker.properties['type'] == "Bulletin") {
                //     $mdSidenav('productDetails').open();
                // } else if (marker.properties['type'] == "Digital Bulletin" || marker.properties['type'] == "Transit") {
                //     $mdSidenav('digitalProductDetails').open();
                // }
                $mdSidenav('productDetails').open();
                $scope.selectedProduct = marker;
            }

            function selectSpideredMarker(marker) {
                $scope.toggleProductDetailSidenav()
                $scope.$parent.alreadyShortlisted = false;
                $scope.mapObj.setCenter(marker.position);
                selectorMarker.setMap(null);
                $scope.product.id = marker.properties['id'];
                $scope.product.price = marker.properties['price'];
                $scope.product.image = config.serverUrl + marker.properties['image'];
                $scope.product.siteNo = marker.properties['siteNo'];
                $scope.product.city = marker.properties['city'];
                $scope.product.panelSize = marker.properties['panelSize'];
                $scope.product.type = marker.properties['type'];
                $scope.product.demographicsage = marker.properties['demographicsage'];
                $scope.product.address = marker.properties['address']; 
                $scope.product.ethnicity =  marker.properties['ethnicity'];
                $scope.product.venue = marker.properties['venue'];
                $scope.product.area_name = marker.properties['area_name'];
                $scope.product.impressions = marker.properties['impressions'];
                $scope.product.format = marker.properties['format_name'];
                $scope.product.direction = marker.properties['direction'];
                $scope.product.lighting = marker.properties['lighting'];
                $scope.product.availableDates = marker.properties['availableDates'];
                $scope.product.slots = marker.properties['slots'];
                $scope.product.minimumbooking = marker.properties['minimumbooking'];
                $scope.product.strengths = marker.properties['strengths'];
                $scope.hideSelectedMarkerDetail = false;
                // if (marker.properties['type'] == "Bulletin") {
                //     $scope.productPerDay = $scope.product.price / 28;
                // } else if (marker.properties['type'] == "Digital" || marker.properties['type'] == "Transit Bulletin") {
                    // $scope.productPerDay = $scope.product.price / 28;
                // }
                $mdSidenav('productDetails').open();
                // $scope.getProductUnavailableDatesautoload(marker.properties['id']);
                $scope.selectedProduct = marker;
            }


            /* function selectSpideredMarker(marker) {
             $scope.$parent.alreadyShortlisted = false;
             $scope.mapObj.setCenter(marker.position);
             selectorMarker.setMap(null);
             
             $mdSidenav('productDetails').toggle();
             $scope.getProductUnavailableDatesautoload(marker.properties['id']);
             $scope.selectedProduct = marker;
             }*/



            google.maps.event.addListener(selectorMarker, 'click', function (e) {
                $scope.selectedProduct = null;
                selectorMarker.setMap(null);
            });

            /* google.maps.event.addListener(selectorMarker, 'click', function (e) {
             selectorMarker.setMap(null);
             });*/

            var productList = [];
            var locArr = [];
            var uniqueMarkers = [];
            var concentricMarkers = {};
            var uniqueMarkerArr = [];
            $scope.processMarkers = function () {
                markersOnMap = Object.assign([]);
                uniqueMarkerArr = Object.assign([]);
                /*_.each($scope.filteredMarkers, function (v, i) {
                 var product = {position: {lat: v.lat, lng: v.lng}, data: v};
                 productList.push(product);
                 if (locArr[JSON.stringify(product.position)]) {
                 locArr[JSON.stringify(product.position)]++;
                 } else {
                 locArr[JSON.stringify(product.position)] = 1;
                 }
                 });*/

                var mc = {
                    gridSize: 50,
                    maxZoom: 13,
                    imagePath: 'assets/images/maps/m'
                };
                $scope.Clusterer = new MarkerClusterer($scope.mapObj, uniqueMarkerArr, mc);

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
                            url: config.serverUrl + marker.properties['symbol'], //'assets/images/maps/spidered-marker.png',
                            scaledSize: new google.maps.Size(30, 30),
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(15, 15) // anchor
                        };
                    } else {
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
                    }
                    marker.setIcon(markerIcon);
                });

                // function addNewMarkers(markerData) {
                //     for (var i = 0; i < markerData.product_details.length; i++) {
                //         var label = {};
                //         label.text = " ";
                //         label.color = "rgba(255, 255, 255, 1)";
                //         if (i == 0) {
                //             label.text = markerData.product_details.length.toString();
                //         }
                //         var icon = {
                //             url: 'assets/images/maps/unspidered-cluster.png',
                //             scaledSize: new google.maps.Size(20, 20),
                //             origin: new google.maps.Point(0, 0), // origin
                //             anchor: new google.maps.Point(10, 10) // anchor
                //         };
                //         var marker = new google.maps.Marker({
                //             position: { lat: parseFloat(markerData._id.lat), lng: parseFloat(markerData._id.lng) },
                //             icon: icon,
                //             label: label,
                //             title: 'Location:' + markerData.product_details[i].address + '\nNo. of views: ' + markerData.product_details[i].impressions
                //         });
                //         marker.properties = markerData.product_details[i];
                //         marker.groupSize = markerData.product_details.length;
                //         google.maps.event.addListener(marker, 'spider_click', function (e) {
                //             if (marker.properties.type == "Bulletin") {
                //                 $scope.getProductUnavailableDates(marker.properties.id,e);
                //             } else if (marker.properties.type == "Digital Bulletin" || marker.properties.type == "Transit") {
                //                 $scope.getProductDigitalUnavailableDates(marker.properties.id, marker.properties.slots);
                //             }
                //             selectSpideredMarker(this);
                //         });
                //         markersOnMap.push(marker);
                //         oms.addMarker(marker);  // adds the marker to the spiderfier _and_ the map
                //         $scope.Clusterer.addMarker(marker);
                //     }
                // }
                function addNewMarkers(markerData) {
                    for (var i = 0; i < markerData.product_details.length; i++) {
                        var label = {};
                        label.text = " ";
                        label.color = "rgba(255, 255, 255, 1)";
                        if (i == 0) {
                            label.text = markerData.product_details.length.toString();
                        }
                        var icon = {
                            url: 'assets/images/maps/unspidered-cluster.png',
                            scaledSize: new google.maps.Size(20, 20),
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(10, 10) // anchor
                        };
                        var marker = new google.maps.Marker({
                            position: {lat: parseFloat(markerData._id.lat), lng: parseFloat(markerData._id.lng)},
                            icon: icon,
                            label: label,
                            title: 'Location:' + markerData.product_details[i].address + '\nNo. of views: ' + markerData.product_details[i].impressions
                        });
                        marker.properties = markerData.product_details[i];
                        marker.groupSize = markerData.product_details.length;
                        google.maps.event.addListener(marker, 'spider_click', function (e) {
                            $scope.toggleProductDetailSidenav();
                            selectSpideredMarker(this);
                        });
                        markersOnMap.push(marker);
                        oms.addMarker(marker);  // adds the marker to the spiderfier _and_ the map
                        $scope.Clusterer.addMarker(marker);
                    }
                }
                // function addUniqueMarker(markerData) {
                //     uniqueMarkers.push(markerData.product_details);
                //     var latLng = new google.maps.LatLng(markerData._id.lat, markerData._id.lng);
                //     var marker = new google.maps.Marker({
                //         position: latLng,
                //         icon: {
                //             url: config.serverUrl + markerData.product_details[0].symbol,
                //             scaledSize: new google.maps.Size(30, 30)
                //         },
                //         title: 'Location:' + markerData.product_details[0].address + '\nNo. of views: ' + markerData.product_details[0].impressions
                //     });
                //     marker.properties = markerData.product_details[0];
                //     uniqueMarkerArr.push(marker);
                //     markersOnMap.push(marker);
                //     $scope.Clusterer.addMarker(marker);
                //     google.maps.event.addListener(marker, 'click', function (e) {
                //         if (marker.properties.type == "Bulletin") {
                //             $scope.getProductUnavailableDates(marker.properties.id,e);
                //         } else if (marker.properties.type == "Digital Bulletin" || marker.properties.type == "Transit") {
                //             $scope.getProductDigitalUnavailableDates(marker.properties.id, marker.properties.slots);
                //         }
                //         selectMarker(marker);
                //     });
                // }
                function addUniqueMarker(markerData) {
                    uniqueMarkers.push(markerData.product_details);
                    var latLng = new google.maps.LatLng(markerData._id.lat, markerData._id.lng);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        icon: {
                            url: config.serverUrl + markerData.product_details[0].symbol,
                            scaledSize: new google.maps.Size(30, 30)
                        },
                        title: 'Location:' + markerData.product_details[0].address + '\nNo. of views: ' + markerData.product_details[0].impressions
                    });
                    marker.properties = markerData.product_details[0];
                    uniqueMarkerArr.push(marker);
                    markersOnMap.push(marker);
                    $scope.Clusterer.addMarker(marker);

                    google.maps.event.addListener(marker, 'click', function (e) {
                        selectMarker(marker);
                        // setTimeout(() => {
                        //     angular.element($('#calender-autolaod-div')).trigger('click');
                        //     angular.element($('#hideCalenderInput')).hide()
                        // },100)
                    });
                }
                //var latLngGroups = _.groupBy($scope.filteredMarkers, function (item) {
                //return item.lat + ', ' + item.lng;
                //});
                _.each($scope.filteredMarkers, function (data) {
                    if (data.product_details.length == 1) {
                        addUniqueMarker(data);
                    } else if (data.product_details.length > 1) {
                        addNewMarkers(data);
                    }
                    $scope.plottingDone = true;
                });

                // instantiate oms when click occurs on marker-group

            }

            $scope.$parent.$watch('trafficOn', function (oldValue, newValue) {
                var mapVal = null;
                if (!newValue) {
                    mapVal = $scope.mapObj;
                }
                trafficLayer.setMap(mapVal);
            });

            $scope.applyFilter = function () {
                productList = [];
                locArr = [];
                uniqueMarkers = [];
                concentricMarkers = {};
                var filterObj = { area: $scope.selectedAreas, product_type: $scope.selectedFormats };
                $scope.plottingDone = false;
                MapService.filterProducts(filterObj).then(function (markers) {
                    _.each(markersOnMap, function (v, i) {
                        v.setMap(null);
                        $scope.Clusterer.removeMarker(v);
                    });
                    markersOnMap = Object.assign([]);
                    $scope.filteredMarkers = markers;
                    $scope.productmarkerslist = markers;
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
            }

            // $scope.shortlistSelected = function (productId, selectedDateRanges, producttype, ev) {                
            //     var arr = [];
            //     var startAndEndDates = selectedDateRanges.filter((item) => item.selected)
            //     startAndEndDates.forEach((item, index) => {
            //         if(startAndEndDates.length == 1){
            //                 arr.push({ startDate: moment(item.startDay).format('YYYY-MM-DD'), endDate : moment(item.endDay).format('YYYY-MM-DD') })
            //         }else{
            //             if (index == 0) {
            //                 arr.push({ startDate: moment(item.startDay).format('YYYY-MM-DD') })
            //             } else if (index == startAndEndDates.length - 1) {
            //                 arr[0].endDate = moment(item.endDay).format('YYYY-MM-DD');
            //             }
            //         }
            //     })                
            //     if(producttype == "Digital Bulletin" || producttype == "Bulletin" ){
            //         var sendObj = {
            //             product_id: productId,
            //             dates: arr,                       
            //             numOfSlots : $scope.numOfSlots
            //         }
            //     }else{
            //         var sendObj = {
            //             product_id: productId,
            //             dates: arr
            //         }
            //     }
                
            //     MapService.shortListProduct(sendObj).then(function (response) {                    
            //         getShortListedProducts();
            //         if(response.status == 0){
            //             toastr.error(response.message);
            //         }else if((response.status == 1)){
            //             toastr.success(response.message);
            //             $scope.toggleProductDetailSidenav();
            //         }
                    
            //         // $mdDialog.show(
            //         //     $mdDialog.alert()
            //         //         .parent(angular.element(document.querySelector('body')))
            //         //         .clickOutsideToClose(true)
            //         //         .title('Shortlist Product')
            //         //         .textContent(response.message)
            //         //         .ariaLabel('shortlist-success')
            //         //         .ok('Got it!')
            //         //         .targetEvent(ev),
            //         //      $mdSidenav('productDetails').close()
            //         // );
                  
            //         // $mdSidenav('productDetails').close()
            //     });
            // }
            $scope.shortlistSelected = function (productId, selectedDateRanges, ev) { 
                var sendObj = {
                    product_id: productId,
                    dates: selectedDateRanges,
                    booked_slots: 1
                }

                MapService.shortListProduct(sendObj).then(function (response) {
                    if(response.status == 1){
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
                            $scope.removeSelection();
                            getShortListedProducts();
                            $mdSidenav('productDetails').close();
                    }else if(response.status == 0){
                        toastr.error(response.message)
                    }     
                     
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

            $scope.deleteShortlisted = function (ev, productId) {
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
                $scope.selectedArea = null;
                $scope.circleRadius = null;
                $scope.plottingDone = false;
                _.each(markersOnMap, function (v, i) {
                    v.setMap(null);
                    $scope.Clusterer.removeMarker(v);
                    delete v;
                });
                markersOnMap = [];
                MapService.markers().then(function (markers) {
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
            var startDate = new Date();
            var productFromDate = new Date($scope.campaign.start_date);
            var productToDate = new Date($scope.campaign.end_date);
            $scope.fromMinDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + 6
            );
            $scope.toMinDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
            );
            $scope.saveCampaign = function (product_id, selectedDateRanges) {
                // If we finally decide to use selecting products for a campaign
                // if($scope.selectedForNewCampaign.length == 0){
                //   // add all shortlisted products to campaign
                //   // CampaignService.saveCampaign($scope.shortListedProducts).then(function(response){
                //   //   $scope.campaignSavedSuccessfully = true;
                //   // });
                // }
                // else{
                //   // add all shortlisted products for new campaign
                //   // CampaignService.saveCampaign($scope.selectedForNewCampaign).then(function(response){
                //   //   $scope.campaignSavedSuccessfully = true;
                //   // });
                // }
                // campaign.products = $scope.selectedForNewCampaign;
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

            $scope.emptyCampaign = {};
            $scope.createEmptyCampaign = function () {
                $scope.campaign.products = [];
                CampaignService.saveCampaign($scope.emptyCampaign).then(function (response) {
                    $scope.emptyCampaignSaved = true;
                    $scope.emptyCampaign = {};
                    $timeout(function () {
                        $mdSidenav('createEmptyCampaignSidenav').close();
                        $scope.emptyCampaignSaved = false;
                    }, 3000);
                    $scope.loadActiveUserCampaigns();
                    getShortListedProducts();
                });
            };
            // Added this fn to clear the selected Results
            $scope.clearFields = function () {
                $scope.searchId = '';
                $scope.searchText = '';
                window.location.reload(true);
                //$route.reload();

            }

            $scope.selectFromTabIdSearch = function (marker) {
                $scope.toggleProductDetailSidenav();
                if (marker.id) {
                    var refToMapMarker = _.find(markersOnMap, (m) => {
                        return m.properties.id == marker.id;
                    });
                    $scope.$parent.alreadyShortlisted = false;
                    $scope.mapObj.setCenter(refToMapMarker.position);
                    var bounds = new google.maps.LatLngBounds();
                    bounds.extend(refToMapMarker.position);
                    $scope.mapObj.fitBounds(bounds);
                    $scope.product.id = refToMapMarker.properties['id'];
                    $scope.product.image = config.serverUrl + refToMapMarker.properties['image'];
                    $scope.product.siteNo = refToMapMarker.properties['siteNo'];
                    $scope.product.area_name = refToMapMarker.properties['area_name'];
                    $scope.product.panelSize = refToMapMarker.properties['panelSize'];
                    $scope.product.demographicsage = refToMapMarker.properties['demographicsage'];
                    $scope.product.strengths = refToMapMarker.properties['strengths'];
                    $scope.product.address = refToMapMarker.properties['address'];
                    $scope.product.city = refToMapMarker.properties['city'];
                    $scope.product.impressions = refToMapMarker.properties['impressions'];
                    $scope.product.type = refToMapMarker.properties['type'];
                    $scope.product.ethnicity = refToMapMarker.properties['ethnicity'];
                    $scope.product.price = refToMapMarker.properties['price'];
                    $scope.product.venue = refToMapMarker.properties['venue'];
                    $scope.product.lighting = refToMapMarker.properties['lighting'];
                    $scope.product.direction = refToMapMarker.properties['direction'];
                    $scope.product.availableDates = refToMapMarker.properties['availableDates'];
                    $scope.product.slots = refToMapMarker.properties['slots'];
                    $scope.product.minimumbooking = refToMapMarker.properties['minimumbooking'];
                    $scope.hideSelectedMarkerDetail = false;
                    $mdSidenav('productDetails').open();
                    $scope.selectedProduct = refToMapMarker;
                } else {
                    toastr.error('No product found with that tab id', 'error');
                }
            }
            $scope.ListMapView = true;
            $scope.openRightMenu = function() {
                $scope.ListMapView = false;
                $mdSidenav('productList').toggle();
             };
             $scope.closedRightMenu = function() {
                $scope.ListMapView = true;
                $mdSidenav('productList').toggle();
             };
            //  $scope.openLeftMenu = function() {
            //     $mdSidenav('productList').toggle();
            //  };
            $scope.activeUserCampaigns = [];
            $scope.loadActiveUserCampaigns = function () {
                CampaignService.getActiveUserCampaigns().then(function (result) {
                    $scope.activeUserCampaigns = result.filter(function (item) {
                        if (item.status == 100) {
                            return true;
                        }
                    });
                });
            }
            $scope.loadActiveUserCampaigns();

            $scope.deleteUserCampaign = function (campaignId) {
                CampaignService.deleteCampaign(campaignId).then(function (result) {
                    if (result.status == 1) {
                        $scope.loadActiveUserCampaigns();
                        toastr.success(result.message);
                    } else {
                        toastr.error(result.message);
                    }
                });
            }

            $scope.toggleFormatSelection = function (formatId) {
                if (_.contains($scope.selectedFormats, formatId)) {
                    $scope.selectedFormats = _.reject($scope.selectedFormats, function (v) {
                        return v == formatId
                    });
                } else {
                    $scope.selectedFormats.push(formatId);
                }
                $scope.applyFilter();
            }

            $scope.isFormatSelected = function (formatId) {
                return _.contains($scope.selectedFormats, formatId);
            }
            // $scope.isDateSelected = function (dates) {
            //     return _.contains($scope.filterDates, dates);
            // }

            $scope.toggleTrafficLegends = function () {
                $scope.showTrafficLegend = !$scope.showTrafficLegend;
            }

            rangeCircle = new google.maps.Circle({
                strokeColor: "#ea3b37",
                strokeOpacity: 1.0,
                strokeWeight: 1.5,
                // fillColor: "#0000ff",
                fillOpacity: 0.0,
            });

            $scope.range = {};
            $scope.range.circleRadius = 0;
            $scope.updateCircle = function () {
                rangeCircle.setMap(null);
                rangeCircle.setRadius(Math.sqrt($scope.circleRadius * 1000 / Math.PI));
                rangeCircle.setCenter({ lat: Number($scope.selectedArea.lat), lng: Number($scope.selectedArea.lng) });
                rangeCircle.setMap($scope.mapObj);
                $scope.mapObj.fitBounds(rangeCircle.getBounds());
            }
            // Drawing a circle ends

            $scope.viewCampaignDetails = function (campaignId) {
                CampaignService.getCampaignWithProducts(campaignId).then(function (campaignDetails) {
                    $scope.campaignDetails = campaignDetails;
                    $scope.$parent.alreadyShortlisted = true;
                    // $scope.toggleCampaignDetailSidenav();
                });
            }

            var updateCampaignDetailSidenav = function (campaignId) {
                CampaignService.getCampaignWithProducts(campaignId).then(function (campaignDetails) {
                    $scope.campaignDetails = campaignDetails;
                });
            }
           
            $scope.customOptions = {};
            $scope.removeSelection = function () {
                $scope.customOptions.clearSelection();
            }
            $scope.$on("removeSelection", function () {
                $scope.removeSelection();
            })
            $scope.addProductToExistingCampaign = function (existingCampaignId, productId ) {          
                var productToCampaign = {
                    product_id: productId,
                    campaign_id: existingCampaignId,
                    dates :[]
                }; 
                $scope.ranges.selectedDateRanges.forEach((item, index) => {
                    productToCampaign.dates.push({startDate : moment(item.startDate).format('YYYY-MM-DD'),endDate : moment(item.endDate).format('YYYY-MM-DD')})
                })
                CampaignService.addProductToExistingCampaign(productToCampaign).then(function (result) {                 
                    if (result.status == 1) {
                        //$scope.existingCampaign.id = null;                       
                        toastr.success(result.message);
                        // $mdSidenav('productDetails').close();
                        $scope.toggleExistingCampaignSidenav();
                        $scope.toggleProductDetailSidenav();
                        $window.location.href = '#/campaign-details/' + existingCampaignId;
                    } else if (result.status == 0) {
                        toastr.error(result.message);
                    }
                });
                // $scope.toggleProductDetailSidenav();
            }

            $scope.shareShortlistedProducts = function (shareShortlisted) {
                var sendObj = {
                    email: shareShortlisted.email,
                    receiver_name: shareShortlisted.name
                };
                CampaignService.shareShortListedProducts(sendObj).then(function (result) {
                    if (result.status == 1) {
                        toastr.success(result.message);
                        $mdSidenav('shortlistSharingSidenav').close()
                    } else {
                        toastr.error(result.message);
                    }
                });
            };

            $scope.shareCampaign = function (ev, shareCampaign) {
                var campaignToEmail = {
                    campaign_id: $scope.campaignToShare.id,
                    email: shareCampaign.email,
                    receiver_name: shareCampaign.receiver_name,
                    campaign_type: $scope.campaignToShare.type
                };
                CampaignService.shareCampaignToEmail(campaignToEmail).then(function (result) {
                    if (result.status == 1) {
                        $mdSidenav('shareCampaign').close();
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
                    } else {
                        toastr.error(result.message);
                    }
                });
            }

            $scope.viewProduct = function (product) {
                $scope.product.image = config.serverUrl + product.image;
                $scope.product.siteNo = product.siteNo;
                $scope.product.panelSize = product.panelSize;
                $scope.product.type = product.type;
                $scope.product.demographicsage = product.demographicsage;
                $scope.product.address = product.address;               
                $scope.product.area_name = product.area_name;
                $scope.product.address = product.address;
                $scope.product.price = product.price;
                $scope.product.impressions = product.impressions;
                $scope.product.direction = product.direction;
                $scope.product.lighting = product.lighting;
                $scope.product.availableDates = product.availableDates;
                $scope.hideSelectedMarkerDetail = false;
                // if (product.type == "Bulletin") {
                //     $mdSidenav('productDetails').toggle();
                // } else if (product.type == "Digital Bulletin" || product.type == "Transit") {
                //     $mdSidenav('digitalProductDetails').toggle();
                // }
                $mdSidenav('productDetails').toggle();
                $scope.product.id = product.id;
            }

            $scope.deleteProductFromCampaign = function (productId, campaignId) {
                CampaignService.deleteProductFromUserCampaign(campaignId, productId).then(function (result) {
                    if (result.status == 1) {
                        toastr.success(result.message);
                        updateCampaignDetailSidenav(campaignId);
                    } else {
                        toastr.error(result.message);
                    }
                });
            }

            $scope.autoCompleteArea = function (query) {
                return LocationService.getAreasWithAutocomplete(query);
            }

            $scope.searchByTabId = function (query) {
                return MapService.searchBySiteNo(query);
            }
            $scope.selectedAreaChanged = function (area) {
                $scope.selectedArea = area;
                if (area) {
                    $scope.mapObj.setCenter({ lat: Number(area.lat), lng: Number(area.lng) });
                    var bounds = new google.maps.LatLngBounds();
                    bounds.extend({ lat: Number(area.lat), lng: Number(area.lng) });
                    $scope.mapObj.fitBounds(bounds);
                }
            }

            $scope.requestProposalForCampaign = function (campaignId, ev) {
                CampaignService.requestCampaignProposal(campaignId).then(function (result) {
                    if (result.status == 1) {
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
                        updateCampaignDetailSidenav(campaignId);
                    } else {
                        toastr.error(result.message);
                    }
                    $scope.loadActiveUserCampaigns()
                });
            }

            if ($rootScope.currStateName == 'index.campaign-details') {
                $scope.viewCampaignDetails(localStorage.activeUserCampaignId)
            }

            // sets the height of the div containing the map.
            function setMapContainerHeight() {
                var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight  //getting windows height
                if (windowHeight < 600) {
                    document.querySelector('#map-container').style['height'] = windowHeight - 100 + 'px';
                    // $('#map-container').css('height', height-100+'px');
                } else {
                    document.querySelector('#map-container').style['height'] = windowHeight - 64 + 'px';   //and setting height of map container
                }
                $scope.mapContainerHeightSet = true;
            }
            setMapContainerHeight();

            $scope.elipsis = "";
            var productLoader = function () {
                if (!$scope.filteredMarkers) {
                    setTimeout(productLoader, 500);
                }
                if ($scope.elipsis == "...") {
                    $scope.elipsis = "";
                }
                $scope.elipsis += ".";
            }
            productLoader();

            $scope.getProductDigitalUnavailableDates = function (productId, productSlots) {
                digitalSlots = productSlots;
                $scope.digitalSlots = [];
                MapService.getProductDigitalUnavailableDates(productId).then(function (blockedDatesAndSlots) {
                    $scope.unavailalbeDateRanges = blockedDatesAndSlots;
                    productDatesDigitalCalculator();
                })
            }




            $scope.getProductUnavailableDates = function (product, ev) {
                if(product.type == "Bulletin"){
                    MapService.getProductUnavailableDates(product.id).then(function (dateRanges) {
                        $scope.unavailalbeDateRanges = dateRanges;
                        $(ev.target).parents().eq(3).find('input').trigger('click') ;
                    });
                }else{
                    MapService.getProductDigitalUnavailableDates(product.id).then(function (blockedDatesAndSlots) {
                        $scope.unavailalbeDateRanges = [];
                        blockedDatesAndSlots.forEach((item)=>{
                            if(item.booked_slots >= $scope.product.slots){
                                $scope.unavailalbeDateRanges.push(item);
                            }
                        })
                        $(ev.target).parents().eq(3).find('input').trigger('click') ;
                    })
                }
                
            }

            $scope.getProductUnavailableDatesautoload = function (productId) {
                MapService.getProductUnavailableDates(productId).then(function (dateRanges) {
                    $scope.unavailalbeDateRanges = dateRanges;
                    $('#calender-autolaod-div').parents().eq(3).find('input').trigger('click');
                });
            }

            // Product-Controller               
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
            $scope.FormatData = function (selectedZone) {
                $scope.productmarkerslist = $scope.actualDataCopy.filter(function (item) {
                    return item.product_details[0].format_name === selectedZone;
                });
            };
            $scope.resetData = function () {
                $scope.productmarkerslist = $scope.actualDataCopy;
                $scope.siteNo = '';
                $scope.area_name = '';
            };
            $scope.getproddata = function (proddetails) {
                $scope.productListDetails = proddetails;
                // if (proddetails.type == "Bulletin") {
                //     $mdSidenav('productDetails').toggle();
                // } else if (proddetails.type == "Digital Bulletin" || proddetails.type == "Transit") {
                //     $mdSidenav('digitalProductDetails').toggle();
                // }

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
            // $scope.mapProductOpts = {
            //     multipleDateRanges: true,
            //     opens: 'center',
            //     locale: {
            //         applyClass: 'btn-green',
            //         applyLabel: "Book Now",
            //         fromLabel: "From",
            //         format: "DD-MMM-YY",
            //         toLabel: "To",
            //         cancelLabel: 'Cancel',
            //         customRangeLabel: 'Custom range'
            //     },
            //     isInvalidDate: function (dt) {
            //         for (var i = 0; i < $scope.unavailalbeDateRanges.length; i++) {
            //             if (moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)) {
            //                 return true;
            //             }
            //         }
            //         if (moment(dt) < moment()) {
            //             return true;
            //         }
            //     },
            //     isCustomDate: function (dt) {
            //         for (var i = 0; i < $scope.unavailalbeDateRanges.length; i++) {
            //             if (moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)) {
            //                 if (moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_from), 'day')) {
            //                     return ['red-blocked', 'left-radius'];
            //                 } else if (moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_to), 'day')) {
            //                     return ['red-blocked', 'right-radius'];
            //                 } else {
            //                     return 'red-blocked';
            //                 }
            //             }
            //         }
            //         if (moment(dt) < moment()) {
            //             return 'gray-blocked';
            //         }
            //     },
            //     eventHandlers: {
            //         'apply.daterangepicker': function (ev, picker) {
            //             //selectedDateRanges = [];
            //         }
            //     }
            // };
            /*====================================
            | Multi date range picker options end
            ====================================*/
            $scope.IsDisabled = true;
            $scope.EnableDisable = function () {
                $scope.IsDisabled = $scope.campaign.name.length == 0;
            }
            $scope.FilterProductlist = function (booked_from, booked_to) {
                MapService.filterProducts(booked_from, booked_to).then(function (result) {
                    productList = [];
                    locArr = [];
                    uniqueMarkers = [];
                    concentricMarkers = {};
                    var filterObj = { area: $scope.selectedAreas, product_type: $scope.selectedFormats, booked_from, booked_to };
                    $scope.plottingDone = false;
                    MapService.filterProducts(filterObj).then(function (markers) {
                        _.each(markersOnMap, function (v, i) {
                            v.setMap(null);
                            $scope.Clusterer.removeMarker(v);
                        });
                        markersOnMap = Object.assign([]);
                        $scope.productmarkerslist = markers;
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
            if ($auth.getPayload().userMongo.user_type == 'owner') {
                $scope.shortlistedOwnerHide = true;
            }
            //    $scope.checkAuthNav = function(){
            //         if($auth.getPayload().userMongo.user_type == 'basic'){
            //             $location.path('/shortlisted-products')
            //         } 
            //         else if($auth.getPayload().userMongo.user_type == 'owner'){
            //             $location.path('/owner/'+$rootScope.clientSlug+'/shortlisted-products')
            //         }
            //     }
            //    $scope.getProductUnavailableDates = function(productId, ev){
            //      MapService.getProductUnavailableDates(productId).then(function(dateRanges){
            //        $scope.unavailalbeDateRanges = dateRanges;
            //        $(ev.target).parents().eq(3).find('input').trigger('click');
            //      });
            //    }
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
            $scope.saveCampaignName = function (campaignName, productId, selectedDateRanges) {
                if($scope.totalnumDays < $scope.product.minimumbooking.split(' ')[0]){
                    toastr.error('minimum you have to select ' + $scope.product.minimumbooking)   
                    return false;                     
                }
                selectedDateRanges.forEach(function(item){
                    item.startDate = moment(item.startDate).format('YYYY-MM-DD');
                    item.endDate = moment(item.endDate).format('YYYY-MM-DD')
                })
                

                var paylaunchProduct = {
                            productId: productId,
                            name: campaignName,
                            dates: selectedDateRanges,
                            booking_slots : 1
                        };
                $scope.removeSelection();
                CampaignService.payAndLaunch(paylaunchProduct).then(function (res) {
                    if (res.status == 1) {     
                        $scope.campaign.name = null;   
                        $scope.toggleExistingCampaignSidenav();                
                        $scope.toggleProductDetailSidenav();
                        $window.location.href = '#/campaign-details/' + res.campaign_id;
                        toastr.success(res.message)                        
                    } else if (res.status == 0) {
                        toastr.error(res.message)
                    }                   
                })
            }
            $scope.numOfSlots = 0;
            $scope.saveDigitalCampaignName = function (campaignName, productId, selectedDateRanges, ) {
                if ($scope.numOfSlots > 0) {
                    var paylaunchProduct = {
                        productId: productId,
                        name: campaignName,
                        price: $scope.totalDigitalSlotAmount,
                        booking_slots: $scope.numOfSlots,
                        dates : []
                    };
                } else {
                    var paylaunchProduct = {
                        productId: productId,
                        name: campaignName,
                        price: $scope.totalSlotAmount,
                    };
                }
                var startAndEndDates = selectedDateRanges.filter((item) => item.selected)
                startAndEndDates.forEach((item,index)=>{
                    paylaunchProduct.dates.push({
                        startDate : moment(item.startDay).format('YYYY-MM-DD'),
                        endDate : moment(item.endDay).format('YYYY-MM-DD')
                    })

                })
                // if (startAndEndDates.length == 1) {
                //     paylaunchProduct.startDate = moment(startAndEndDates[0].startDay).format('YYYY-MM-DD')
                //     paylaunchProduct.endDate = moment(startAndEndDates[0].endDay).format('YYYY-MM-DD')
                // } else {
                //     startAndEndDates.forEach((item, index) => {
                //         if (index == 0) {
                //             paylaunchProduct.startDate = moment(item.startDay).format('YYYY-MM-DD')
                //         } else if (index == (startAndEndDates.length - 1)) {
                //             paylaunchProduct.endDate = moment(item.endDay).format('YYYY-MM-DD')
                //         }
                //     })
                // }
                CampaignService.payAndLaunch(paylaunchProduct).then(function (res) {
                    if (res.status == 1) {
                        $scope.campaign.name = null;
                        $scope.toggleExistingCampaignSidenav();
                        $scope.toggleProductDetailSidenav();                       
                        toastr.success(res.message)
                    } else if (res.status == 0) {
                        toastr.error(res.message)
                    }
                })
            }


            // Product-Controller Code - Ends

            
            $scope.$watch('ranges.selectedDateRanges',function(){
                $scope.totalPriceUserSelected = 0;
                $scope.totalnumDays = 0;
                  if ($scope.product.type == "Digital" || $scope.product.type == "Transit Digital") {
                    var productPerDay = $scope.product.price / 7;
                    for(item in $scope.ranges.selectedDateRanges){
                        var startDate = moment($scope.ranges.selectedDateRanges[item].startDate).format('YYYY-MM-DD')
                        var endDate = moment($scope.ranges.selectedDateRanges[item].endDate).format('YYYY-MM-DD')
                        var totalDays = moment(endDate).diff(startDate,'days') + 1
                        $scope.totalnumDays = $scope.totalnumDays + totalDays
                        $scope.totalPriceUserSelected =  productPerDay * $scope.totalnumDays;
                    }
                  }else{
                    var productPerDay = $scope.product.price / 28;
                    for(item in $scope.ranges.selectedDateRanges){
                        var startDate = moment($scope.ranges.selectedDateRanges[item].startDate).format('YYYY-MM-DD')
                        var endDate = moment($scope.ranges.selectedDateRanges[item].endDate).format('YYYY-MM-DD')
                        var totalDays = moment(endDate).diff(startDate,'days') + 1
                        $scope.totalnumDays = $scope.totalnumDays + totalDays
                        $scope.totalPriceUserSelected =  productPerDay * $scope.totalnumDays;
                    }
                  }
                  if($scope.product.minimumbooking != 'No' && $scope.totalnumDays < $scope.product.minimumbooking.split(" ")[0] && $scope.ranges.selectedDateRanges.length > 0){
                    $scope.ranges.selectedDateRanges =[];
                    toastr.error("please select minimum " + $scope.product.minimumbooking )
                      return false;
                  }
            })
            $scope.toggleProductDetailSidenav = function () {
                $scope.ranges.selectedDateRanges = [];
                $scope.totalPriceUserSelected = 0;
                $scope.totalnumDays = 0;
                $scope.removeSelection();
                $mdSidenav('productDetails').close();
            }
            // controller ends  

        }
    ]
);