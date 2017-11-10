<?php 

function __toInflux($methodType,$influxPostBody){
	
	//	echo $influxPostBody;
	
	// Create a stream
	$opts = array(
			'http'=>array(
					'method'=>$methodType,
					'header'  => "Content-type: application/x-www-form-urlencoded",
					'content' => $influxPostBody
			)
	);
	//print_r($opts);
	
	$context = stream_context_create($opts);
	
	//print_r($context);
	
	// Open the file using the HTTP headers set above
	try{
		$file = file_get_contents("http://localhost:8086/write?db=logs",false, $context);
	}catch(Exception $e){
		echo $e->getMessage();
		break;
	}
}

?>