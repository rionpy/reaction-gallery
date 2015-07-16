var galleryApp = angular.module("galleryApp", ["flow", "ngAnimate", "infinite-scroll"]);
var fileExtensions = ["png", "jpg", "jpeg", "gif"];

galleryApp.config(["flowFactoryProvider", function(flowFactoryProvider){
	flowFactoryProvider.defaults = {
		target: 'upload.php',
		permanentErrors: [500, 501],
		maxChunkRetries: 1,
		chunkRetryInterval: 5000,
		simultaneousUploads: 4,
		singleFile: false
	};
	flowFactoryProvider.on("fileAdded", function(file){
		if( fileExtensions.indexOf(file.getExtension()) == -1 ){
			alert("Only png, gif, jpg & jpeg allowed!");
			return false;
		}else if( (file.getExtension() == "gif" && file.size > 5242880) ){
			alert("Maximum size for gif is 5mb!");
			return false;
		}else if( (file.getExtension() != "gif" && file.size > 1600000) ){
			alert("Maximum size is 1.5mb!");
			return false;
		}
	});
}]);

galleryApp.directive("staticInclude", function($http, $templateCache, $compile) {
    return function(scope, element, attrs) {
        var templatePath = attrs.staticInclude;
        $http.get(templatePath, { cache: $templateCache }).success(function(response) {
            var contents = element.html(response).contents();
            $compile(contents)(scope);
        });
    };
});

galleryApp.directive("getWidth", function($rootScope){
	return{
		restrict: "A",
		link: function(scope, element, attrs){
			element.bind("load", function(){
				$rootScope[attrs.getWidth] = element[0].clientWidth;
				$rootScope.$digest();
			});
		}
	}
});

galleryApp.directive("setWidth", function($rootScope){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			attrs.$observe("setWidth", function(value){
				element.css("width", attrs.setWidth);
			});
		}
	}
});

galleryApp.directive("clearInput", function(){
	return {
		require: 'ngModel',
		restrict: "A",
		link: function(scope, element, attrs, ngModel){
			var btn = angular.element("<span class='clearInput glyphicon glyphicon-remove-circle'></span>");
			btn.css("visibility", "hidden");
			element.after(btn);
			
			btn.on('click', function(){
				scope.$apply(function(){
					ngModel.$setViewValue("");
					ngModel.$render();
				});
			});
			
			scope.$watch(attrs.ngModel, function(newVal, oldVal) {
				if(!oldVal && newVal) {
					btn.css("visibility", "visible");
				}else if(oldVal && !newVal){
					btn.css("visibility", "hidden");;
				}
			});
		}
	};
});

galleryApp.directive("spaceBetween", function(){
	return function (scope, element) {
		element.after("&nbsp;");
	}
});

galleryApp.filter("noTags", function(){
	return function(items, apply) {
		var filtered = [];
		angular.forEach(items, function(item) {
			if(!/[^\s]/.test(item.keywords)){
				filtered.push(item);
			}
		});
		return apply? filtered : items;
	};
});

galleryApp.filter("lazySearch", function(filterFilter) {
	return function(items, filterBy, limit){
		if(typeof filterBy === "undefined"){
			return items;
		}else if(filterBy.length >= limit){
			return filterFilter(items, filterBy);
		}else{
			return items;
		}
	}
});