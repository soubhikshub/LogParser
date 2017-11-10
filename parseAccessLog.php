<?php
require 'toInflux.php';


$linesParsed=0;
$fileName="";
if(isset($_REQUEST['s'])){
	$linesParsed=$_REQUEST['s'];
}
if(isset($_REQUEST['f'])){
	$fileName=$_REQUEST['f'];
	//echo $fileName;
}else{
	echo "No files specified"; return;
}

echo parseAccessLog($linesParsed,$fileName);

function parseAccessLog($linesParsed,$fileName){
	$myfile = fopen($fileName, "r") or die("Unable to open file!");
// Output one line until end-of-file

$lines=array();
$num=0;

$startLine=$linesParsed;

//echo $endIndex; //return 0;

while(true) {
	$line=fgets($myfile);
	
	//skip the lines already parsed
	
	if($startLine>0){
		$startLine--;
		continue;
	}
	
	if(feof($myfile)){
		return "-1";
	}
	
	if($num===1000){  //$num is the number of lines to parse in one go
		return ($linesParsed+$num);
	}
	
	$line=str_replace("-","",$line);
	$line=str_replace("\"","",$line);
	$logVals=explode(" ",$line);
	
	
	//echo $line; break;
	
	//
	$dtime = @DateTime::createFromFormat("d/M/Y:G:i:s", $logVals[3]);
	$timestamp = $dtime->getTimestamp();
	$timestamp=str_pad($timestamp,19,"0");
	
	$influxPostBody="accessLog";
	
	$influxPostBody.=""
					.",ip=".$logVals[0]
					.",callBy=".$logVals[2]
					.",methodType=".$logVals[5]
					.",url=".$logVals[6]
					.",connectivity=".$logVals[7]
					.",responseCode=".$logVals[8]	
					.",callFrom=".trim($logVals[11])
				    ." responseBodySize=".$logVals[9]." ".$timestamp;
	
				    //echo $influxPostBody;
	//writing data to influx
	__toInflux("POST",$influxPostBody);
	
	//delete the request from the array
	//unset($lines[$logId]);
	unset($influxPostBody);
	unset($timestamp);
}
fclose($myfile);
return $num;
}


?>