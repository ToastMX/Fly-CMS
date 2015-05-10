<?php

include ('security.php');

    //$data = isset($_POST['data'])?mysql_real_escape_string($_POST['data']):Null;
    
    // if " and \ gets escaped
    // relevant fpr php5.3 and above
    if (get_magic_quotes_gpc())  { 
        //echo "magic QUOTES \n";
        $_POST = stripslashes_deep($_POST);
    }
    
    $data = $_POST['data'];
        //$raw_post = urldecode(file_get_contents("php://input")); 
        //var_dump($raw_post);
        //var_dump($_POST['data']);
    if ($data){
        $justcheck = false;
        if (isset($data["checkpw"])){
             $justcheck = true;
        }
        $CLientpass = isset($data["pass"])? $data["pass"] : Null;
        if ($CLientpass == $pass){
            
            if (!$justcheck){
                unset( $data["pass"] );
                $data['date'] = time();
                $name = time() . ".json";
                $savestring = json_encode($data);

                $bytes = file_put_contents('data/'.$name, $savestring);
                if ($bytes){
                    echo "SUCCESS";
                }
                else {
                    echo "error4FILE";
                }
            }
            if ($justcheck){
                echo "SUCCESS";
            }
        }
        else {
            echo "error3PASSWORT";
        }
       }
    else {
        echo "error1REQUEST";
    }
    
    
    //has to be used if magic quotes is enabled!!! which is depraceted in PHP5.4+
    function stripslashes_deep($value)
    {
        $value = is_array($value) ?
                    array_map('stripslashes_deep', $value) :
                    stripslashes($value);

        return $value;
    }
    
?>