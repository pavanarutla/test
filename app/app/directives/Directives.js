app.directive('onEnter', function() {
  return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
          if(event.which === 13) {
              scope.$apply(function(){
                  scope.$eval(attrs.onEnter, {'event': event});
              });
              event.preventDefault();
          }
      });
  };
});
app.directive('onlyNumeric', function () {
    return {
        require: 'ngModel',
        link: function (scope, ele, attr, ctrl) {
            ctrl.$parsers.push(function (viewValue) {
                if (viewValue) {
                    var transformedInput = viewValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== viewValue) {
                        ctrl.$setViewValue(transformedInput);
                        ctrl.$render();
                    }
                    return transformedInput;
                }
            })
        }
     }
})