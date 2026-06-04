package ma.ac.esi.sitesync.task.mapper;


import ma.ac.esi.sitesync.task.dto.*;
import ma.ac.esi.sitesync.task.model.Task;
import org.bson.types.ObjectId;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "id", ignore = true)
    Task toEntity(TaskCreateDto dto);

    TaskResponseDto toResponseDto(Task task);

    @Mapping(target = "id", ignore = true)
    void updateTaskFromDto(
            TaskUpdateDto dto,
            @MappingTarget Task task
    );

    default ObjectId map(String id) {
        return id == null ? null : new ObjectId(id);
    }

    default String map(ObjectId id) {
        return id == null ? null : id.toHexString();
    }
}
