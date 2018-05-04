/* userProfileController Implementation Start */

myApp.controller('userProfileController',
		['$scope', '$http', 'httpPost', 'httpService','$location',
		function($scope, $http, httpPost, httpService, $location) {
	console.log("userProfileController");

	$scope.userid=$scope.userInfo.userName;


	//chida $http.get("/vBless/getCampaignUser/" + $scope.userid).then(
	httpService.get("/vBless/getCampaignUser/" + $scope.userid).then(
	function(response) {
		$scope.firstname = response.data.firstname;
		$scope.lastname = response.data.lastname;
		$scope.email = response.data.email;
		$scope.phone = response.data.phone;
		$scope.paymentinfo = response.data.paymentinfo;
	});

	$scope.doSave = function(){

	       var url = "/vBless/updateCampaignUser";

	       var data = new FormData();
	       data.append('userId',$scope.userid);
	       data.append('firstname',$scope.firstname);
	       data.append('lastname',$scope.lastname);
	       data.append('phone', $scope.phone);
	       data.append('email',$scope.email);
	       data.append('paymentinfo',$scope.paymentinfo);

	       var config = {
	    	   	transformRequest: angular.identity,
	    	   	transformResponse: angular.identity,
		   		headers : {
		   			'Content-Type': undefined
		   	    }
	       }

	       //chida $http.post(url, data, config).then(function (response) {
				 httpService.post(url, data, config).then(function (response) {
	    	   if(response.data != "FAIL")  {
	    		   $location.url("list");
	    	   }
			});
	    };

	$scope.doCancel = function(){
    		$location.url("list");
    }

}]);

/* homeController Implementation Start */
myApp.controller('homeController',
				['$scope', '$http', 'httpPost', 'httpService','operation','$location','$rootScope',
		function($scope, $http, httpPost, httpService, operation, $location, $rootScope) {
		console.log("homeController initialized");
	//	$rootScope.userId=null; /**This needs to be commented out**/
	//supreetha hardcoded tenant id and user id and isAdmin for now
	console.log("test:"+$rootScope.test);
	  $rootScope.isAdmin = "true";
	    //$rootScope.tenantId=100;
		$scope.userId=1;

	//$scope.userId=$scope.userInfo.userName;
	$scope.campaigns=[];

	var hostname = $location.host();
  var brandName="vBless";

	console.log("hostname " + hostname);
	if(hostname == "localhost")
		brandName = "vBless";
	else {
			var arr = hostname.split(".");
			if(arr.length == 3 ) {
					brandName = arr[0];
				}
		}


	httpService.get("/vBless/getTenantByBrandName/"+brandName).then(function(data){
		// $scope.tenants=data.data;
		$rootScope.tenants=data.data;
		$rootScope.tenantId=$scope.tenants.tenantId;
		console.log($rootScope.tenants + ":::::::" + $rootScope.tenantId);


		//$rootScope.userInfo.isAuthenticated=true; //chida
		//chida $http.get("/campaigns/").then(function(data){
		httpService.get("/"+$rootScope.tenantId+"/campaigns/").then(function(data){
			console.log("chida home campaigns");
			console.log(data);
			$scope.campaigns=data.data;
			$scope.campaignsFirst=$scope.campaigns[0];
			$scope.campaignsRest=$scope.campaigns.slice(1,$scope.campaigns.length);
		});
});

	$scope.heroCardCss=function(image){
		if (image !=null && image!=undefined) {
			var imgCss="background-image: url(data:image/png;base64,"+image+");"+
	   			   "height: 70%;background-position: center;background-repeat: no-repeat;background-size: cover;position: relative;";
		}
		return imgCss;
	}

}]);

//hard code end

/* campaignController Implementation Start */
myApp.controller('campaignController',function($scope, httpPost, httpService, operation, $location, $http,httpService, campaign,$routeParams,$rootScope) {
	console.log("campaignController initialized");


	//if a user landed here after signup, check for group and set admin property accordingly
	/*chida $rootScope.adminGroupId = "65ae1fea-6e30-4488-a8c9-b7b3cddbb779";
	var groups = $rootScope.userInfo.profile.groups;
	if(groups.includes($rootScope.adminGroupId)) {
		$rootScope.isAdmin = "true";
	}else {
		$rootScope.isAdmin = "false";
	}*/
	$rootScope.isAdmin = "true"; //true
	//$rootScope.tenantId =100;
	$scope.campaign={};
	console.log($routeParams.ID);
	if ($routeParams.ID != null && $routeParams.ID != undefined) {
		console.log("getting campaign")
		//chida $http.get("/campaigns/"+$routeParams.ID).then(function(data){
		httpService.get("/"+$rootScope+"/campaigns/"+$routeParams.ID).then(function(data){
			$scope.campaign=data.data;
			var createDate=new Date($scope.campaign.createDate);
			console.log('date---'+$scope.campaign.createDate);
			$scope.campaign.createDate=createDate;
			console.log(createDate);
		});
	}
	if(operation.getType()=="Add"){
			$scope.activeStatus=true;
			$scope.disableStatus=false;
			$scope.editMode=true;
	}

	$scope.saveFormData = function() {
			var config= {
		            transformRequest: angular.identity,
		            headers: {'Content-Type': 'application/json'}
		        };
			console.log("saveFormData");

//			$scope.campaign.userId=1; /********This needs to be changed*********/
//supreetha hardcoding for now. later to be taken from actual user details

    	$scope.campaign.userId=1;
		//$scope.userId=$scope.userInfo.userName;

			//chida $http.post('/campaigns/',JSON.stringify($scope.campaign),config).then(function(response) {
			httpService.post('/' + $rootScope.tenantId + '/campaigns/',JSON.stringify($scope.campaign),config).then(function(response) {
				if(response.data){
					fileUpload(response.data.campaignId);
					$location.path("/list");
				}
			});

			function fileUpload(campaignId){
				var fd = new FormData();
				fd.append('fileUpload', $scope.fileUpload);
				 //chida $http.post('/campaigns/uploadfile/'+campaignId, fd, {
				 httpService.post('/'+$rootScope.tenantId+'/campaigns/uploadfile/'+campaignId, fd, {
			            transformRequest: angular.identity,
			            headers: {'Content-Type': undefined}
			        })
			        .then(function(response){
			        		console.log("response fileUpload");
			        })
			}


	};

});


/* viewCampaignController Implementation Start */
myApp.controller('viewCampaignController', function($rootScope,$scope, $http,httpService, $routeParams,$location,$q) {
	console.log("viewCampaignController");
	//supreetha hardcoding for now. later to be taken from actual user details
	  $scope.userId=1;
	//$scope.userid=$scope.userInfo.userName;

  // $rootScope.userInfo.userName='creator@vBless.onmicrosoft.com';

	$scope.campaign = null;
	$scope.percentComplete=10;

	//chida $http.get("/campaigns/"+$routeParams.ID)
	httpService.get("/"+$rootScope.tenantId+"/campaigns/"+$routeParams.ID)
		 .then(function(data){
			$scope.campaign=data.data;
			console.log("campaign data1" + $scope.campaign);
			//chida $http.get("/vBless/getFundRaised/" + $routeParams.ID)
			$scope.fundRaised = 500;
			$scope.percentComplete = 10;
			httpService.get("/vBless/getFundRaised/" + $routeParams.ID)
			.then(
					function(response) {
						if(response.data != "") {
							$scope.fundRaised = response.data;
							console.log("fund raised1 " + $scope.fundRaised);
							$scope.percentComplete=($scope.fundRaised/$scope.campaign.goal) *100;
							console.log("percent complete " + $scope.percentComplete);
						}
					});

	});

	$scope.editPage=function(){
		$location.path("/createCampaign/"+$routeParams.ID);
	}

});

/* campaignListController Implementation Start */
myApp.controller('campaignListController', function($scope, httpPost,
		operation, $location, $http, httpService, $rootScope) {
	console.log("campaignListController initialized");
//	$rootScope.userId=1; /**This needs to be commented out**/

//supreetha hardcoding for now. later to be taken from actual user details
    	$scope.userId=1;
//	$scope.userId=$scope.userInfo.userName;
	$scope.updateFormData = function() {
		operation.setType('update');		//Mandatory
		operation.setId($scope.cid);		//Mandatory
		$location.path("/createCampaign");	//Mandatory
	};

	$scope.campaigns=[];
	//supreetha hardcoded tenant id and user id for now
	 // $rootScope.tenantId=100;
	//chida $http.get("/campaigns/").then(function(data){
	httpService.get("/"+$rootScope.tenantId+"/campaigns/").then(function(data){
		console.log("chida list campaigns");
		console.log(data);
		$scope.campaigns=data.data;
	});


	$scope.heroCardCss=function(image){
		var imgCss="background-image: url(data:image/png;base64,"+image+");"+
	   			   "height: 50%;background-position: center;background-repeat: no-repeat;background-size: cover;position: relative;";
		return imgCss;
	}
});

/* manageCampaignController Implementation Start */
myApp.controller('manageCampaignController', function($rootScope,$scope, $http,httpService, $routeParams,$location) {
	console.log("manageCampaignController");
	$scope.userId=$rootScope.userId;
	$scope.myVar=false;

	// hardcoding for now. Actually to get value from manageCampaigns page Suspend button.
	//$scope.campaignId=1;

	//chida $http.get("/campaigns/").then(function(data){
	httpService.get("/"+$rootScope.tenantId+"/campaigns/").then(function(data){
		$scope.campaigns=data.data;
		console.log($scope.campaigns);
	});

	$scope.radioClick=function(id){
		$scope.campaignId=id;
	};

	$scope.updateCampaign=function(){
		console.log("** In manage campaign Controller: " + $scope.myVar);

	       var url = "http://"+$location.$$host+':'+$location.$$port+"/campaigns/updateCampaignStatus";

	       var data = new FormData();
	       data.append('campaignId',$scope.campaignId);

	       var config = {
	    	   	transformRequest: angular.identity,
	    	   	transformResponse: angular.identity,
		   		headers : {
		   			'Content-Type': undefined
		   	    }
	       }

	       //chida $http.post(url, data, config).then(function (response) {
				 httpService.post(url, data, config).then(function (response) {
	    	   if(response.data != "FAIL")  {
	    		   $location.url("list");
	    	   }
			});

//		$location.path("/manageCampaigns/"+$routeParams.ID);
	}

	$scope.editPage=function(){
		$location.path("/manageCampaigns/"+$routeParams.ID);
	}

});

/* updateCampaignStatusController Implementation Start
myApp.controller('updateCampaignStatusController', function($rootScope,$scope, $http,$routeParams,$location) {
	console.log("updateCampaignStatusController");
	$scope.updateCampaign=function(){
		console.log("In update campaign Status: " + $scope.myVar);
//		$location.path("/manageCampaigns/"+$routeParams.ID);
	}
});*/




/* shareController Implementation Start */
myApp.controller('shareController', function($scope, $http, $location) {
	console.log("shareController");
	var id = 10;
	$scope.title = "lets hardcode title, will fetch from campaign later, For details visit";
	$scope.shareurl="http://"+$location.$$host+':'+$location.$$port+"/vBless";
//	$scope.shareurl="http://"+$location.$$host+':'+$location.$$port+"/vBless/campaignDetails/" +id;

});

/* logoutController Implementation Start */
myApp.controller('logoutController',
	['$scope', '$http', 'httpPost', '$location',
	function($scope, $http, httpPost, $location) {
	console.log("logoutController");
	$scope.logout = function(){

	}
}]);

//manageTenantsController
myApp.controller('manageTenantsController', function($rootScope,$scope, $http,httpService, $routeParams,$location) {
	console.log("manageTenantsController");
	$scope.userId=$rootScope.userId;
	$scope.myVar=false;

	httpService.get("/vBless/getTenants").then(function(data){
		$scope.tenants=data.data;
		console.log($scope.tenants);
	});

});


//createTenantController
myApp.controller('createTenantController', function($rootScope,$scope, $http,httpService, $routeParams,$location) {
	console.log("createTenantController");

	$scope.doSave = function() {
			var config= {
								transformRequest: angular.identity,
								headers: {'Content-Type': 'application/json'}
						};
			console.log("saveFormData");

			httpService.post('/vBless/createTenant/',JSON.stringify($scope.tenant),config).then(function(response) {
				if(response.data){
					$location.path("/manageTenant");
				}
			});
		}


		$scope.doCancel = function() {
				$location.path("/manageTenant");
		}
});
