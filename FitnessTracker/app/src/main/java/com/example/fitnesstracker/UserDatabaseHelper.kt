package com.example.fitnesstracker

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class UserDatabaseHelper(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        const val DATABASE_NAME = "FitnessTrackerUsers.db"
        const val DATABASE_VERSION = 1

        const val TABLE_NAME = "users"
        const val COLUMN_ID = "id"
        const val COLUMN_NAME = "name"
        const val COLUMN_EMAIL = "email"
        const val COLUMN_PASSWORD = "password"
    }

    private val CREATE_TABLE = """
        CREATE TABLE IF NOT EXISTS $TABLE_NAME (
            $COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            $COLUMN_NAME TEXT NOT NULL,
            $COLUMN_EMAIL TEXT NOT NULL UNIQUE,
            $COLUMN_PASSWORD TEXT NOT NULL
        )
    """.trimIndent()

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(CREATE_TABLE)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }

    // Check if an email is already registered
    fun emailExists(email: String): Boolean {
        val db = this.readableDatabase
        val cursor = db.query(
            TABLE_NAME, null,
            "$COLUMN_EMAIL = ?", arrayOf(email),
            null, null, null
        )
        val exists = cursor.count > 0
        cursor.close()
        db.close()
        return exists
    }

    // SIGN UP: Register a new user
    fun registerUser(name: String, email: String, password: String): Boolean {
        val db = this.writableDatabase
        val values = ContentValues().apply {
            put(COLUMN_NAME, name)
            put(COLUMN_EMAIL, email)
            put(COLUMN_PASSWORD, password)
        }
        val result = db.insert(TABLE_NAME, null, values)
        db.close()
        return result != -1L
    }

    // LOGIN: Check email + password match
    fun loginUser(email: String, password: String): Boolean {
        val db = this.readableDatabase
        val cursor = db.query(
            TABLE_NAME, null,
            "$COLUMN_EMAIL = ? AND $COLUMN_PASSWORD = ?",
            arrayOf(email, password),
            null, null, null
        )
        val success = cursor.count > 0
        cursor.close()
        db.close()
        return success
    }

    // Get logged-in user's name by email (used to greet on Home page)
    fun getUserName(email: String): String {
        val db = this.readableDatabase
        val cursor = db.query(
            TABLE_NAME, arrayOf(COLUMN_NAME),
            "$COLUMN_EMAIL = ?", arrayOf(email),
            null, null, null
        )
        var name = ""
        if (cursor.moveToFirst()) {
            name = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_NAME))
        }
        cursor.close()
        db.close()
        return name
    }
}
