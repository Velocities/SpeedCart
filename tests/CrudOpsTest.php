<?php

use PHPUnit\Framework\TestCase;

require(getenv('PROJECT_ROOT') . '/src/database.php');


class CrudOpsTest extends TestCase
{
    private static $db;

    public static function setUpBeforeClass(): void
    {
        self::$db = new Database(':memory:', false, true); // Use an in-memory SQLite database for testing
        self::createUsersTable();
    }

    public static function tearDownAfterClass(): void
    {
        self::$db = null;
    }

    public function testConnection()
    {
        $this->assertInstanceOf(Database::class, self::$db);
    }

    public function testInsertAndSelect()
    {
        $userId = self::$db->insert("users", ["username" => "test_user", "email" => "test@example.com"]);

        $this->assertGreaterThan(0, $userId);

        $tblName = 'users';

        $result = self::$db->select("SELECT * FROM `{$tblName}` WHERE id = :searchValue", [':searchValue' => $userId]);

        //print_r($result);

        $this->assertCount(1, $result);
        $this->assertEquals("test_user", $result[0][1]);
    }

    public function testUpdate()
    {
        self::$db->update("users", ["username" => "updated_user"], "id = 1");

        $result = self::$db->select("SELECT * FROM users WHERE id = 1");

        //print_r($result);
        $this->assertEquals("updated_user", $result[0][1]);
    }

    public function testDelete()
    {
        self::$db->delete("users", "id = :num", [':num' => 1]);

        $result = self::$db->select("SELECT * FROM users WHERE id = 1");

        $this->assertCount(0, $result);
    }

    public function testInvalidConnection()
    {
        try {
            $db = new Database('invalid_dsn');
            $this->fail('Expected PDOException, but no exception was thrown.');
        } catch (PDOException $e) {
            $this->assertInstanceOf(PDOException::class, $e);
        }
    }



    private static function createUsersTable()
    {
        $createTableSql = "
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL
            )
        ";

        self::$db->query($createTableSql);
    }
}
?>