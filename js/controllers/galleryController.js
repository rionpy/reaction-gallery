galleryApp.controller("galleryController", ["$scope", "galleryService", "$http", function($scope, galleryService, $http){
	galleryService.success(function(data){
		if(data === "null") data = [];
		$scope.files = data;
	});
	$scope.displayActive = false;
	$scope.filesReverse = false;
	$scope.deleteFiles = false;
	$scope.selected = [];
	$scope.showUpload = false;
	$scope.noTags = false;
	$scope.imgFolder = "./pics/";
	$scope.thumbFolder = "./thumbs/";
	$scope.fileLimit = 0;
	
	$scope.paginate = function(){
		$scope.fileLimit += 10;
	}
	$scope.toggleUpload = function(){
		$scope.showUpload = !$scope.showUpload;
	}
	$scope.pushToFiles = function(file){
		$scope.files.push(JSON.parse(file));
	}
	$scope.toggleActive = function(){
		$scope.displayActive = !$scope.displayActive;
	};
	$scope.displayImg = function(obj){
		$scope.displayActive = true;
		$scope.displayedImg = obj;
		
		var link = document.createElement("a");
		link.href = $scope.imgFolder+$scope.displayedImg.id+"."+$scope.displayedImg.extension;
		$scope.copyUrl = link.protocol+"//"+link.host+link.pathname+link.search+link.hash;
	};
	$scope.stopProp = function($event){
		$event.stopPropagation();
	}
	$scope.getUrlclip = function(){
		return $scope.copyUrl;
	}
	$scope.getUrl = function () {
		window.prompt("Copy to clipboard: Ctrl+C, Enter", $scope.copyUrl);
	}
	$scope.toggleShowKeywords = function(file){
		if(file.showKeywords === "undefined"){
			file.showKeywords = true;
		}
		else{
			file.showKeywords = !file.showKeywords;
		}
	}
	$scope.saveKeywords = function(file, form){
		var post = {"setKeywords": true, "id": file.id, "keywords": file.editKeywords};
		$http({
				url: "galleryfunctions.php",
				method: "POST",
				data: serialize(post),
				headers: {"Content-Type": "application/x-www-form-urlencoded"}
			}).then(function(response){
				form.$setPristine();
				file.keywords = file.editKeywords;
				file.showKeywords = false;
			});
	}
	$scope.toggleDelete = function(){
		$scope.deleteFiles = !$scope.deleteFiles;
		$scope.selected = [];
	}
	$scope.confirmDelete = function(){
		if(!$scope.selected.length){
			alert("Nothing is selected!");
			return false;
		}
		
		if(confirm("Delete selected files?")) {
			var post = {"delete": true, "ids": [], "extensions": []};
			for(var key in $scope.selected){
				post.ids.push($scope.selected[key].id);
				post.extensions.push($scope.selected[key].extension);
			}
			
			$scope.selected = [];
			$http({
				url: "galleryfunctions.php",
				method: "POST",
				data: serialize(post),
				headers: {"Content-Type": "application/x-www-form-urlencoded"}
			}).then(function(response){
				for(var i = 0; i<post.ids.length; i++){
					for(var key in $scope.files){
						if(post.ids[i] == $scope.files[key].id){
							$scope.files.splice($scope.files.indexOf($scope.files[key]), 1);
						}
					}
				}
			});
			$scope.deleteFiles = false;
		}
	}
}]);

serialize = function(obj, prefix) {
  var str = [];
  for(var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
};