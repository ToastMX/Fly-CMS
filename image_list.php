<?php

include ('security.php');
if ($_GET['pass'] == $pass) {

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
            // Filename must not be a folder.
            if (!is_dir("./user_uploads/" . $name)) {
                // !!!!!! 
                // i dont check if fie is an image because of windows problems, 
                // so have onlyy images in folder please!!!!

                // Add to the array of links.
                array_push($response, "./user_uploads/s/" . $name);
            }
        }
    }

    // Folder does not exist, respond with a JSON to throw error.
    else {
        $response = new StdClass;
        $response->error = "Images folder does not exist!";
    }

    $response = json_encode($response);

    // Send response.
    echo stripslashes($response);

}
else {
    echo "error pass";
}
?>