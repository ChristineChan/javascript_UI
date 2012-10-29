(function($) {
	var CSlider = function(element, options){
		var slider = $(element);
		var settings = $.extend({}, $.fn.cSlider.defaults, options);
		var nailc=settings.nailImgClass;
		var emptyPhoto = {
	  		"id":"999",
	  		"picture":"img/999.jpg",
	  		"title":"decond picture"
  		};
		var allPhoto = [];///the src array from JSON
		var titleArray = [];////the title array from JSOM
		var key=0;
		var photoData;// = settings.photoData;
		var big = "text.json";
		// var small = "little.json"
		$.ajax({
			async: false,
			url: big,//"http://192.168.200.112/Eastbnb/house/2494",
			dataType: "json",
			success: function(data) {
			  photoData=data.data;
			},
			error:function(){
				alert("JSON Data sedding error");
			  	 }
		});
		
		var allPic = photoData.length;
		var column = settings.nailColm;
		
		for(var i=0;i<allPic;i++){
			photoData[i].id = i+1;
		}
		///to count which photo should be show
		appendIndex = [];
		var countMonoAray = function(index){
			appendIndex=[];
			var x = allPic-column;
			if(x<=0){
				$("#"+settings.nextBtnId).hide();
				$("#"+settings.prevBtnId).hide();
				for(var i=0;i<allPic;i++){
					appendIndex.push(i);
				}
				for(var i=allPic;i<column;i++){
					appendIndex.push(-1);
				}
			}else{
				if(index>x){
				for(var i=index;i<allPic;i++){
						appendIndex.push(i);
					}
					for(var i=0;i<(index-x);i++){
						appendIndex.push(i);
					}
				}
				else{
					for(var i=0;i<column;i++){
						appendIndex.push(index++);
					}			
				}
			}
			
		};
		/////to count how many line
		var nLine = Math.ceil(allPic/column);
		var nSpare = allPic%column;
		
		var countMultiAray = function(index){
			appendIndex=[];
			
			if(allPic<=column*settings.nailLine){
				for(i=0;i<allPic;i++){
					appendIndex.push(i);
				}
				for(i=allPic;i<column*settings.nailLine;i++){
					appendIndex.push(-1);
				}
			}else{
				for(i=0;i<allPic;i++){
					appendIndex.push(i);
				}
				for(i=allPic;i<column*nLine;i++){
					appendIndex.push(-1);
				}
			}
		};

		var loadImg = function(y){
			var times;
			if(settings.nailMulti){
				times = nLine;
				countMultiAray(y);
			}else{
				times = settings.nailLine;
				countMonoAray(y);	
			}
			for(x=0;x<times;x++){
				phtoArray = new Array;
				for(var i=0;i<column;i++){	
					var w=appendIndex[x*column+i];
					if(w==-1){
						phtoArray[i] = emptyPhoto;
					}else{
						phtoArray[i] = photoData[w];
					}									
				}
				//var template = Handlebars.compile($("#template_mono").html());
				//slider.next().append(template({phtoArray:phtoArray,thumbAll:settings.nailULClass}));	
				var temp="<ul class="+settings.nailULClass+">";
				for(var k in phtoArray){
					temp+='<li value='+phtoArray[k].id+' class="thumbLi"><img src='+phtoArray[k].picture+' ></li>'					
				}
				//slider.next().append(temp);			
				$("#thumbNial").append(temp);		
				slider.next().find("img").addClass(nailc);
				
				}
		};
		
		var definemask = function(){
			$("."+nailc).each(function () {
				if($(this).parent().attr("value")-1==key){
					$(this).addClass("highlight");
				}else{
					$(this).removeClass("highlight");
				}		
			});
		}		
		//first time to load all the nail box
		loadImg(0);	  
		
		slider.html('<img class="'+settings.mainImgClass+'" src="'+slider.next().find("img:first").attr("src").split(".")[0]+'_b.jpg" >');
		slider.next().next().next().text(photoData[key].title);
		
		if(settings.mask){
			definemask();
		}

			
		$("#"+settings.nextBtnId).click(function(){
			var index = $("."+settings.nailULClass).find("li:last").attr("value")-1;			
			if(index==key){
				$("."+settings.nailULClass).remove();
				key++
				if(key>=allPic){
					key=0;
				}
				if(index<column-1){
					index = index-column+2+allPic;
				}else if(index>=allPic){
					index=allPic-column+2;
				}else{
					index = index-column+2;
				}
				loadImg(index);						
			}else{
				key++;
				if(key>=allPic){
					key=0;
				}
			}
			slider.html('<img class="'+settings.mainImgClass+'" src="'+photoData[key].source+'" >');
			slider.next().next().next().text(photoData[key].title);
			definemask();
		});
			
		$("#"+settings.prevBtnId).click(function(){	
			var index = $("."+settings.nailULClass).find("li:first").attr("value")-1;
			if(index==key){
				key--;
				$("."+settings.nailULClass).remove();
				if(key<=0){
					key=allPic-1;
				}
				loadImg(key);
			}else{
				key--;
				if(key<=0){
					key=allPic-1;
				}
			}
			slider.html('<img class="'+settings.mainImgClass+'" src="'+photoData[key].source+'" >');
			slider.next().next().next().text(photoData[key].title);
			definemask();			
		});

		$("."+nailc).live('click',function(){	
			key = $(this).parent().attr("value")-1;
			if(key<allPic){
				var src = $(this).attr("src").split(".")[0]+"_b.jpg";
				slider.html('<img class="'+settings.mainImgClass+'" src="'+src+'" >');
				slider.next().next().next().text(photoData[key].title);
			}
		});
		if(settings.mask){
			$("."+nailc).live('hover',function(){
				if($(this).parent().attr("value")-1==key){
					definemask();
				}
				else{
					$(this).toggleClass("highlight");
				}
			});
		}	
		return this;      
	};

	$.fn.cSlider = function(options){		
		return  this.each(function(key, value) {
			var element = $(this);
            // Return early if this element already has a plugin instance
            if (element.data('cslider')) return element.data('cslider');
            // Pass options to plugin constructor
            var cslider = new CSlider(this, options);
            // Store plugin object in this element's data
            element.data('cslider', cslider);
    	});
	};
	$.fn.cSlider.defaults = {
		caption:true,
		mask:false,
		nailMulti:false,//to have multiple line of thumbnail
		nailLine:1,//how many line of the thumb nail
		nailColm:4,
		nailULClass:"thumbAll",
		nailImgClass:"thumbImg",
		mainImgClass:"bigImg",
		prevBtnId:"prev",
		nextBtnId:"next",
		//photoData:""
	};
})(jQuery);