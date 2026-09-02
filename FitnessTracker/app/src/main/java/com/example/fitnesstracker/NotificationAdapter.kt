package com.example.fitnesstracker

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView

class NotificationAdapter(
    context: Context,
    private val notifications: List<AppNotification>
) : ArrayAdapter<AppNotification>(context, 0, notifications) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // Reuse the row view if Android already created one (recycling = smooth scrolling)
        val view = convertView ?: LayoutInflater.from(context)
            .inflate(R.layout.item_notification, parent, false)

        val notification = notifications[position]

        view.findViewById<TextView>(R.id.notifIcon).text = notification.icon
        view.findViewById<TextView>(R.id.notifTitle).text = notification.title
        view.findViewById<TextView>(R.id.notifMessage).text = notification.message
        view.findViewById<TextView>(R.id.notifTime).text = notification.time

        return view
    }
}
