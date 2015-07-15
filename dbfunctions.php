<?
// A class for handling all db interaction.
class dbFunctions {
	protected $db;
	
	public function setDb($db) {
		$this->db = $db;
	}
	
	public function setExtensionTable($table){
		$this->extensions = $table;
	}
	
	public function setFileTable($table){
		$this->files = $table;
	}
	
	public function createFilename($extension){
		$con = &$this->db;
		$files = &$this->files;
		$extensions = &$this->extensions;
		$stmt = $con->prepare("INSERT INTO $files (keywords, extension)  SELECT ?, id FROM $extensions WHERE extension = ?");
		if($stmt === false) die("prepare failed: ".htmlspecialchars($stmt->error));
		$keyword = "";
		$rc = $stmt->bind_param("ss", $keyword, $extension);
		$rc = $stmt->execute();
		$last_id = mysqli_insert_id($con);
		$stmt->close();
		if($last_id){
			return $last_id;
		}else{
			return false;
		}
	}
	
	public function getData(){
		$con = &$this->db;
		$files = &$this->files;
		$extensions = &$this->extensions;
		$stmt = $con->prepare("SELECT $files.id, $files.keywords, $extensions.extension FROM $files JOIN $extensions on $extensions.id = $files.extension");
		$rc = $stmt->execute();
		
		$meta = $stmt->result_metadata();
		while($field = $meta->fetch_field()){
			$params[] = &$row[$field->name];
		}
		
		call_user_func_array(array($stmt, 'bind_result'), $params);
		
		while ($stmt->fetch()) {
			foreach($row as $key => $val){
				$c[$key] = $val;
			}
			$result[] = $c;
		}
		$stmt->close();
		
		return $result;
	}
	
	public function removeFiles($ids){
		$con = &$this->db;
		$files = &$this->files;
		$in = trim(str_repeat("?,", count($ids)), ",");
		$sql = "DELETE FROM $files WHERE id in($in)";
		$stmt = $con->prepare($sql);
		$types = str_repeat("i", count($ids));
		
		$bind = array();
		foreach($ids as $key => $value){
			$bind[$key] = &$ids[$key];
		}
		array_unshift($bind, $types);
		call_user_func_array(array($stmt, "bind_param"), $bind);
		$rc = $stmt->execute();
		$stmt->close();
		return true;
	}
	
	public function setKeywords($id, $keywords) {
		$con = &$this->db;
		$files = &$this->files;
		$stmt = $con->prepare("UPDATE $files SET keywords=? WHERE id=?");
		$rc = $stmt->bind_param("si", $keywords, $id);
		$rc = $stmt->execute();
		$stmt->close();
		return true;
	}
}

require_once('dbcon.php');

/*
	Initialize the dbFunctions() object and set connection & tables
*/
$dbf = new dbFunctions();
$dbf->setDb($con);
$dbf->setFileTable(/*some_table*/);
$dbf->setExtensionTable(/*another_table*/);
?>