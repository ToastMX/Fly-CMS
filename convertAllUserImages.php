<?php 

// Array of image links to return.
    $response = array();

    // Image types.
    /*$image_types = array(
                      "image/gif",
                      "image/jpeg",
                      "image/pjpeg",
                      "image/jpeg",
                      "image/pjpeg",
                      "image/png",
                      "image/x-png"
                  );*/

    // Filenames in the uploads folder.
    $fnames = scandir("user_uploads/");

    // Check if folder exists.
    if ($fnames) {
        // Go through all the filenames in the folder.
        foreach ($fnames as $name) {
            $count = 0;
            // Filename must not be a folder.
            if (!is_dir("./user_uploads/" . $name)) {
                include_once('./easyphpthumbnail/PHP5/easyphpthumbnail.class.php');
	            if (!file_exists("./user_uploads/s/" . $name)){
	            	$count++;
		            $s = new easyphpthumbnail;
		            $s -> Thumbsize = 200;
		            $s -> Keeptransparency = true;
		            $s -> Thumblocation = 'user_uploads/s/';
		            $s -> Thumbfilename = $name;
		            $s -> Createthumb("user_uploads/" . $name, 'file');

	 			}
	            if (!file_exists("./user_uploads/m/" . $name)){
	            	$count++;
		            $m = new easyphpthumbnail;
		            $m -> Thumbsize = 800;
		            $m -> Keeptransparency = true;
		            $m -> Thumblocation = 'user_uploads/m/';
		            $m -> Thumbfilename = $name;
		            $m -> Createthumb("user_uploads/" . $name, 'file');
		        }

	            if (!file_exists("./user_uploads/l/" . $name)){
	            	$count++;
		            $l = new easyphpthumbnail;
		            $l -> Thumbsize = 1600;
		            $l -> Keeptransparency = true;
		            $l -> Thumblocation = 'user_uploads/l/';
		            $l -> Thumbfilename = $name;
		            $l -> Createthumb("user_uploads/" . $name, 'file');

	       		}
                // Add to the array of links.
                array_push($response, $count . "mal " . $name);
            }
        }
    }

    // Folder does not exist, respond with a JSON to throw error.
    else {
        $response = new StdClass;
        $response->error = "Images folder does not exist!";
    }

    //$response = json_encode($response);

    // Send response.
    print_r ( $response );

?>