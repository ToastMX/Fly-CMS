<?php

include ('security.php');
if ($_POST['pass'] == $pass) {

    // this comes from here: https://editor.froala.com/server-integrations/php-image-upload
    ini_set("log_errors", 1);
    ini_set("error_log", "php-error.log");
    //var_dump($_FILES);

    // Allowed extentions.
    $allowedExts = array("gif", "jpeg", "jpg", "png");

    //nur kleinbuchstaben:
    $_FILES["file"]["name"] = strtolower($_FILES["file"]["name"]);
    //$_FILES["file"]["tmp_name"] = strtolower($_FILES["file"]["tmp_name"]);
    // Get filename.
    $temp = explode(".", $_FILES["file"]["name"]);
    // Get extension.
    $extension = strtolower(end($temp));

    if (in_array($extension, $allowedExts)) {
        $name = $_FILES["file"]["name"];
        $name = str_replace(' ','_',$name);
        //max file size is setted in htaccess to 30M
        // Save file in the uploads folder.
        if ( move_uploaded_file($_FILES["file"]["tmp_name"], getcwd() . "/user_uploads/" . $name) ) {
            //var_dump($savestatus);
            //echo ini_get( 'upload_max_filesize' );

            // Generate response.
            $response = new StdClass;
            $response->link = "./user_uploads/l/" . $name;
            echo stripslashes(json_encode($response));

        

            //------ thumbnail generating -------- 
            include_once('./easyphpthumbnail/PHP5/easyphpthumbnail.class.php');
            $s = new easyphpthumbnail;
        
            $s -> Thumbsize = 200;
            $s -> Keeptransparency = true;
            $s -> Thumblocation = 'user_uploads/s/';
            $s -> Thumbfilename = $name;
            $s -> Createthumb("user_uploads/" . $name, 'file');
 
            $m = new easyphpthumbnail;
            $m -> Thumbsize = 800;
            $m -> Keeptransparency = true;
            $m -> Thumblocation = 'user_uploads/m/';
            $m -> Thumbfilename = $name;
            $m -> Createthumb("user_uploads/" . $name, 'file');


            $l = new easyphpthumbnail;
            $l -> Thumbsize = 1600;
            $l -> Keeptransparency = true;
            $l -> Thumblocation = 'user_uploads/l/';
            $l -> Thumbfilename = $name;
            $l -> Createthumb("user_uploads/" . $name, 'file');
    /* */      
        }
        else {
            echo "fileupload error";
        }
    }
    else {
        echo "extension error";
    }
}
else {
    echo "error pass";
}
?>