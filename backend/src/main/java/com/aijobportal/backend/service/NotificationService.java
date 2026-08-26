package com.aijobportal.backend.service;

import com.aijobportal.backend.entity.Notification;
import com.aijobportal.backend.entity.User;

import java.util.List;

public interface NotificationService {
    void notify(User user, String title, String message, Notification.NotificationType type);
    List<Notification> getMyNotifications(String email);
}
