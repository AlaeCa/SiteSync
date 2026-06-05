package ma.ac.esi.sitesync.task.service;


import ma.ac.esi.sitesync.task.dto.TaskCreateDto;
import ma.ac.esi.sitesync.task.dto.TaskResponseDto;
import ma.ac.esi.sitesync.task.dto.TaskUpdateDto;
import ma.ac.esi.sitesync.task.enums.TaskStatus;
import ma.ac.esi.sitesync.task.mapper.TaskMapper;
import ma.ac.esi.sitesync.task.model.Task;
import ma.ac.esi.sitesync.task.repository.TaskRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository repo;

    @Autowired
    private TaskMapper mapper;


    public List<TaskResponseDto> getAllTasks() {


        return repo.findAll().stream().map(mapper::toResponseDto).toList();
    }

    public TaskResponseDto getTaskById(String id) {
        Task task= repo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        return mapper.toResponseDto(task);
    }

    public TaskResponseDto createTask (TaskCreateDto dto) {
        Task task = mapper.toEntity(dto);
        Task saved = repo.save(task);

        return mapper.toResponseDto(saved);
    }


    public TaskResponseDto update(String id, TaskUpdateDto dto){
        Task task = repo.findById(id).orElseThrow( () -> new RuntimeException("Task not found"));
        mapper.updateTaskFromDto(dto, task);
        Task updated = repo.save(task);

        return mapper.toResponseDto(updated);
    }


    public void delete(String id) {

        Task task = repo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        repo.delete(task);

    }

    public void updateState(String id, TaskStatus statut) {
        repo.updateStatut(new ObjectId(id), statut);

    }

    public List<TaskResponseDto> getTachesByChantierId(String chantierId) {
        List<Task> tasks = repo.findByChantierId(chantierId);

        return tasks.stream().map(mapper::toResponseDto).toList();
    }
}


