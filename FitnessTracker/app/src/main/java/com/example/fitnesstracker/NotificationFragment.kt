package com.example.fitnesstracker

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import androidx.fragment.app.Fragment

class NotificationFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_notification, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val listView: ListView = view.findViewById(R.id.notificationListView)

        // Sample notification data (in a real app this would come from a database or server)
        val notifications = listOf(
            AppNotification("🎯", "Goal Reached!", "You hit 10,000 steps today. Great job!", "5m"),
            AppNotification("💧", "Hydration Reminder", "You haven't logged water in 3 hours.", "1h"),
            AppNotification("🔥", "Streak Alert", "You're on a 5-day workout streak!", "3h"),
            AppNotification("🏋️", "Workout Suggestion", "Try a 20-min HIIT session today.", "6h"),
            AppNotification("📊", "Weekly Report", "Your weekly fitness summary is ready.", "1d"),
            AppNotification("🎉", "New Badge", "You unlocked the 'Early Bird' badge.", "2d")
        )

        listView.adapter = NotificationAdapter(requireContext(), notifications)
    }
}
