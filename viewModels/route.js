myApp.config(['$routeProvider', '$qProvider', '$locationProvider', '$httpProvider',

		function($routeProvider, $qProvider, $locationProvider, $httpProvider) {

	$locationProvider.hashPrefix('');

	$routeProvider.when("/", {
		templateUrl : "views/home.html",
		controller : "homeController"
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
	}).when("/about", {
		templateUrl : "views/about.html"
			//added this for create campaign UI and java backend
	}).when("/createCampaign", {
		templateUrl : "views/createCampaign.html",
		controller : "campaignController"
	}).when("/createCampaign/:ID", {
		templateUrl : "views/createCampaign.html",
		controller : "campaignController"
	}).when("/manageCampaigns", {
		templateUrl : "views/manageCampaigns.html",
		controller : "manageCampaignController",
	}).when("/createTenant", {
		templateUrl : "views/createTenant.html",
		controller : "createTenantController",
	}).when("/manageTenant", {
		templateUrl : "views/manageTenants.html",
		controller : "manageTenantsController",
	}).when("/login", {
		templateUrl : "views/login.html",
		controller : "LoginController"
	})
	.when("/access/:ID", {
		templateUrl : "views/access.html",
		controller : "accessController"
	})
	.otherwise({redirectTo: "/"});;

	$qProvider.errorOnUnhandledRejections(false);

}]);
