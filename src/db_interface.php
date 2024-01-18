<?php
interface Database {
    public function createRecord($tblName, $data);
    public function readRecords($params);
    public function updateRecord($params);
    public function deleteRecord($tblName, $condition = '');
}
?>
