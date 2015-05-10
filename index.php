<html>
    <head>
        <title>pipsweb</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="style.css">
        <script type="text/javascript" src="jquery-2.0.3.min.js"></script>
        <script type="text/javascript" src="jquery-ui-1.11.4/jquery-ui.min.js"></script>
        <script type="text/javascript" src="script.js"></script>
                <!-- Include Font Awesome. -->
        <link href="froala_editor_1.2.6/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <!-- Include Editor style. -->
        <link href="froala_editor_1.2.6/css/froala_editor.min.css" rel="stylesheet" type="text/css" />
        <link href="froala_editor_1.2.6/css/froala_style.min.css" rel="stylesheet" type="text/css" />
        <script src="froala_editor_1.2.6/js/froala_editor.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/font_family.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/colors.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/font_size.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/video.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/media_manager.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/urls.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/block_styles.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/lists.min.js"></script
        <script src="froala_editor_1.2.6/js/plugins/tables.min.js"></script>
        <script src="froala_editor_1.2.6/js/plugins/file_upload.min.js"></script>
        <!-- Include IE8 JS. --> <!--[if lt IE 9]> <script src="froala_editor_1.2.6/js/froala_editor_ie8.min.js"></script> <![endif]-->
        
        <meta content='width=device-width, initial-scale=0.7, maximum-scale=1, minimum-scale=0.7, user-scalable=1' name='viewport' />
    </head>
    <body class="deselect">
        <div id="himmel"></div>
        
        <div id="editoverview">
            <a class="toggleEdit" href="#">edit view</a> <br>
            <div class="edit">
                <a id="savePosition" href="#">Himmel speichern.</a><br>
                <a id="newPlanet" href="#">Planet hinzufügen</a><br>
                <form id="setNewPlanetId">
                    <input class="newPlanetId" type="text" value="urltag">
                    <input type="submit" value="Neuer Planet">
                </form>
                <a id="changeBackground" href="#">Hintergrund ändern</a><br>
                <form id="setNewBackground">
                    <input class="newBackground" type="text" value="url">
                    <input type="submit" value="Senden">
                </form>
                <a id="blackwhitefont" href="#">Black/White Font</a><br>
            </div>
        </div>
        
        <form id="adminLogin">

            <input class="pw" type="password" name="adminLogin-pass">
            <input class="send" type="submit" value="Login">
            <div class="passwortinkorrekt">Passwort inkorrekt</div>
            <a class="closeAdminLogin" href="#">x</div>
        </form>
        <a></a>
        
        
        <div id="minifooter"><a id="reset" href="#">start</a></div>
        
        <div id="admin-container">
            <div id="admin">
                <a id="editMode" href="#">Edit Mode</a> </br>
                <a id="serverpublish" href="#">Publish This</a>
            </div>
            <a id="toggleadmin" href="#">a</a>
        </div>

        <a id="togglerawedit" href="#">raw</a>

        <div id="starlist-container" class="selectable">
            <a id="togglestarlist" href="#">all</a>
            <div id="starlist">

            </div>
        </div>

        <div id="file-container" class="selectable">
            <a id="togglefiles" href="#">f</a>
            <div id="files">
                
            </div>
        </div>

        <div id="history-container" class="selectable">
            <a id="togglehistory" href="#">h</a>
            <div id="history">
                
            </div>
        </div>
        
        <script>
            
            <?php
                // !!! escape HACKGEFAHR 
                //escape !!!
                $fixedtime = isset($_GET['t']) ? $_GET['t'] : Null;
                $files = scandir('./data', true);
                $newesttime = str_replace('.json', '', $files[0]);
                
                if($fixedtime and $fixedtime != $newesttime){
                    $fixedfilename = './data/'.$fixedtime.'.json';
                    if (file_exists($fixedfilename)) {
                        $data = file_get_contents($fixedfilename);
                        echo "prevtimeset = ".$fixedtime.";";
                    }
                    else { $fixedtime = Null;}
                }

                if (!$fixedtime or !isset($data)){
                    $data = file_get_contents('data/'.$files[0]);
                }
                $data_real = json_decode($data);
                //print_r($data);
                echo "data = ".$data.";";

            ?>
            
        </script>
        <style type="text/css">
            <?php
            if (isset($data_real -> background)) {
                echo 'body { background-image: url("'.urldecode($data_real -> background).'") }';
            }
            ?>
        </style>
    </body>
</html>