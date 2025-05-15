package backend.Achievements.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Achievements")
public class AchievementsModel {
    @Id
    @GeneratedValue
    private String id;
    private String postOwnerID;
    private String postOwnerName;
    private String title;
    private String description;
    private String date;
    private String  category;
    private String imageUrl;
    public AchievementsModel() {

    }
