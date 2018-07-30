app.filter('PickFirstLetter', function() {
  return function(input) {
    input = input || '';
    return input.substring(0,1);
  }
});
app.filter('PickFirst2Letters', function(){
  return function(input) {
    input = input || '';
    return input.substring(0,2).toUpperCase();
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

app.filter('dateify',function(){
  return function(date){
    if(date){
      return moment(date).local().format('DD-MM-YYYY');
    }
    else{
      return "N/A";
    }
  }
});

app.filter('stringifyCampaignStatus', function(){
  return function(status){
    switch (status) {
      case 0:
        returnStatus = "Preparing";
        break;
      case 1:
        returnStatus = "Prepared";
        break;
      case 2:
        returnStatus = "Quote Requested";
        break;
      case 3:
        returnStatus = "Quote Provided";
        break;
      case 4:
        returnStatus = "Quote Change Requested";
        break;
      case 5:
        returnStatus = "Launch Requested";
        break;
      case 6:
        returnStatus = "Running";
        break;
      case 7:
        returnStatus = "Suspended";
        break;
      case 8:
        returnStatus = "Closed";
        break;
      default:
        return status = "Unknown";
        break;
    }
    return returnStatus;
  }
});

app.filter('boolToYesNo', function(){
  return function(n){
    if(n){
      return "Yes";
    }
    else{
      return "No";
    }
  }
});

app.filter('MetroSlIcon', function(){
  return function(input) {
    input = input || '';
    var corName = input.split(' - ')[0];
    var pkgName = input.split(' - ')[1];
    return corName.match(/\b(\w)/g).join('') + "-" + pkgName.split(' ')[0] + pkgName.split(' ')[1].substring(0, 1);
  }
});