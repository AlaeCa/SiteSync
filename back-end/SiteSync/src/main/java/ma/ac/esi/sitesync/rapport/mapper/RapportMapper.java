package ma.ac.esi.sitesync.rapport.mapper;

import ma.ac.esi.sitesync.rapport.dto.RapportCreateDto;
import ma.ac.esi.sitesync.rapport.dto.RapportResponseDto;
import ma.ac.esi.sitesync.rapport.model.Rapport;
import org.bson.types.ObjectId;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RapportMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "date", ignore = true)
    Rapport toEntity(RapportCreateDto dto);

    RapportResponseDto toResponseDto(Rapport rapport);

    // AJOUTE CES DEUX MÉTHODES POUR GÉRER L'OBJECTID DU RAPPORT
    default ObjectId map(String id) {
        return id == null ? null : new ObjectId(id);
    }

    default String map(ObjectId id) {
        return id == null ? null : id.toHexString();
    }
}