$(document).ready(function(){
	
			getFileList();
			
			$( function() {
			    $( "#sortable" ).sortable();
			    $( "#sortable" ).disableSelection();
			  } );					
			
			$("#upload ul").change(function(){
				getFileList();
			});
			
			
		});

// SIGNATURE PROGRESS
function moveProgressBar(progressBar) {
  //console.log("moveProgressBar");
    var getPercent = ($(progressBar).data('progress-percent') / 100);
    var getProgressWrapWidth = $(progressBar).width();
    var progressTotal = getPercent * getProgressWrapWidth;
    var animationLength = 2500;
    
    // on page load, animate percentage bar to data percentage length
    // .stop() used to prevent animation queueing
    $(progressBar).children('.progress-bar').stop().animate({
        left: progressTotal
    }, animationLength);
}

function parseFile(ele){

	var fileName=$(ele).attr("data-value");
	var logType="";
	
	var val=$(ele).siblings(".nice-select").children(".list").children(".selected");//.attr("data-value");

	if(val.attr("data-value")=="0"){
		$(ele).siblings(".nice-select").css("border","1px solid red");
		return -1;
	}
	if(val.attr("data-value")=="request"){
		logType="parseRequestLog.php";
	}
	if(val.attr("data-value")=="access"){
		logType="parseAccessLog.php";
	}

	var progressBar=$(ele).parent();
	$(ele).parent().html('<div class="progress-wrap progress" data-progress-percent="1" data-value="0">'
			  +'<div class="progress-bar progress"></div>'
			  +'</div>');
	
	progressBar=$(progressBar).children(".progress-wrap");
	//console.log($(progressBar).attr("data-progress-percent"));

	sendToParser(logType,0,fileName,progressBar);
		
	
	//moveProgressBar(progressBar);
}

function sendToParser(logType,linesParsed,fileName,progressBar){
	//sending request to relevant parser
	
	$.get(logType+"?s="+linesParsed+"&f=logs/"+fileName, function(data, status){
		console.log(data);
		
			$(progressBar).children('.progress-bar').stop().animate({
		        left: 1
		    }, 2500);
		
		if(data>-1){ 
			 sendToParser(logType,data,fileName,progressBar);
		}
		else{
			
			$(progressBar).children('.progress-bar').stop().animate({
		        left: $(progressBar).width()
		    }, 2500,function(){
		    /*
		     	$(progressBar).parent().append('<a style="color:red; cursor:pointer;"'
		    			+'onclick="deleteFile(this)" title="delete">X</a>');
		    */
		    });
		    
			
			
		  
		}
	});
}

function getFileList(){
	$.get("fileList.php?a=list&dir=logs&ft=log",function(data, status){
		//$("#file-list").html(data);
		
		if(data==""){
			var msg='<li class="ui-state-default"style="margin-top:10px;padding:2px;vertical-align: middle; line-height:42px;">'
				+'No logs to display'
				+'</li>';
			$("#sortable").html(msg);
			
			return -1;
		}
		
		var files=data.split(",");

		var msg="";
		for(var i=0;i<files.length;i++){
			if(files[i]=="") continue;
			 msg+='<li class="ui-state-default"style="margin-top:10px;padding:2px;vertical-align: middle; line-height:42px;"'
				 +'data-value="'+files[i]+'">'
				+'<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>'
				+files[i]
				+'<span class="progressBar" style="float:right; width:260px;">'
				
				+'<select>'
				+'<option value="0" disabled="disabled" selected="selected">Select log type</option>'
				+'<option value="access">Access log</option>'
				+'<option value="request">Request log</option>'
				//+'<option value="3">Stwater log</option>'
				//+'<option value="4">error log</option>'
				+'</select>'
				+'<button data-value="'+files[i]
				+'"  title="Parse and upload '+files[i]
				+' to influxDB for Graphical representation" class="ui-button ui-widget ui-corner-all parse" style="margin-left:10px;"'
				+ ' onClick="parseFile(this)" >Parse</button>'
				+'<a title="Delete '+files[i]+'" style="margin-right:10px;margin-left:10px;color:red; cursor:pointer;" '
				+'onclick="deleteFile(this)" alt="delete">X</a></span>'
				+'<div style="clear:both;"></div></li>';
			
		}
		$("#sortable").html(msg);
		
		$('select').niceSelect();
		//console.log(data);
	});
	
}

function deleteFile(ele){
	//$(ele).parent().hide();
	var fileName=$(ele).parent().parent().attr("data-value");//.replace("X","");
//	fileName=fileName.substr(0,fileName.indexOf(";"));
	$.get("fileList.php?a=del&dir=logs&fn="+fileName,function(data, status){
		//console.log(data);
		if(data==1){
		console.log(fileName+" deleted");	
		$(ele).parent().parent().hide();
		}
	});
}
