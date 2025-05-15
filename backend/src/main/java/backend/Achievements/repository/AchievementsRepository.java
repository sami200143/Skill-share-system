package backend.Achievements.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import backend.Achievements.model.AchievementsModel;

public interface AchievementsRepository extends MongoRepository<AchievementsModel, String> {
    void deleteByPostOwnerID(String postOwnerID); // Ensure this method exists
}

