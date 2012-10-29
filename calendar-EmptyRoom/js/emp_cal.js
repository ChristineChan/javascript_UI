//to fill in the empty room data
function fillRoomData(startDate){
	var nowTime = new Date();
	var TheTime = new Date(nowTime.getFullYear(),nowTime.getMonth(),nowTime.getDate());
}

//to get the Json Data
function getJsonData(startDate,endDate){
	var startString = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate();
	var endString = endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+(endDate.getDate()+1);
	var test = "test.json"
	$.ajax({
		async: false,
		url: test,
		dataType: "json",
		success: function(data) {
		  Content.Json=data;
		},
		error:function(){
			alert("JSON Data sedding error");
		  	 }
	});
}

//to caculate how many days in the month
function getDaysInMonth(year,month){
   var current = new Date(year,month,0);
   return (current.getDate())
}
//to create an 6x6 array that can fill the calendar 
function createCal(year,month){
	//create the 7x7 array
	var wholeMonth = Array(6);
	for(var i=0; i<6; i++){
		wholeMonth[i] = new Array(7);
	}
	//get previous month'd date
	var preDate = getDaysInMonth(year,month-1);
	//put days into array
	var thisMonth = new Date(year,(month-1),1);
	var w;
	var thisDay = 1;
	
	var startDate;
	var endDate;
	
	for(d=thisMonth.getDay()-1;d>=0;d--){
		wholeMonth[0][d] = preDate;
		preDate--;
	}

	for (d=thisMonth.getDay();d<7;d++){
		wholeMonth[0][d] = thisDay;
		thisDay++;
	}
	var nextDay=1;
	for(w=1; w<6;w++){
		for(d=0;d<7;d++){
			if(thisDay<= getDaysInMonth(year,month)){
				wholeMonth[w][d] = thisDay;
				thisDay++;
			}else{
				wholeMonth[w][d] = nextDay;
				nextDay++;
			}
		}
	}	
	///count the calendar interval
	if(thisMonth.getDay()<1){
		startDate = new Date(year,month-1,1);	
	}else{
		preDate++
		startDate = new Date(year,month-2,preDate);
	}
	endDate = new Date(year,month,--nextDay);
	Content.startDate = startDate;
	Content.endDate = endDate;
	Content.wholeMonth = wholeMonth;
	var test = getJsonData(startDate,endDate);
	return Content;
}
	
function drawCal(Content){
	var template = Handlebars.compile($("#template").html());
	for(i=0;i<6;i++){
		$(".table").append(template({d:Content.wholeMonth[i]}))
	}
}

function showCal(year,month,plus){	
	var monthArray = new Array("January","February","March","April","May","June","July","August","Septemper","October","November","December");
	var Sdate = new Date(year,month+plus);
	var Syear = Sdate.getFullYear();
	var Smonth = monthArray[Sdate.getMonth()];
	Content=createCal(Syear,Sdate.getMonth()+1);
	$(".month").text(Smonth+" "+Syear);
	drawCal(Content);
}
function roomTypeAray(){
	nLength = Content.Json.length;
	nLine = Math.ceil(nLength/nColumn);
	nSpare = nLength%nColumn;
	roomType.length = nLine*nColumn;
	for(i=0;i<nLength;i++){
		roomType[i] = new Object;
		roomType[i].name =  Content.Json[i].name; 
		roomType[i].check = 0 ;
		roomType[i].src = Content.Json[i].photo.source;
	}
	for(i=nLength;i<roomType.length;i++){
		roomType[i] = new Object;
		roomType[i].src = "img/space.png";
	}

	var key = roomType.length-nColumn;
	//show first 9 image
	if(nLine<=1){
		$("#left").hide();
		$("#right").hide();	
		for(x=1;x<4;x++){
			key = 0;
			for(i=0;i<nColumn;i++){		
				if(roomType[key].hasOwnProperty("name")){
					$('.wrap:nth-child('+x+')').find($(".type-box")).eq(i).html('<img value="'+key+'" src="'+roomType[key].src+'"><p class="roomTypeCaption">'+roomType[key].name+'</p>');
				}
				else{
					$('.wrap:nth-child('+x+')').find($(".type-box")).eq(i).html('<img value="'+key+'" src="'+roomType[key].src+'"/>');
				}
				key++;
			}
		}
	}else{
		for(x=1;x<4;x++){
			for(i=0;i<nColumn;i++){
				if(key>=roomType.length){
					key=0;
				}
				if(roomType[key].hasOwnProperty("name")){
					$('.wrap:nth-child('+x+')').find($(".type-box")).eq(i).html('<img value="'+key+'" src="'+roomType[key].src+'"><p class="roomTypeCaption">'+roomType[key].name+'</p>');
				}
				else{
					$('.wrap:nth-child('+x+')').find($(".type-box")).eq(i).html('<img value="'+key+'" src="'+roomType[key].src+'"/>');
				}
				key++;
			}
		}
	}
	definelight();
}
function appendContent(key){
	var apndCon=" ";
	for(i=0;i<nColumn;i++){
		if(roomType[key].hasOwnProperty("name")){
			apndCon+='<div class="type-box"><img value="'+key+'" src="'+roomType[key].src+'"><p class="roomTypeCaption">'+roomType[key].name+'</p></div>';
		}
		else{
			apndCon+='<div class="type-box"><img value="'+key+'" src="'+roomType[key].src+'"/></div>';
		}
		key++;
	}
	return apndCon;
}
function disableRight(){
	document.getElementById("right").removeAttribute("disabled");
}
function disableLeft(){
	document.getElementById("left").removeAttribute("disabled");
}
function definelight(){
	$(".roomWrapper").find(".type-box").each(function(){
		var index = $(this).find("img").attr("value");
		if(roomType[index].hasOwnProperty("check")){
			if(roomType[index].check){
				$(this).addClass("roomTypeHighlight");
			}else{
				$(this).removeClass("roomTypeHighlight");
			}
		}else{
			$(this).removeClass("roomTypeHighlight");
		}		
	});
	if(roomShow.length>=nLength){
		$("#roomAll").addClass("roomTypeHighlight");
	}else{
		$("#roomAll").removeClass("roomTypeHighlight");
	}
}
function lineColor(){
	$(".table").find(".box").each(function(){
		$(this).find("li").removeClass("test1");
		$(this).find("li").removeClass("test2");
		$(this).find("li:even").addClass("test1");
		$(this).find("li:odd").addClass("test2");
	});
}
$(function(){
	roomID = "2208";//不同屋主的ID
	var plus=0;
	Content = new Object;//involve the Json,startDate,EndDate,and WholeMonth with 2 dimension
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	//showCal-->createCal-->getJsonData-->drawCal
	//to get the Content Object
	showCal(year,month,plus);

	roomType = new Array;//involve the room type name,checked,src
	roomShow = new Array;//show the Data on the Calendar
	nLength = Content.Json.length;
	nColumn = 3;
	nLine = Math.ceil(nLength/nColumn);
	nSpare = nLength%nColumn;
	roomTypeAray();
	//change month
	$("#cal-next").click(function(){
		plus++;
		$(".table").find("tr").remove();
		showCal(year,month,plus);
		roomShow.length = 0 ;//show list should reset
		roomTypeAray();
	});
	$("#cal-prev").click(function(){
		plus--;
		$(".table").find("tr").remove();
		showCal(year,month,plus);
		roomShow.length = 0 ;//show list should reset
		roomTypeAray();
	});
	/////slide the room type
	$("#left").click(function(){
		this.disabled=true;
		setTimeout(disableLeft, 1000);
		$(".wrap").animate({"left": "+=630px"}, 1000);
		$(".roomWrapper").find(".wrap:last").remove();
		var key = parseInt($(".roomWrapper").find(".wrap:first").find("img:first").attr("value"));
		if(key<nColumn){
			key = roomType.length;
		}
		key-=nColumn;
		var apText = appendContent(key);
		$(".roomWrapper").find(".wrap:first").before('<div class="wrap" style="left:-630px">'+apText+'</div>');
		definelight();
	});
	$("#right").click(function(){
		this.disabled=true;
		setTimeout(disableRight, 1000);
		$(".wrap").animate({"left": "-=630px"}, 1000);
		$(".roomWrapper").find(".wrap:first").remove();
		var key = parseInt($(".roomWrapper").find(".wrap:last").find("img:first").attr("value"));
		key+=nColumn;
		if(key>=roomType.length){
			key = 0;
		}
		var apText = appendContent(key);
		$(".roomWrapper").append('<div class="wrap" style="left:630px">'+apText+'</div>');
		definelight();
	});
	
	var template = Handlebars.compile($("#inner-template").html());
	
	$("#roomAll").live("click",function(){
		if(roomShow.length==0){
			for(i=0;i<nLength;i++){	
				var a = 0 ;
				$(".box").each(function(){			
					if(a<42){
						$(this).find("ul").append(template(Content.Json[i].data[a]));
						a++;
					}
				});	
				roomShow.push(i);
				roomType[i].check=1;	
			}
			definelight();	
		}else if(roomShow.length==nLength){
			for(i=0;i<nLength;i++){		
				var a = 0 ;
				$(".box").each(function(){
					if(a<42){
						$(this).find("ul").find('li').remove();
						a++;
					}
				});	
				roomShow.pop();
				roomType[i].check=0;			
			} 
			definelight();
		}else{
			for(i=0;i<nLength;i++){
				if(roomShow.indexOf(i)<0){
					var a = 0 ;
					$(".box").each(function(){			
						if(a<42){
							$(this).find("ul").append(template(Content.Json[i].data[a]));
							a++;
						}
					});	
					roomShow.push(i);
					roomType[i].check=1;
				}	
			} 
			definelight();	
		}
		lineColor();
	});
	//////////////////the click to highlight
	$(".type-box").live("click",function(){
		var a = 0 ;
		var index = parseInt($(this).find("img").attr("value"));
		if(index>=nLength){
			
		}else if(roomType[index].check==0){
			$(".box").each(function(){
				if(a<42){
					$(this).find("ul").append(template(Content.Json[index].data[a]));
					a++;
				}
			});
			roomShow.push(index);
			roomType[index].check=1;
		}else{
			$(".box").each(function(){
				var x = parseInt(roomShow.indexOf(index))+1;
				if(a<42){
					$(this).find("ul").find('li:nth-child('+x+')').remove();
					a++;
				}
			});
			roomShow.splice(roomShow.indexOf(index),1);
			roomType[index].check=0;
		}
		definelight();
		lineColor();	
	});


	$(".list").live("hover",function(){
		$(this).toggleClass("highlight");
		console.log($(this).prevAll("li").length);
	});	
});


