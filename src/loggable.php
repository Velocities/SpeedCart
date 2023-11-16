<?php
class loggable {
    private $logFilePath;

    function __construct( $path ) {
        $this->logFilePath = $path;
        ini_set( 'log_errors', 1 );
        ini_set( 'error_log', $this->logFilePath );
    }

    // Cannot use log as name; already used by prebuilt natural logarithm PHP function
    function logRun( $action, $date ) {
        error_log( $action . " completed at " . $date );
    }
}
?>