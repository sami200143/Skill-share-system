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

    public AchievementsModel(String id, String postOwnerID, String postOwnerName, String title, String description, String date, String category,String imageUrl) {
        this.id = id;
        this.postOwnerID = postOwnerID;
        this.postOwnerName = postOwnerName;
        this.title = title;
        this.description = description;
        this.date = date;
        this.category = category;
        this.imageUrl = imageUrl;
    }
