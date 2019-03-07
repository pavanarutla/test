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
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
app.directive('onlyLettersInput', onlyLettersInput);
  
function onlyLettersInput() {
    return {
      require: 'ngModel',
      link: function(scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
          var transformedInput = text.replace(/[^a-zA-Z]/g, '');
          //console.log(transformedInput);
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  };