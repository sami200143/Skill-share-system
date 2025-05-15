package backend.Notification.controller;

import backend.Notification.model.NotificationModel;
import backend.Notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin("http://localhost:3000")
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/{userId}")
    public List<NotificationModel> getNotifications(@PathVariable String userId) {
        return notificationRepository.findByUserId(userId);
    }