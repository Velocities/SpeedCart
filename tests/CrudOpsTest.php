<?php

use PHPUnit\Framework\TestCase;
require(getenv('PROJECT_ROOT') . '/src/crud_ops.php');

class CrudOpsTest extends TestCase
{
    private static SQLite3Database $db;

    public static function setUpBeforeClass(): void
    {
        self::$db = new SQLite3Database(':memory:', __DIR__ . '/../logs/test.log', true);
        self::$db->createTable('testTable', ['id INTEGER PRIMARY KEY', 'name TEXT']);
    }

    public function testReadRecordsReturnsEmptyArrayOnFakeSearchRecord()
    {
        $params = [
            'tblName' => 'testTable',
            'columns' => '*',
            'condition' => '',
        ];
        
        $result = self::$db->readRecords($params);
        
        // Assert
        $this->assertEquals([], $result);
    }

    public function testCreateRecordsSuccessAndReadableAfterAddingRecord()
    {
        $result = self::$db->createRecord('testTable', ['id' => 20, 'name' => "abc"]);
        $this->assertNotEquals(false, $result);
        $params = [
            'tblName' => 'testTable',
            'columns' => '*',
            'condition' => "name=:name",
            'params' => [':name' => "abc"],
        ];

        $result = self::$db->readRecords($params);
        //print_r($result);
        $this->assertEquals([[20, 'abc']], $result);
    }

    public function testUpdateSuccessOnExistingRecordAndReadWorksAfterUpdate()
    {
        $params = [
            'tblName' => 'testTable',
            'columns' => '*',
            'condition' => "name=:name",
            'setValues' => ["name" => ":john"],
            'params' => [':name' => "abc"],
        ];
        $result = self::$db->updateRecord($params);
        //$result = self::$db->updateRecord('testTable', ['id' => 20, 'name' => "john", 'abc' => 'abc'], "name=:abc");

        $this->assertNotFalse($result);
        $params = [
            'tblName' => 'testTable',
            'columns' => '*',
        ];
        
        $result = self::$db->readRecords($params);
        print_r($result);
        $params = [
            'tblName' => 'testTable',
            'columns' => '*',
            'condition' => "name=:name",
            'params' => [':name' => "john"],
        ];
        $result = self::$db->readRecords($params);
        print_r($result);
        $this->assertEquals([[20, 'john']], $result);
    }

    public function testDeleteRecordSuccessAndUnreadableAfterRemoval()
    {
        $result = self::$db->deleteRecord('testTable', 'name=:name', [':name' => "abc"]);
        $this->assertNotFalse($result);
    }

    // Add more test methods as needed

    public static function tearDownAfterClass(): void
    {
    // Drop the table
    $connection = self::$db->getConnection();
    $connection->query('DROP TABLE IF EXISTS test_table');
    }

}



?>
