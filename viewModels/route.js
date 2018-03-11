myApp.config(['$routeProvider', '$qProvider', '$locationProvider', '$httpProvider',
			  'adalAuthenticationServiceProvider',
		function($routeProvider, $qProvider, $locationProvider, $httpProvider, adalProvider) {
	
	$locationProvider.hashPrefix('');
	
	$routeProvider.when("/", {
		templateUrl : "views/home.html",
		controller : "homeController"
		,requireADLogin: false	
	}).when("/list", {
		templateUrl : "views/campaignList.html",
		controller : "campaignListController"
	}).when("/userProfile", {
		templateUrl : "views/userProfile.html",
		controller : "userProfileController"
	}).when("/share", {
		templateUrl : "views/share.html",
		controller : "shareController"			
	}).when("/viewCampaign/:ID", {
		templateUrl : "views/viewCampaign.html",
		controller : "viewCampaignController"
		//,requireADLogin: false			
	}).when("/about", {
		templateUrl : "views/about.html"
			//added this for create campaign UI and java backend
	}).when("/createCampaign", {
		templateUrl : "views/createCampaign.html",
		controller : "campaignController"
		,requireADLogin: true			
	}).when("/createCampaign/:ID", {
		templateUrl : "views/createCampaign.html",
		controller : "campaignController"
	}).when("/manageCampaigns", {
		templateUrl : "views/manageCampaigns.html",
		controller : "manageCampaignController"
	});
	
	$qProvider.errorOnUnhandledRejections(false);
	
	
	adalProvider.init(
			  {
			      instance: 'https://login.microsoftonline.com/',
			      tenant: 'vblessatcloud.onmicrosoft.com',
			      clientId: '80c0d24d-b6c1-4cda-92a9-e7bd9d4f5ed9',
			      extraQueryParameter: 'nux=1',
			      anonymousEndpoints: [ '/campaigns' , '/vBless', 'views/header.html','views/footer.html']
//			      cacheLocation: 'localStorage',
//			      redirectUri: window.location.origin + '/id_token',
//			      postLogoutRedirectUri: window.location.origin + '/'
			      //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
			  },
			  $httpProvider
	);
	
}]);