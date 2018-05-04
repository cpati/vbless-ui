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
myApp.controller("LoginController", LoginController);

myApp.run(function(widget, widgetManager, CONFIG){

	// Initialize Widget from configuration file
	// console.dir(widgetManager.initWidget( CONFIG.options ));
	// debugger;
	widget = widgetManager.initWidget( CONFIG.options );

});

// Directive to launch the widget
myApp.directive("myWidget",
	function($window, widgetManager, $location, $timeout) {
		return {
			restrict: "E",
			replace: true,
			link: function(scope, element, attr) {
				var button = element.children()[0];
				angular.element(button).on("click", function() {
					scope.$apply(function() {
						scope.widget = true;
					});

					var widget = widgetManager.getWidget();

					widget.renderEl(
					    { el: element.children()[1] },

						function(transaction) {
							if(transaction.status === "SUCCESS") {
								// Success
								console.log(transaction);
								$window.localStorage["auth"] = angular.toJson({
									"session" : transaction.session,
									"user" : transaction.user
								});
								scope.widget = false;

								// Set session with Okta
								transaction.session.setCookieAndRedirect(
									$location.protocol() + "://" + location.host + "/#");
							}
						}
					)
				});
			}
		}
});

// Renders login view if session does not exist
LoginController.$inject = ["$window", "$location", "$scope", "widgetManager"];
function LoginController($window, $location, $scope, widgetManager) {
	var widget = widgetManager.getWidget();

	widget.session.exists(function(exists) {
		if(exists) {
			widget.signOut();
			$window.localStorage.clear();
			$scope = $scope.$new(true);
		}
	});
}
