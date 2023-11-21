<?php
interface Database {
    public function createRecord($tblName, $data);
    public function readRecords($params);
    public function updateRecord($tblName, $data, $condition = '');
    public function deleteRecord($tblName, $condition = '');
}
?>
