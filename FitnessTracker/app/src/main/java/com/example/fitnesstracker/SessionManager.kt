package com.example.fitnesstracker

import android.content.Context

// Manages the "logged in" state using SharedPreferences
// SharedPreferences = small key-value storage that survives app restarts
class SessionManager(context: Context) {

    private val prefs = context.getSharedPreferences("FitnessTrackerSession", Context.MODE_PRIVATE)

    companion object {
        const val KEY_LOGGED_IN = "is_logged_in"
        const val KEY_NAME = "user_name"
        const val KEY_EMAIL = "user_email"
    }

    // Save session after successful login
    fun saveSession(name: String, email: String) {
        val editor = prefs.edit()
        editor.putBoolean(KEY_LOGGED_IN, true)
        editor.putString(KEY_NAME, name)
        editor.putString(KEY_EMAIL, email)
        editor.apply()  // apply() saves in background (don't use commit() on UI thread)
    }

    fun isLoggedIn(): Boolean {
        return prefs.getBoolean(KEY_LOGGED_IN, false)
    }

    fun getUserName(): String {
        return prefs.getString(KEY_NAME, "") ?: ""
    }

    fun getUserEmail(): String {
        return prefs.getString(KEY_EMAIL, "") ?: ""
    }

    // Clear session on logout
    fun logout() {
        val editor = prefs.edit()
        editor.clear()
        editor.apply()
    }
}
