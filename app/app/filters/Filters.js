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
  return function(date, format){
    format = format || 'MM-DD-YYYY';
    if(date){
      return moment(date).local().format(format);
    }
    else{
      return "N/A";
    }
  }
});
app.filter('dateFormat',function(){
  var currentDate = moment(new Date()).local().format('MM-DD-YYYY')
  return function(date, format){
    if(currentDate == moment(date).format('MM-DD-YYYY')){
      return moment(date).local().format('LLLL').split(',')[2].split(' ')[2] + " " + moment(date).local().format('LLLL').split(',')[2].split(' ')[3];
    }else{
      return moment(date).local().format('llll').split(',')[1];
    }
  }
});
app.filter('dateFormatForSelected',function(){
  return function(date){
    //   return moment(date).local().format('LLLL').split(',')[2].split(' ')[2] + " " + moment(date).local().format('LLLL').split(',')[2].split(' ')[3];
    // }else{
      return moment(date).local().format('llll').split(',')[1];
    // }
  }
});
app.filter('jsonConvert',function(){
  return function(date){
    if(Object.prototype.toString.call(date) == "[object Array]"){
      var concatinatedDates = "";
      date.forEach(item => {
        concatinatedDates += moment(item.startDate).format('LLLL').split(',')[1] + " to " + moment(item.endDate).format('LLLL').split(',')[1]
      });
      return concatinatedDates
    }
    else{
      return "N/A";
    }
  }
});
app.filter('dateslots',function(){
  return function(date, format){
    // format = format || 'DD-MM-YYYY HH:mm:ss';
    if(date){
      return date.split(',')[1]
    }
    else{
      return "N/A";
    }
  }
});
app.filter('timeify',function(){
  return function(date, format){
    format = format || 'HH:mm a';
    if(date){
      return moment(date).local().format(format);
    }
    else{
      return "N/A";
    }
  }
});

app.filter('datetimeify',function(){
  return function(date, format){
    format = format || 'DD-MM-YYYY HH:mm:ss';
    if(date){
      return moment(date).local().format(format);
    }
    else{
      return "N/A";
    }
  }
});

app.filter('stringifyProductStatus',function(){
  return function(status) {
    switch (status) {
      case 100 : 
        returnStatus = 'proposed'
        break;
      case 200 : 
        returnStatus = 'scheduled'
        break;
      case 300 :
        returnStatus = 'running'
        break;

    }
    return returnStatus;
  }
})

app.filter('stringifyCampaignStatus', function(){
  return function(status){
    switch (status) {
      case 100:
        returnStatus = "Preparing";
        break;
      case 200:
        returnStatus = "Created";
        break;
      case 300:
        returnStatus = "Quote Requested";
        break;
      case 400:
        returnStatus = "Quote Given";
        break;
      case 500:
        returnStatus = "Change Requested";
        break;
      case 600:
        returnStatus = "Booking Requested";
        break;
      case 700:
        returnStatus = 'Booked';
        break;
      case 800:
        returnStatus = "Scheduled";
        break;
      case 1000:
        returnStatus = "Closed";
        break;
      case 1101:
        returnStatus = "Created";
        break;
      case 1121:
        returnStatus = "Awaiting Payment Confirmation";
        break;
      case 1131:
        returnStatus = "Payment Confirmed";
        break;
      case 1141:
        returnStatus = "Running";
        break;
      case 1151:
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
    var part2 = pkgName.split(' ').length > 1 ? pkgName.split(' ')[0].substring(0, 1) + pkgName.split(' ')[1].substring(0, 1) : pkgName.substring(0,1);
    return corName.match(/\b(\w)/g).join('') + "-" + part2;
  }
});

app.filter('MetroNamePrice', function(){
  return function(obj){
    return obj.name + " - " + obj.price;
  }
});
app.filter('metroCorridorsFromTo', function(){
  return function(obj){
    return obj.name + " (" + obj.from + " - " + obj.to + ")";
  }
});
app.filter('customSplitString', function() {
  return function(input) {
    var arr = input.split(',');
    return arr;
  };
});