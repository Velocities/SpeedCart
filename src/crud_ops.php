<?php
require 'db_interface.php';
require 'loggable.php';

class SQLite3Database implements Database {

  private SQLite3 $db;
  private $name;
  private loggable $logger;

  function __construct( $dbName, $logpath, $customPath = false ) {
    // Logging setup
    $this->logger = new loggable( $logpath );
  
    // Functional code
    $this->name = $dbName;
    if ( $customPath ) {
      $this->db = new SQLite3( $dbName );
    } else {
      $this->db = new SQLite3( $_SERVER['PROJECT_ROOT'] . "/databases/" . $dbName );
    }
    $timestamp = date('Y-m-d H:i:s');
    if ( !$this->db ) {
      $this->logger->logRun("Database connection to $name unsuccessful", $timestamp);
      //die("Unsuccessful database connection terminated");
    } else {
      $this->logger->logRun("Database connection to $this->name successful", $timestamp);
    }
  }

  // Getter method
  public function getConnection() {
    return $this->db;
  }

  public function createTable($tblName, $cols = []) {
    $sqlCommand = "CREATE TABLE $tblName (";

    foreach ($cols as $column) {
        $sqlCommand .= "$column, ";
    }

    $sqlCommand = rtrim($sqlCommand, ', ') . ");";

    try {
        $stmt = $this->db->prepare($sqlCommand);
        if ($stmt) {
          $stmt->execute();
          return true;
        }
        throw new Exception("Error when preparing statement");
    } catch (\Exception $e) {
      // Log the SQL command even in case of an exception
      $this->logger->logRun("Error executing CREATE query: $sqlCommand", date('Y-m-d H:i:s'));
      // Handle the exception, log it, or throw a more specific exception
      // depending on your application's error handling strategy.
      // For now, we'll just return false.
      return false;
    }
  }

  
  public function createRecord($tblName, $data)
{
    $columns = implode(', ', array_keys($data));
    $placeholders = ':' . implode(', :', array_keys($data));

    $sqlCommand = "INSERT INTO $tblName ($columns) VALUES ($placeholders)";
    $this->logger->logRun("About to execute CreateRecord query: $sqlCommand", date('Y-m-d H:i:s'));
    $stmt = $this->db->prepare($sqlCommand);
    $timestamp = date('Y-m-d H:i:s');

    if ($stmt) {
        $this->logger->logRun("Preparation of database CREATE for $tblName successful, performing query...", $timestamp);

        // Bind values using named placeholders
        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        return $stmt->execute();
    }

    return false;
}


  
  public function readRecords($params) {
    $tblName = $params['tblName'] ?? '';
    $columns = $params['columns'] ?? '*';
    $condition = $params['condition'] ?? '';
    $paramValues = $params['params'] ?? array();
    $this->logger->logRun("Database readRecords on " . $tblName, date('Y-m-d H:i:s'));

    $sqlCommand = "SELECT $columns FROM $tblName";
    if (!empty($condition)) {
        $sqlCommand .= " WHERE $condition";
    }

    $stmt = $this->db->prepare($sqlCommand);
    $timestamp = date('Y-m-d H:i:s');

    if ($stmt) {
        $this->logger->logRun("Preparation of database READ for $tblName successful, performing query: $sqlCommand...", $timestamp);

        // Bind parameters if provided
        foreach ($paramValues as $param => $value) {
            $this->logger->logRun("Binding value $param to $value", $timestamp);
            $res = $stmt->bindValue($param, $value, SQLITE3_TEXT);
            if ($res) {
              $this->logger->logRun("Binding value succeeded", $timestamp);
            } else {
              $this->logger->logRun("Binding value failed", $timestamp);
            }
        }

        $result = $stmt->execute();

        $data = [];
        $this->logger->logRun("READ data received:", $timestamp);

        /*while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $this->logger->logRun($row['NAME'], $timestamp);
            $this->logger->logRun($row['YEAR'], $timestamp);
            $data[] = array($row['NAME'], $row['YEAR']);
        }*/
        while ($row = $result->fetchArray(SQLITE3_NUM)) {
          $data[] = $row;
          $this->logger->logRun("Data row found:", $timestamp);
        }

        return $data;
    } else {
        // Log the error and return an empty array
        $this->logger->logRun("Error preparing query: " . $this->db->lastErrorMsg(), $timestamp);
        return [];
    }
  }


  
  public function updateRecord( $tblName, $data, $condition = '') {
    $this->logger->logRun("Database updateRecord " . $name, date('Y-m-d H:i:s'));
    $setClause = impload(', ', array_map(fn($key, $value) => "$key= " . $this->db->escapeString($value), array_keys($data), $data));
    $sqlCommand = "UPDATE $tblName SET $setClause";
    if ( !empty( $condition ) ) {
      $sqlCommand .= " WHERE $condition";
    }

    $stmt = $this->db->prepare($sql);
    $timestamp = date('Y-m-d H:i:s');
    if ( $stmt ) {
      $this->logger->logRun("Preparation of database UPDATE for $name successful, performing query...", $timestamp);
      $i = 1;
      foreach ($data as $value) {
        $stmt->bindValue($i, $value);
        $i++;
      }
      return $stmt->execute();
    }
    return false;
  }
  
  public function deleteRecord( $tblName, $condition = '', $bindVals = array() ) {
    $this->logger->logRun("Database deleteRecord " . $this->name, date('Y-m-d H:i:s'));
    $sqlCommand = "DELETE FROM $tblName";
    if ( !empty( $condition ) ) {
      $sqlCommand .= " WHERE $condition";
    }

    $stmt = $this->db->prepare( $sqlCommand );
    $timestamp = date('Y-m-d H:i:s');
    if ( $stmt ) {
      foreach ($bindVals as $currParam => $currValue) {
        $res = $stmt->bindValue($currParam, $currValue);
        if ($res) {
          $this->logger->logRun("Binding value succeeded", $timestamp);
        } else {
          $this->logger->logRun("Binding value failed", $timestamp);
        }
      }
      $this->logger->logRun("Preparation of database DELETE for $this->name successful, performing query...", $timestamp);
      return $stmt->execute();
    }
    return false;
  }
  
  function __destruct() {
    $this->db->close();
    $this->logger->logRun("Database " . $this->name . " closure ", date('Y-m-d H:i:s'));
  }
}

?>
