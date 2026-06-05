package ma.ac.esi.sitesync.task.controller;


import ma.ac.esi.sitesync.task.dto.TaskCreateDto;
import ma.ac.esi.sitesync.task.dto.TaskResponseDto;
import ma.ac.esi.sitesync.task.dto.TaskUpdateDto;

import ma.ac.esi.sitesync.task.dto.TaskUpdateStatusDto;
import ma.ac.esi.sitesync.task.model.Task;
import ma.ac.esi.sitesync.task.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    @Autowired
    private TaskService service;

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks(){
        List<TaskResponseDto> tasks = service.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable String id) {
        TaskResponseDto task = service.getTaskById(id);

            return ResponseEntity.ok(task);

    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody TaskCreateDto dto){
        TaskResponseDto savedTask = service.createTask(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedTask.id())
                .toUri();

        return ResponseEntity.created(location).body(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable String id, @RequestBody TaskUpdateDto dto) {
        TaskResponseDto updatedTask = service.update(id, dto);

        return ResponseEntity.ok(updatedTask);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Void> updateStatut(@PathVariable String id, @RequestBody TaskUpdateStatusDto dto){
        service.updateState(id , dto.status());
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id
    ) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/planning/{chantierId}")
    public ResponseEntity<List<TaskResponseDto>> getTachesByChantierId(
            @PathVariable String chantierId) {

        return ResponseEntity.ok(service.getTachesByChantierId(chantierId));
    }




}
