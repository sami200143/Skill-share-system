package backend.LearningPlan.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "LearningPlan")
public class LearningPlanModel {
    @Id
    @GeneratedValue
    private String id;
    private String title;
    private String description;
    private String contentURL;
    private List<String> tags;
    private String postOwnerID; // Use postOwnerID consistently
    private String postOwnerName;
    private String createdAt;
    private String imageUrl;
    private int templateID; // New field for templateID
    private String startDate; // New field
    private String endDate;   // New field
    private String category;  // New field