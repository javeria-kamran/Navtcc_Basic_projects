package com.example.fitnesstracker

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class SignupActivity : AppCompatActivity() {

    private lateinit var nameInput: EditText
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var confirmPasswordInput: EditText
    private lateinit var errorText: TextView
    private lateinit var signupButton: Button
    private lateinit var goToLoginText: TextView

    private lateinit var dbHelper: UserDatabaseHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)

        dbHelper = UserDatabaseHelper(this)

        nameInput = findViewById(R.id.signupNameInput)
        emailInput = findViewById(R.id.signupEmailInput)
        passwordInput = findViewById(R.id.signupPasswordInput)
        confirmPasswordInput = findViewById(R.id.signupConfirmPasswordInput)
        errorText = findViewById(R.id.signupErrorText)
        signupButton = findViewById(R.id.signupButton)
        goToLoginText = findViewById(R.id.goToLoginText)

        signupButton.setOnClickListener { attemptSignup() }

        // NAVIGATION: Signup -> Login (go back)
        goToLoginText.setOnClickListener {
            finish()  // Just close Signup, returns to Login underneath
        }
    }

    private fun attemptSignup() {
        val name = nameInput.text.toString().trim()
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString().trim()
        val confirmPassword = confirmPasswordInput.text.toString().trim()
        errorText.text = ""

        // ---- VALIDATION ----
        if (name.isEmpty()) {
            errorText.text = "Please enter your name"
            return
        }
        if (name.length < 3) {
            errorText.text = "Name must be at least 3 characters"
            return
        }
        if (email.isEmpty()) {
            errorText.text = "Please enter your email"
            return
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            errorText.text = "Please enter a valid email address"
            return
        }
        if (password.isEmpty()) {
            errorText.text = "Please enter a password"
            return
        }
        if (password.length < 6) {
            errorText.text = "Password must be at least 6 characters"
            return
        }
        if (confirmPassword != password) {
            errorText.text = "Passwords do not match"
            return
        }

        // ---- CHECK FOR DUPLICATE EMAIL ----
        if (dbHelper.emailExists(email)) {
            errorText.text = "An account with this email already exists"
            return
        }

        // ---- SAVE TO DATABASE ----
        val success = dbHelper.registerUser(name, email, password)
        if (success) {
            Toast.makeText(this, "Account created! Please log in.", Toast.LENGTH_LONG).show()

            // NAVIGATION: Signup -> Login
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            finish()
        } else {
            errorText.text = "Something went wrong. Please try again."
        }
    }
}
