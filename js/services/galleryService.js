galleryApp.service("galleryService", ["$http", function($http){
	return $http.get("filedata.php")
    .success(function(data){
    	return data;
  	})
    .error(function(err){
    	return err;
  	});
}]);