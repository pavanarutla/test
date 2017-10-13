app.controller('FormatsCtrl', function ($scope) {

  $scope.showBillboardsData = true;
  $scope.showUnipoleData = false;
  $scope.showdigitalData = false;
  $scope.showretailData = false;
  $scope.showtransitData = false;
  $scope.showairportData = false;
  $scope.showbusData = false;
  $scope.showrailData = false; 


  $scope.showBillboards = function(){
    $scope.showBillboardsData = true;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }

  $scope.unipole = function() {   
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = true;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }

  $scope.showdigital = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = true;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }
  $scope.showretail = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = true;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }

  $scope.showtransit = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = true;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }

  $scope.showairport = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = true;
    $scope.showbusData = false;
    $scope.showrailData = false;
  }
  $scope.showbus = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = true;
    $scope.showrailData = false;
  }

  $scope.showrail = function(){
    $scope.showBillboardsData = false;
    $scope.showUnipoleData = false;
    $scope.showdigitalData = false;
    $scope.showretailData = false;
    $scope.showtransitData = false;
    $scope.showairportData = false;
    $scope.showbusData = false;
    $scope.showrailData = true;
  }

  //slider
  $scope.slickConfig2Loaded = true;
  $scope.slickConfig2 = {
    autoplay: false,
    infinite: true,
    autoplaySpeed: 5000,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        infinite: true
      }
    }, {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        infinite: true
      }
    }, {
      breakpoint: 320,
      settings: {
        slidesToShow: 1,
        infinite: true
      }
    }],
    method: {}
  };
 //$scope.unipole = true;

//hammer js


      //   $scope.eventType = "No events yet";
      //   $scope.onHammer = function onHammer (event) {
      //   $scope.eventType = event.type;
      //     console.log(event.type);
      // };

 function Carousel(element)
{
  var self = this;
  element = $(element);

  var container = $(">ul", element);
  var panes = $(">ul>li", element);

  var pane_width = 0;
  var pane_count = panes.length;

  var current_pane = 0;

  /**
         * initial
         */

  this.init = function() {
    setPaneDimensions();
    var c = this;
    $(window).on("load resize orientationchange", function() {
      setPaneDimensions();
      c.showPane(current_pane);
      //updateOffset();
    })
  };

  /**
         * set the pane dimensions and scale the container
         */
  function setPaneDimensions() {
    pane_width = element.width();
    panes.each(function() {
      $(this).width(pane_width * .4);
    });
    container.width(pane_width*pane_count);
  };

  /**
    * show pane by index
    */
  this.showPane = function(index, animate) {
    // between the bounds
    index = Math.max(0, Math.min(index, pane_count-1));
    current_pane = index;

    var offset = -((100/pane_count)*current_pane) * .4;
    setContainerOffset(offset, animate);
  };

  function setContainerOffset(percent, animate) {
    container.removeClass("animate");

    if(animate) {
      container.addClass("animate");
    }

    if(Modernizr.csstransforms3d) {
      container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
    }
    else if(Modernizr.csstransforms) {
      container.css("transform", "translate("+ percent +"%,0)");
    }
    else {
      var px = ((pane_width*pane_count) / 100) * percent;
      container.css("left", px+"px");
    }
  }

  this.next = function(multiplier) { 
    var go = multiplier || 1;
    return this.showPane(current_pane+go, true); 
  };
  this.prev = function(multiplier) { 
    var go = multiplier || 1;
    return this.showPane(current_pane-go, true);
  };

  function handleHammer(ev) {
    // disable browser scrolling
    ev.gesture.preventDefault();

    switch(ev.type) {
      case 'dragright':
      case 'dragleft':
        
        /*console.log('drag', ev.gesture.velocityX);*/
        // stick to the finger
        var pane_offset = -(100/pane_count)*current_pane * .4;
        var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

        // slow down at the first and last pane
        if((current_pane == 0 && ev.gesture.direction == "right") ||
           (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
          drag_offset *= .4;
        }

        setContainerOffset(drag_offset + pane_offset);
        break;

      case 'swipeleft':
        self.next(Math.floor(ev.gesture.velocityX));
        ev.gesture.stopDetect();
        break;

      case 'swiperight':
        /*console.log('swiperight');*/
        self.prev(Math.floor(ev.gesture.velocityX));
        ev.gesture.stopDetect();
        break;

      case 'release':
        console.log('release')
        // more then 50% moved, navigate
        if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
          if(ev.gesture.direction == 'right') {
            self.prev();
          } else {
            self.next();
          }
        }
        else {
          self.showPane(current_pane, true);
        }
        break;
    }
  }

  new Hammer(element[0], { dragLockToAxis: true }).on("release dragleft dragright swipeleft swiperight", handleHammer);
}

var carousel = new Carousel("#carousel");
carousel.init();
carousel.showPane(1);
  
});
