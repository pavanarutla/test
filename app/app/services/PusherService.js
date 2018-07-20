app.service('PusherService', function(config, $pusher){
  // console.log(config);
  var instance = $pusher(new Pusher(config.pusherApiKey), {
    cluster: config.pusherCluster,
    encrypted: true
  });
  return instance;
});

