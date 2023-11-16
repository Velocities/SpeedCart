<?php
require('crud_ops.php');

$db = new SQLite3Database("movies.db", __DIR__ . '/../logs/api.log');
$searchValue = $_REQUEST['srchValue'];
$params = [':searchValue' => "%$searchValue%"];

$qryResults = $db->readRecords('movies', 'name LIKE :searchValue', $params);

echo json_encode($qryResults);
?>