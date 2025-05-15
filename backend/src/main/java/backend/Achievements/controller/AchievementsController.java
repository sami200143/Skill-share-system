package backend.Achievements.controller;

import backend.exception.ResourceNotFoundException;
import backend.Achievements.model.AchievementsModel;
import backend.Achievements.repository.AchievementsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

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


