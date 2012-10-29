(function($) {
	var CSlider = function(element, options){
		var slider = $(element);
		var settings = $.extend({}, $.fn.cSlider.defaults, options);
		var nailc=settings.nailImgClass;
		var emptyPhoto = {
	  		"id":"999",
	  		"src":"img/999.jpg",
	  		"des":"decond picture"
  		};
		var allPhoto = [];///the src array from JSON
		var titleArray = [];////the title array from JSOM

		$.ajaxSetup({ async:false });
		$.getJSON('test.json', function(data) {	
		  $.each(data, function(srcImg, title) {
		    allPhoto.push( srcImg );
		    titleArray.push( title ); 
		  	});
		});
		var photoData ;
		$.getJSON('text.json', function(data) {				
			photoData=data;
		});	
		var allPic = photoData.data.length;
		var column = settings.nailColm;
		///to count which photo should be show
		appendIndex = [];
		var countMonoAray = function(index){
			appendIndex=[];
			var x = allPic-column;

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
		};
		/////to count how many line
		var nLine = Math.ceil(allPic/column);
		var nSpare = allPic%column;
		var clkTimes = nLine-settings.nailLine;
		var LclkTimes=-1;
		
		var countMultiAray = function(index){
			for(var i=0;i<column*settings.nailLine;i++){
				appendIndex.push(i);
			}
		};

		var loadImg = function(y){
			for(x=0;x<settings.nailLine;x++){
				phtoArray = Object;
				phtoArray.data = new Array;
				for(var i=0;i<column;i++){
					if(settings.nailMulti){
						countMultiAray(y);
					}else{
						countMonoAray(y);				
					}					
					var w=appendIndex[x*column+i];
					phtoArray.data[i] = photoData.data[w];									
				}
				var template = Handlebars.compile($("#template_mono").html());
				slider.next().append(template({phtoArray:phtoArray,thumbAll:settings.nailULClass}));			
				slider.next().find("img").addClass(nailc);
				}
		};
		temp = Object;
		temp.data = new Array;
		var fillBox = function(y){
			temp.data = [];
			if(y>=(nLine-1)*column){
				for(i=0;i<nSpare;i++){
					temp.data[i]= photoData.data[y+i];
				}
				for(i=nSpare;i<column;i++){
					temp.data[i] = emptyPhoto;
				}				
			}else{
				for(i=0;i<column;i++){
					temp.data[i] = photoData.data[y+i];
				}
			}
		};			
		//first time to load all the nail box
		loadImg(0);	
		slider.html('<img class="'+settings.mainImgClass+'" src="'+slider.next().find("img:first").attr("src")+'" >');
				
		$("#"+settings.leftSlide).hide();
		$("#"+settings.rightSlide).click(function(){
			$("#"+settings.leftSlide).show();
			var index = slider.next().find("ul:last").find("li:first").attr("value")-1;
			if(index>=(nLine-2)*column){
				$(this).hide();
				fillBox(index+column);
				slider.next().find("ul:first").remove();
				var template = Handlebars.compile($("#template_mono").html());
				slider.next().append(template({phtoArray:temp,thumbAll:settings.nailULClass}));			
				slider.next().find("img").addClass(nailc);			
			}else{
				fillBox(index+column);
				slider.next().find("ul:first").remove();
				fillBox(index+column);
				var template = Handlebars.compile($("#template_mono").html());
				slider.next().append(template({phtoArray:temp,thumbAll:settings.nailULClass}));			
				slider.next().find("img").addClass(nailc);			
			}			
		});
				
		$("#"+settings.leftSlide).click(function(){	
			$("#"+settings.rightSlide).show();
			var index = slider.next().find("ul:first").find("li:first").attr("value")-1;
			console.log(index);
			if(index<=column){
				$(this).hide();
				fillBox(index-column);
				slider.next().find("ul:last").remove();
				var template = Handlebars.compile($("#template_mono").html());
				slider.next().find("ul:first").before(template({phtoArray:temp,thumbAll:settings.nailULClass}));			
				slider.next().find("img").addClass(nailc);			
			}else{
				fillBox(index-column);
				slider.next().find("ul:last").remove();
				fillBox(index-column);
				var template = Handlebars.compile($("#template_mono").html());
				slider.next().find("ul:first").before(template({phtoArray:temp,thumbAll:settings.nailULClass}));			
				slider.next().find("img").addClass(nailc);			
			}
		});
			
		$("#"+settings.nextBtnId).click(function(){
			var index = $("."+settings.nailULClass).find("li:first").attr("value")-1;			
			index++;
			$("."+settings.nailULClass).remove();
			if(index>=allPic){
				index=0;
			}
			loadImg(index);
		});
			
		$("#"+settings.prevBtnId).click(function(){	
			var index = $("."+settings.nailULClass).find("li:first").attr("value")-1;			
			index--;
			$("."+settings.nailULClass).remove();
			if(index<=0){
				index=allPic-1;
			}
			loadImg(index);
		});
		

		$("."+nailc).live('click',function(){	
			if($(this).attr("data-type")==0){
	    		$("."+nailc).not($(this)).attr("data-type",0).removeClass("activate").css("opacity",0.5);
	    		$(this).attr("data-type",1).addClass("activate");
	    	}  		
			slider.html('<img class="'+settings.mainImgClass+'" src="'+$(this).attr("src")+'" >');
		});
		$("."+nailc).hover(
			function(){
				if($(this).attr("data-type")!=1){ 
					$(this).css("opacity",1);
				}
			},
			function(){
				if($(this).attr("data-type")!=1){ 
				   $(this).css("opacity",0.5);
				}
			}
		);
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
		nailMulti:false,//to have multiple line of thumbnail
		nailLine:1,//how many line of the thumb nail
		nailColm:4,
		nailULClass:"thumbAll",
		nailImgClass:"thumbImg",
		mainImgClass:"bigImg",
		prevBtnId:"prev",
		nextBtnId:"next",
		rightSlide:"right",
		leftSlide:"left", 		
	};
})(jQuery);