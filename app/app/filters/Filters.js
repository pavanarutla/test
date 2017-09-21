app.filter('PickFirstLetter', function() {
  return function(input) {
    input = input || '';
    return input.substring(0,1);
  }
});
app.filter('mapGender', function () {
  var genderHash = {
    1: 'male',
    2: 'female'
  };
  return function (input) {
    if (!input) {
      return '';
    } else {
      return genderHash[input];
    }
  };
});

app.filter('mapStatus', function () {
  var genderHash = {
    1: 'Bachelor',
    2: 'Nubile',
    3: 'Married'
  };
  return function (input) {
    if (!input) {
      return '';
    } else {
      return genderHash[input];
    }
  };
});

app.filter('address', function () {
  return function (input) {
    return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
  };
});
