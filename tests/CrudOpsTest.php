<?php

use PHPUnit\Framework\TestCase;
require '../src/crud_ops.php';

class CrudOpsTest extends TestCase
{
    private static SQLite3Database $db;

    public static function setUpBeforeClass(): void
    {
        self::$db = new SQLite3Database(':memory:', __DIR__ . '/../logs/test.log');
        self::$db->createTable('test_table', ['id INTEGER PRIMARY KEY', 'name TEXT']);
    }

    public function testReadRecordsReturnsEmptyArrayOnFakeSearchRecord()
    {
        // Act
        $result = self::$db->readRecords('test_table', '', [], '*');
        
        // Assert
        $this->assertEquals([], $result);
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
