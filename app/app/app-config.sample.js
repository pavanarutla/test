var env = 2;
var config = {};
if(env == 0){
  // production environment
  config.serverUrl = "http://132.148.147.218";
  config.apiPath = "http://132.148.147.218/api";
  config.pusherApiKey = "e47e6f2d30bf3fe9f6c7";
  config.pusherCluster = "ap2";
  config.mobileUrl = "http://billboardsindia.com/mobile";
}
else if(env == 1){
  // testing environment
  config.serverUrl = "http://104.236.11.252";
  config.apiPath = "http://104.236.11.252/api";
  config.pusherApiKey = "e47e6f2d30bf3fe9f6c7";
  config.pusherCluster = "ap2";
  config.mobileUrl = "http://104.236.11.252:8081";
}
else{
  // local environment
  config.serverUrl = "http://localhost:8001";
  config.apiPath = "http://localhost:8001/api";
  config.pusherApiKey = "e47e6f2d30bf3fe9f6c7";
  config.pusherCluster = "ap2";
  config.mobileUrl = "http://localhost:8080";
}
app.constant('config', {
  serverUrl : config.serverUrl,
  apiPath : config.apiPath,
  pusherApiKey: config.pusherApiKey,
  pusherCluster: config.pusherCluster
})