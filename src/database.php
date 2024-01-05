<?php

use PDO;
use PDOException;

require('loggable.php');

class Database
{
    private $dbFile;
    private $pdo;
    private $sqlType;
    public $logger;

    public function __construct($dbFile, $logfile = false, $manualFile = false)
    {
        if ($logfile) {
            $this->logger = new loggable($logfile);
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

    private function connect()
    {
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::SQLITE_ATTR_OPEN_FLAGS => PDO::SQLITE_OPEN_READWRITE,
        ];
        if ($this->logger) {
            $this->logger->logRun('Opening database file: ' . $this->dbFile . ".db");
        }
        $this->pdo = new PDO("sqlite:{$this->dbFile}.db", null, null, $options);
    }

    public function query($sql, $params = [])
    {
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

    /*public function select($sql, $params = [])
    {
        if ($this->logger) {
            $this->logger->logRun('Running database SELECT, command is: ' . $sql);
        }
        $statement = $this->query($sql, $params);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }*/
    // Modify the select method to handle named parameters
    public function select($sql, $params = [])
    {
        if ($this->logger) {
            $this->logger->logRun('Running database SELECT, command is: ' . $sql);
        }

        $statement = $this->pdo->prepare($sql);

        $statement->execute($params);

        return $statement->fetchAll(PDO::FETCH_NUM);
    }


    public function insert($table, $data)
    {
        if ($this->logger) {
            $this->logger->logRun('Running database INSERT');
        }
        $keys = implode(',', array_keys($data));
        $values = implode(',', array_fill(0, count($data), '?'));

        $sql = "INSERT INTO `{$table}` ($keys) VALUES ($values)";

        $this->query($sql, array_values($data));
        return $this->pdo->lastInsertId();
    }

    // $data is a map whose values represent the record(s) upon update completion
    public function update($table, $data, $condition, $params = [])
    {
        if ($this->logger) {
            $this->logger->logRun('Running database UPDATE');
        }
        $set = implode(',', array_map(function ($key) {
            return "$key=?";
        }, array_keys($data)));

        $sql = "UPDATE `{$table}` SET $set WHERE $condition";
        if ($this->logger) {
            $this->logger->logRun("Command running: $sql");
            foreach($data as $param => $val) {
                $this->logger->logRun("update map: $param => $val");
            }
        }
        $result = $this->query($sql, array_values(array_merge($data, $params)));
        if ($this->logger) {
            if ($result === TRUE) {
                $this->logger->logRun("Ran UPDATE, result: TRUE");
            } else {
                $this->logger->logRun("Ran UPDATE, result: FALSE");
            }
        }
        //$this->query($sql, $params);
    }

    public function delete($table, $condition, $params)
    {
        if ($this->logger) {
            $this->logger->logRun('Running database DELETE');
        }
        $sql = "DELETE FROM `{$table}` WHERE $condition";
        $this->query($sql, $params);
    }
}

// Example Usage:
//$dbFile = 'path/to/your/database.sqlite';
//$db = new Database($dbFile);

// Rest of the code remains the same as in the previous example

?>
