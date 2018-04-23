'use strict';

var myApp = angular.module('myApp', [ 'ngRoute']);

myApp.run(['$rootScope', function($rootScope) {
	$rootScope.test="ABC";
  $rootScope.tenantId=100;

		  $rootScope.userInfo={
			"userName":"creator@vBless.onmicrosoft.com",
			"isAdmin":"true"
		};

    }]);
