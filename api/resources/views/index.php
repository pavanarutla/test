<!doctype html>
<html lang="en" ng-app="BBIndia">
  <head>
    <meta charset="utf-8">
    <title>BillBoards India</title>
    <link rel="stylesheet" href="js/vendor/bootstrap/dist/css/bootstrap.css" />
    <link rel="stylesheet" href="css/app.css" />
    <link rel="stylesheet" href="css/app.animations.css" />
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFfRY9PTrneWe2_MFS8UWFaiahbocDi5A&libraries=places"></script>
    <script src="js/vendor/jquery/dist/jquery.js"></script>
    <script src="js/vendor/angular/angular.js"></script>
    <script src="js/vendor/angular-animate/angular-animate.js"></script>
    <script src="js/vendor/angular-resource/angular-resource.js"></script>
    <script src="js/vendor/angular-route/angular-route.js"></script>
    <script src="js/app.module.js"></script>
    <script src="js/app.config.js"></script>
    <script src="js/controllers/gmapcontroller.js"></script>
    <script src="js/services/gmapservice.js"></script>
    <script src="js/directives/gmapdirective.js"></script>
    <script src="js/services/gmarkerservice.js"></script>
    <script src="js/app.animations.js"></script>
  </head>
  <body>

    <div class="view-container">
      <div ng-view class="view-frame"></div>
    </div>

  </body>
</html>
