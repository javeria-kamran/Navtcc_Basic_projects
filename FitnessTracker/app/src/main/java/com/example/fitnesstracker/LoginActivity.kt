package com.example.fitnesstracker

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class LoginActivity : AppCompatActivity() {

    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var errorText: TextView
    private lateinit var loginButton: Button
    private lateinit var goToSignupText: TextView

    private lateinit var dbHelper: UserDatabaseHelper
    private lateinit var session: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        dbHelper = UserDatabaseHelper(this)
        session = SessionManager(this)

        // If already logged in, skip Login screen entirely and go straight to Home
        if (session.isLoggedIn()) {
            goToMain()
            return
        }

        emailInput = findViewById(R.id.loginEmailInput)
        passwordInput = findViewById(R.id.loginPasswordInput)
        errorText = findViewById(R.id.loginErrorText)
        loginButton = findViewById(R.id.loginButton)
        goToSignupText = findViewById(R.id.goToSignupText)

        loginButton.setOnClickListener { attemptLogin() }

        // NAVIGATION: Login -> Signup
        goToSignupText.setOnClickListener {
            val intent = Intent(this, SignupActivity::class.java)
            startActivity(intent)
        }
    }

    private fun attemptLogin() {
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString().trim()
        errorText.text = ""

        // ---- VALIDATION ----
        if (email.isEmpty()) {
            errorText.text = "Please enter your email"
            return
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            errorText.text = "Please enter a valid email address"
            return
        }
        if (password.isEmpty()) {
            errorText.text = "Please enter your password"
            return
        }
        if (password.length < 6) {
            errorText.text = "Password must be at least 6 characters"
            return
        }

        // ---- CHECK DATABASE ----
        val success = dbHelper.loginUser(email, password)
        if (success) {
            val name = dbHelper.getUserName(email)
            session.saveSession(name, email)
            Toast.makeText(this, "Welcome back, $name!", Toast.LENGTH_SHORT).show()
            goToMain()
        } else {
            errorText.text = "Incorrect email or password"
        }
    }

    // NAVIGATION: Login -> Main (Home with Bottom Navigation)
    private fun goToMain() {
        val intent = Intent(this, MainActivity::class.java)
        // Clear back stack so user can't press "Back" and return to Login
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}
