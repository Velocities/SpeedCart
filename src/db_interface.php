<?php
interface Database {
    public function createRecord($tblName, $data);
    public function readRecords($tblName, $condition = '', $params = [], $columns = '*');
    public function updateRecord($tblName, $data, $condition = '');
    public function deleteRecord($tblName, $condition = '');
}
?>
