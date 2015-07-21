<html>
    <head>
        <title>pipsweb</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="style.css">
        <style id="userstyle"></style>
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
            <a id="toggleeditoverview" class="b1" href="#">edit view</a> <br>
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
                <a id="toggleEditMode" class="b1" href="#">Edit Mode</a> </br>
                <a id="toggleChanges" class="b1" href="#">no Changes</a>
                <div id="changelog">
                    
                </div>
                <a id="serverpublish" class="b1" href="#">Publish This</a>
            </div>
            <a id="toggleadmin" class="b1" href="#">a</a>
        </div>

        <a id="togglerawedit" href="#" class="b1">raw</a>

        <a id="toggleuserstyle" class="b1" href="#">css</a>
        <div id="edituserstyle-container">
            <div id="edituserstyle-head" class="b1">user styles</div>
            <code id="edituserstyle" contenteditable="true"></code>
            <a class="b1 saveEdit">save</a>
            <a class="b1 resetEdit">reset</a>
        </div>

        <div id="starlist-container" class="selectable">
            <a id="togglestarlist" class="b1" href="#">all</a>
            <div id="starlist">

            </div>
        </div>

        <div id="file-container" class="selectable">
            <a id="togglefiles" class="b1" href="#">f</a>
            <div id="files">
                
            </div>
        </div>

        <div id="history-container" class="selectable">
            <a id="togglehistory" class="b1" href="#">h</a>
            <div id="history">
                
            </div>
        </div>

        <div id="templates"> 
        
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
                echo "dataCopy = ".$data.";";

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