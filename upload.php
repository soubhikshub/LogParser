<?php

// A list of permitted file extensions
//$allowed = array('png', 'jpg', 'gif','zip');

if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0){

	
	if(move_uploaded_file($_FILES['upl']['tmp_name'], 'logs/'.$_FILES['upl']['name'])){
		echo '{"status":"success"}';
		exit;
	}
	
}

echo '{"status":"error"}';
exit;