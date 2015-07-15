<?
require_once "dbfunctions.php";
require_once "fileparams.php";


if(isSet($_POST["delete"])){
	$ids = $_POST["ids"];
	$extensions = $_POST["extensions"];
	$dbf->removeFiles($ids);
	foreach($ids as $key => $val){
		unlink($thumbDestination.$val.".jpg");
		unlink($destination.$val.".".$extensions[$key]);
	}
	echo json_encode(true);
	exit();
}

if(isSet($_POST["setKeywords"])){
	if($dbf->setKeywords($_POST["id"], $_POST["keywords"])){
		echo json_encode(true);
		exit();
	}
	else{
		echo json_encode(false);
		exit();
	}
}

?>