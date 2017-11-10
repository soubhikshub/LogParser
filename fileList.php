<?php


if(!isset($_REQUEST['a'])) {
	echo "No action set";
	return;
}

if($_REQUEST['a']==="list") {
	echo listFiles();
}
if($_REQUEST['a']==="del"){
	echo delFile();
}
	
	
function listFiles(){

$searchFileType="";
$dir=".";

if(isset($_REQUEST['ft'])){
	$searchFileType=$_REQUEST['ft'];
}
if(isset($_REQUEST['dir'])){
	$dir=$_REQUEST['dir'];
}

$fileList=scandir($dir);
$files="";
foreach ($fileList as $file){
	if(strpos($file,$searchFileType)>0){
		$files.=$file.",";
	}
}

return $files;
}
//print_r(scandir($dir));

function delFile(){
	//echo $_REQUEST['fn'];
	$searchFile="";
	$dir=".";
	
	if(isset($_REQUEST['fn'])){
		$searchFile=$_REQUEST['fn'];
	}
	if(isset($_REQUEST['dir'])){
		$dir=$_REQUEST['dir'];
	}
	
	$fileToDel=$dir."/".$searchFile;
	
	if (is_file($fileToDel)){
		return unlink($fileToDel);
		
	}
	
}

?>