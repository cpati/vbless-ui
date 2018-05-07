'use strict';

var myApp = angular.module('myApp', [ 'ngRoute', "OktaAuthClient", "WidgetConfig"]);

// myApp.run(['$rootScope', function($rootScope) {
// 	$rootScope.test="ABC";
//   //$rootScope.tenantId=100;
//
// 		  $rootScope.userInfo={
// 			"userName":"creator@vBless.onmicrosoft.com",
// 			"isAdmin":"true"
// 		};
//
//     }]);


// Global variable "widget"
myApp.value("widget", undefined);
//myApp.controller("LoginController", LoginController);

myApp.run(function(widgetManager, CONFIG,widget){

	// Initialize Widget from configuration file
	widget = widgetManager.initWidget( CONFIG.options );
});

// Directive to launch the widget
myApp.directive("myWidget",
	function($window, widgetManager) {
		return {
			restrict: "E",
			replace: true,
			link: function(scope, element, attr) {
				var button = element.children()[0];
				angular.element(button).on("click", function() {
					scope.$apply(function() { scope.widget = true });

					var widget = widgetManager.getWidget();

					widget.renderEl(
						{ el: element.children()[1] },
						function(tokens) {
							if (tokens.status === "SUCCESS" ) {
								$window.successfullogin=true;
								/*angular.forEach(tokens, function(token) {
									// Token response sent in two element array
									// based on request order ['idToken', 'token']
									
									if ("idToken" in token) {
										widget.tokenManager.add("idToken", token);
									}
									if ("accessToken" in token) {
										widget.tokenManager.add("accessToken", token);
									}
							    });*/
								// Hide widget
								scope.widget = false;
								$window.location.href = '/';
							}
						}
					);			
				});
				setTimeout(function(){
					angular.element(button).click();
				  },0);
			}
		}
});