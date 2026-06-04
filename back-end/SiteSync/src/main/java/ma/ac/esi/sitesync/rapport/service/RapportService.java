package ma.ac.esi.sitesync.rapport.service;

import lombok.RequiredArgsConstructor;
import ma.ac.esi.sitesync.rapport.dto.RapportCreateDto;
import ma.ac.esi.sitesync.rapport.dto.RapportResponseDto;
import ma.ac.esi.sitesync.rapport.mapper.RapportMapper;
import ma.ac.esi.sitesync.rapport.model.Rapport;
import ma.ac.esi.sitesync.rapport.repository.RapportRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RapportService {

    @Autowired
    private final RapportRepository rapportRepository;

    private final RapportMapper rapportMapper;


    public RapportResponseDto creerRapport(RapportCreateDto dto) {

        Rapport rapport = rapportMapper.toEntity(dto);

        rapport.setDate(LocalDateTime.now());

        Rapport saved = rapportRepository.save(rapport);

        return rapportMapper.toResponseDto(saved);
    }



    public List<RapportResponseDto> getRapportsParChantier(String chantierId) {

        return rapportRepository
                .findByChantierIdOrderByDateDesc(chantierId)
                .stream()
                .map(rapportMapper::toResponseDto)
                .toList();
    }
}