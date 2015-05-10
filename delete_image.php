<?php
include ('security.php');

$pw = isset($_POST['pass'])?$_POST['pass']:Null;




if ($_POST['pass'] == $pass) {

    // Get src.
    $src = isset($_POST['src'])?$_POST['src'] : Null;
    $name = explode("/", $src);
    $name = end($name);
    $src = './user_uploads/' . $name ;
    
    // Get extension.

    $filesize_array = Array ( $src, 
                          $lsrc = str_replace('/user_uploads/','/user_uploads/l/',$src),
                          $msrc =str_replace('/user_uploads/','/user_uploads/m/',$src),
                          $ssrc =str_replace('/user_uploads/','/user_uploads/s/',$src) );
    $count = 0;
    foreach ($filesize_array as $link) {
      if (file_exists($link)) {
        // Delete file.
        unlink($link);
        $count++;
      }
    }
    // Check if file exists.
    if ($count) {
      echo "deleted" . $count . " files";
    }
    else {
    	echo "files doesnt exist";
    	print_r($_POST);
    }

}
else {
    echo "error pass";
}
?>