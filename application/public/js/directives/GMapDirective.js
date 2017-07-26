app.directive('gmap', ['GMapSrvc', function(GMapSrvc){
    return{
			restrict: 'EA',
			template: '<div></div>',
			link: function(scope, elem, attrs){
				if('style' in attrs){
					// fetch the height from styles to apply it to internal div
					scope.height = /height\s*:\s*([A-Za-z0-9%\.]*);?/gi.exec(attrs.style);
					scope.width = /width\s*:\s*([A-Za-z0-9%\.]*);?/gi.exec(attrs.style);
					if(scope.height === undefined || scope.height === null){
						scope.gmapError = "height not defined properly";
						console.error(scope.gmapError);
					}
					else{
						elem.css({
							'height': scope.height[1],
						});
						elem.find('> div').css({
							'height': scope.height[1],
						});
					}
				}
				else{
					// height is not defined in html. set the default values.
					elem.css({
						'height':'400px',
						'width': '100%'
					});
					elem.find('> div').css({
						'height':'400px',
					});
				}
				GMapSrvc.create(elem.find('> div')[0]);
			}
    }
}]);