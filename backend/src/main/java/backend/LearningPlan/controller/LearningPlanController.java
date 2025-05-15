package backend.LearningPlan.controller;

import backend.exception.ResourceNotFoundException;
import backend.exception.ResourceNotFoundException;
import backend.LearningPlan.model.LearningPlanModel;
import backend.Notification.model.NotificationModel;
import backend.LearningPlan.repository.LearningPlanRepository;
import backend.Notification.repository.NotificationRepository;
import backend.User.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class LearningPlanController {
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    private final Path root = Paths.get("uploads/plan");
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // Insert
    @PostMapping("/learningPlan")
    public LearningPlanModel newLearningSystemModel(@RequestBody LearningPlanModel newLearningPlanModel) {
        System.out.println("Received data: " + newLearningPlanModel); // Debugging line
        if (newLearningPlanModel.getPostOwnerID() == null || newLearningPlanModel.getPostOwnerID().isEmpty()) {
            throw new IllegalArgumentException("PostOwnerID is required."); // Ensure postOwnerID is provided
        }
        // Fetch user's full name from UserRepository
        String postOwnerName = userRepository.findById(newLearningPlanModel.getPostOwnerID())
                .map(user -> user.getFullname())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for ID: " + newLearningPlanModel.getPostOwnerID()));
        newLearningPlanModel.setPostOwnerName(postOwnerName);

        // Set current date and time
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        newLearningPlanModel.setCreatedAt(currentDateTime);

        return learningPlanRepository.save(newLearningPlanModel); 
    }
