<?php

namespace App\Libraries\Database;

use PDO;
use PDOException;
use App\Libraries\Logging\Loggable;

class Database implements DatabaseInterface {
    private $dbFile;
    private $pdo;
    private $sqlType;
    public $logger;

    public function __construct($dbFile, $logfile = false, $manualFile = false) {
        if ($logfile) {
            $this->logger = new Loggable($logfile);
            $this->logger->logRun("logfile created");
        } else {
            $this->logger = false;
        }
        if ($manualFile) {
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::SQLITE_ATTR_OPEN_FLAGS => PDO::SQLITE_OPEN_READWRITE,
            ];
            $this->pdo = new PDO("sqlite:{$this->dbFile}", null, null, $options);
        } else {
            $this->dbFile = getenv('PROJECT_ROOT') . '/databases/' . $dbFile;
            $this->sqlType = "sqlite";
            $this->connect();
        }
    }

    private function connect() {
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::SQLITE_ATTR_OPEN_FLAGS => PDO::SQLITE_OPEN_READWRITE,
        ];
        if ($this->logger) {
            $this->logger->logRun('Opening database file: ' . $this->dbFile . ".db");
        }
        $this->pdo = new PDO("sqlite:{$this->dbFile}.db", null, null, $options);
    }

    public function query($sql, $params = []) {
        if ($this->logger) {
            $this->logger->logRun('Running database query: ' . $sql);
        }
        $statement = $this->pdo->prepare($sql);
        $statement->execute($params);

        return $statement;
    }

    private function getAllTables() {
        $query = "";
        switch ($this->sqlType) {
            case 'mysql':
                $query = "SHOW TABLES";
                break;
            case 'sqlite':
                $query = "SELECT name FROM sqlite_master WHERE type='table'";
                break;
            // Add more cases for other database types as needed
            default:
                // Handle unsupported database types or throw an exception
                throw new Exception("Unsupported database type");
        }
    
        $tablesList = $this->pdo->query($query);        
    
        return $tablesList->fetchAll(PDO::FETCH_COLUMN);
    }
    
    public function containsTable($table) {
        if ($this->logger) {
            $this->logger->logRun("Checking if $table exists");
        }
        $tablesList = $this->getAllTables();
        foreach ($tablesList as $currTable) {
            if ($this->logger) {
                $this->logger->logRun("getAllTables call result: " . $currTable);
            }
            if (strcmp($currTable, $table) === 0) {
                return true;
            }
        }
        return false;
    }

    // Modify the select method to handle named parameters
    public function selectRecords($tblName, $params = []) {
        // Sanitize table name
        $tblName = preg_replace('/[^a-zA-Z0-9_]/', '', $tblName);
        $sql = "SELECT * FROM $tblName";
        $bindingParams = array();
        if ( $params ) {
            // Build conditional query
            $equalityMappings = $params['EQUALS'];
            $likeMappings = $params['LIKE'];
            $sql .= " WHERE ";
            $i = 0;
            foreach ( $equalityMappings as $currEqualKey => $currEqualValue ) {
                if ($i > 0) {
                    $sql .= " AND ";
                }
                // Sanitize the column name to prevent injection
                $columnName = preg_replace('/[^a-zA-Z0-9_]/', '', $currEqualKey); // Ensure only alphanumeric characters and underscores are allowed
                $sql .= "$columnName"; // We have to do it this way (you can't bind column names)
                $sql .= " = :$i";
                $bindingParams[":".$i] = $currEqualValue;
                $i++;
            }
            foreach ( $likeMappings as $currLikeKey => $currLikeValue ) {
                if ($i > 0) {
                    $sql .= " AND ";
                }
                // Sanitize the column name to prevent injection
                $columnName = preg_replace('/[^a-zA-Z0-9_]/', '', $currLikeKey); // Ensure only alphanumeric characters and underscores are allowed
                $sql .= "LOWER($columnName)"; // We have to do it this way (you can't bind column names)
                $sql .= " LIKE :$i";
                $bindingParams[":".$i] = "%" . strtolower($currLikeValue) . "%";
                $i++;
            }
        }
        if ($this->logger) {
            $this->logger->logRun('Running database SELECT, command is: ' . $sql);
            $this->logger->logRun('bindingParams: '.print_r($bindingParams, true));
        }

        $statement = $this->pdo->prepare($sql);

        $statement->execute($bindingParams);

        return $statement->fetchAll(PDO::FETCH_ASSOC); // Use FETCH_ASSOC to get associative array
    }


    public function insertRecord($tblName, $data) {
        // Sanitize table name
        $tblName = preg_replace('/[^a-zA-Z0-9_]/', '', $tblName);
        if ($this->logger) {
            $this->logger->logRun('Running database INSERT');
        }
        $keys = implode(',', array_keys($data));
        $values = implode(',', array_fill(0, count($data), '?'));

        $sql = "INSERT INTO $tblName ($keys) VALUES ($values)";

        $this->query($sql, array_values($data));
        return $this->pdo->lastInsertId();
    }

    // $data is a map whose values represent the record(s) upon update completion
    public function updateRecords($tblName, $data, $params = []) {
        // Sanitize table name
        $tblName = preg_replace('/[^a-zA-Z0-9_]/', '', $tblName);
        if ($this->logger) {
            $this->logger->logRun('Running database UPDATE');
            $this->logger->logRun('data = ' . print_r($data, true));
        }
        $setColumns = [];
        $setParams = [];
        $i = 0;
        
        foreach ($data as $key => $value) {
            $setColumns[] = "$key=?";
            $setParams[":$i"] = $value;
            $i++;
        }
        
        $setClause = implode(',', $setColumns);

        $sql = "UPDATE $tblName SET $setClause";

        $whereClause = '';
        $bindingParams = [];
        
        if ($params) {
            $equalityMappings = $params['EQUALS'];
            $likeMappings = $params['LIKE'];
            
            foreach ($equalityMappings as $currEqualKey => $currEqualValue) {
                $columnName = preg_replace('/[^a-zA-Z0-9_]/', '', $currEqualKey);
                $whereClause .= ($whereClause ? ' AND ' : '') . "$columnName = ?";
                $bindingParams[":$i"] = $currEqualValue;
                $i++;
            }
            
            foreach ($likeMappings as $currLikeKey => $currLikeValue) {
                $columnName = preg_replace('/[^a-zA-Z0-9_]/', '', $currLikeKey);
                $whereClause .= ($whereClause ? ' AND ' : '') . "LOWER($columnName) LIKE ?";
                $bindingParams[":$i"] = "%" . strtolower($currLikeValue) . "%";
                $i++;
            }
        }

        if ($whereClause) {
            $sql .= " WHERE $whereClause";
        }
        
        if ($this->logger) {
            $this->logger->logRun("Command running: $sql");
            $this->logger->logRun("bindingParams: " . print_r($bindingParams, true));
        }

        $statement = $this->pdo->prepare($sql);
        $statement->execute(array_merge(array_values($setParams), array_values($bindingParams)));
        /*if ($this->logger) {
            if ($result === TRUE) {
                $this->logger->logRun("Ran UPDATE, result: TRUE");
            } else {
                $this->logger->logRun("Ran UPDATE, result: FALSE");
            }
        }*/
        
        return ["status" => "success", "message" => "Resource updated successfully"];
        //$this->query($sql, $params);
    }

    public function deleteRecords($tblName, $params) {
        // Sanitize table name
        $tblName = preg_replace('/[^a-zA-Z0-9_]/', '', $tblName);
        if ($this->logger) {
            $this->logger->logRun('Running database DELETE');
        }
        //$sql = "DELETE FROM $tblName WHERE $condition";
        $sql = "DELETE FROM $tblName";
        $bindingParams = array();
        if ( $params ) {
            // Build conditional query
            $equalityMappings = $params['EQUALS'];
            $likeMappings = $params['LIKE'];
            $sql .= " WHERE ";
            $i = 0;
            // Add NULL check so foreach loop doesn't run and crash, in the case that equalityMappings is NULL
            if ( $equalityMappings ) {
                foreach ( $equalityMappings as $currEqualKey => $currEqualValue ) {
                    if ($i > 0) {
                        $sql .= " AND ";
                    }
                    // Sanitize the column name to prevent injection
                    $columnName = preg_replace('/[^a-zA-Z0-9_]/', '', $currEqualKey); // Ensure only alphanumeric characters and underscores are allowed
                    $sql .= "$columnName"; // We have to do it this way (you can't bind column names)
                    $sql .= " = :$i";
                    $bindingParams[":".$i] = $currEqualValue;
                    $i++;
                }
            }
            // Add NULL check so foreach loop doesn't run and crash, in the case that likeMappings is NULL
            if ( $likeMappings ) {
                foreach ( $likeMappings as $currLikeKey => $currLikeValue ) {
                    if ($i > 0) {
                        $sql .= " AND ";
                    }
                    // Sanitize the column name to prevent injection
                    $columnName = preg_replace('/[^a-zA-Z0-9_]/', '', $currLikeKey); // Ensure only alphanumeric characters and underscores are allowed
                    $sql .= "LOWER($columnName)"; // We have to do it this way (you can't bind column names)
                    $sql .= " LIKE :$i";
                    $bindingParams[":".$i] = "%" . strtolower($currLikeValue) . "%";
                    $i++;
                }
            }
        }
        //$this->query($sql, $params);
        $statement = $this->pdo->prepare($sql);

        $statement->execute($bindingParams);
    }
}

// Example Usage:
//$dbFile = 'path/to/your/database.sqlite';
//$db = new Database($dbFile);

// Rest of the code remains the same as in the previous example

?>
