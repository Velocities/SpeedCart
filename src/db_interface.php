<?php
interface DatabaseInterface {
    public function insertRecord($tblName, $data);
    public function selectRecords($tblName, $params = []);
    public function updateRecords($tblName, $data, $params = []);
    public function deleteRecords($tblName, $params);
}
?>
