<?
require_once './vendor/Flow/Autoloader.php';
require_once 'dbfunctions.php';
require_once 'fileparams.php';
Flow\Autoloader::register();

$config = new \Flow\Config();
$config->setTempDir($chunkFolder);
$file = new \Flow\File($config);
$request = new \Flow\Request();

function getImgExtension($fname){
	preg_match("/^.*\.(jpg|jpeg|png|gif)$/i", $fname, $out);
	return strtolower($out[1]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($file->checkChunk()) {
        header("HTTP/1.1 200 Ok");
    } else {
        header("HTTP/1.1 204 No Content");
        return ;
    }
} else {
  if ($file->validateChunk()) {
      $file->saveChunk();
  } else {
      // error, invalid chunk upload request, retry
      header("HTTP/1.1 400 Bad Request");
      return ;
  }
}


if ($file->validateFile()){
	$extension = getImgExtension( $request->getFileName() );
	$unique_filename = $dbf->createFilename($extension);
	$filename = $unique_filename . "." . $extension;
	if($unique_filename && $file->save($destination.$filename)) {
		if(make_thumb($destination.$filename, $thumbDestination.$filename, 150)){
			echo json_encode(['id' => $unique_filename, 'extension' => $extension, 'keywords' => '']);
		}
		// File upload was completed
	}
} else {
    // This is not a final chunk, continue to upload
}

function make_thumb($src, $dest, $max_diam) {

	// read the source image
	$extension = getImgExtension($src);
	switch($extension){
		case "jpeg": 
		case "jpg": $source_image = imagecreatefromjpeg($src); break;
		case "png": $source_image = imagecreatefrompng($src); break;
		case "gif": $source_image = imagecreatefromgif($src); break;
	}
	
	$width = imagesx($source_image);
	$height = imagesy($source_image);
	$centerX = round($width/2);
	$centerY = round($height/2);
	if(max($width, $height)==$width){
		$cropY = 0;
		$cropX = round($centerX - ($height/2));
	}else{
		$cropX = 0;
		$cropY = round($centerY - ($width/2));
	}
	
	
	// find the "desired height" of this thumbnail, relative to the desired width
	$coefficient = $max_diam / min($width, $height);
	$desired_height = $height * $coefficient;
	$desired_width = $width * $coefficient;
	
	// create a new, "virtual" image
	$virtual_image = imagecreatetruecolor($max_diam, $max_diam);
	
	// copy source image at a resized size with crop
	imagecopyresampled($virtual_image, $source_image, 0, 0, $cropX, $cropY, $desired_width, $desired_height, $width, $height);
	
	// create the physical thumbnail image to its destination
	$destination = preg_replace("/(jpg|jpeg|png|gif)/i", "jpg", $dest);
	imagejpeg($virtual_image, $destination);
	imagedestroy($virtual_image);
	
	return true;
} 

?>