package backend.Notification.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class NotificationModel {
    @Id
    @GeneratedValue
    private String id;
    private String userId; // The user who owns this notification
    private String message; // Notification message
    private boolean read; // Whether the notification has been read
    private String createdAt; // Timestamp of the notification
