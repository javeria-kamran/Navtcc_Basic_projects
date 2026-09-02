package com.example.fitnesstracker

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment

class HomeFragment : Fragment() {

    private var glassesLogged = 0
    private var workoutMinutes = 28

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate fragment_home.xml as this fragment's view
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val greetingText: TextView = view.findViewById(R.id.greetingText)
        val waterValue: TextView = view.findViewById(R.id.waterValue)
        val workoutValue: TextView = view.findViewById(R.id.workoutValue)
        val logWaterButton: Button = view.findViewById(R.id.logWaterButton)
        val startWorkoutButton: Button = view.findViewById(R.id.startWorkoutButton)

        // Personalize greeting using the logged-in user's name from SessionManager
        val session = SessionManager(requireContext())
        val firstName = session.getUserName().split(" ").firstOrNull() ?: "Athlete"
        greetingText.text = "Hi, $firstName! \uD83D\uDC4B"

        logWaterButton.setOnClickListener {
            glassesLogged++
            val liters = 0.9 + (glassesLogged * 0.25)
            waterValue.text = String.format("%.1fL", liters)
            Toast.makeText(requireContext(), "Glass logged! 💧", Toast.LENGTH_SHORT).show()
        }

        startWorkoutButton.setOnClickListener {
            workoutMinutes += 5
            workoutValue.text = "$workoutMinutes min"
            Toast.makeText(requireContext(), "+5 minutes added to today's workout!", Toast.LENGTH_SHORT).show()
        }
    }
}
