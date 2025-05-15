package backend.Achievements.controller;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import backend.Achievements.model.AchievementsModel;
import backend.Achievements.repository.AchievementsRepository;
import backend.exception.ResourceNotFoundException;

@RestController
@CrossOrigin("http://localhost:3000")
public class AchievementsController {
    @Autowired
    private AchievementsRepository achievementsRepository;
    private final Path root = Paths.get("uploads/achievementsPost");
    //Insert
    @PostMapping("/achievements")
    public AchievementsModel newAchievementsModel(@RequestBody AchievementsModel newAchievementsModel) {
        return achievementsRepository.save(newAchievementsModel);
    }

    @GetMapping("/achievements")
    List<AchievementsModel> getAll() {
        return achievementsRepository.findAll();
    }

    @GetMapping("/achievements/{id}")
    AchievementsModel getById(@PathVariable String id) {
        return achievementsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

 @PutMapping("/achievements/{id}")
    AchievementsModel update(@RequestBody AchievementsModel newAchievementsModel, @PathVariable String id) {
        return achievementsRepository.findById(id)
                .map(achievementsModel -> {
                    achievementsModel.setTitle(newAchievementsModel.getTitle());
                    achievementsModel.setDescription(newAchievementsModel.getDescription());
                    achievementsModel.setPostOwnerID(newAchievementsModel.getPostOwnerID());
                    achievementsModel.setPostOwnerName(newAchievementsModel.getPostOwnerName());
                    achievementsModel.setDate(newAchievementsModel.getDate());
                    achievementsModel.setCategory(newAchievementsModel.getCategory());
                    achievementsModel.setImageUrl(newAchievementsModel.getImageUrl());
                    return achievementsRepository.save(achievementsModel);
                }).orElseThrow(() -> new ResourceNotFoundException(id));
    }

       @DeleteMapping("/achievements/{id}")
    public void delete(@PathVariable String id) {
        achievementsRepository.deleteById(id);
    }

    @GetMapping("/achievements/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Error loading image: " + e.getMessage());
        }
    }
}
