package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.TagRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.TagResponseDto;
import ma.jamcha.jamcha.entities.Tag;
import ma.jamcha.jamcha.mappers.TagMapper;
import ma.jamcha.jamcha.repositories.TagRepository;
import ma.jamcha.jamcha.services.TagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    @Override
    public List<TagResponseDto> getAll() {
        return tagRepository.findAll().stream()
                .map(tagMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponseDto getById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
        return tagMapper.toDto(tag);
    }

    @Override
    public TagResponseDto create(TagRequestDto dto) {
        if (tagRepository.findByName(dto.getName()).isPresent()) {
            throw new RuntimeException("A tag with this name already exists.");
        }

        Tag tag = tagMapper.toEntity(dto);
        Tag saved = tagRepository.save(tag);
        return tagMapper.toDto(saved);
    }

    @Override
    public TagResponseDto update(Long id, TagRequestDto dto) {
        Tag existing = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));

        if (!existing.getName().equals(dto.getName())) {
            if (tagRepository.findByName(dto.getName()).isPresent()) {
                throw new RuntimeException("Another tag with this name already exists.");
            }
            existing.setName(dto.getName());
        }

        if (dto.getColor() != null) {
            existing.setColor(dto.getColor());
        }

        Tag updated = tagRepository.save(existing);
        return tagMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!tagRepository.existsById(id)) {
            throw new RuntimeException("Tag not found with id: " + id);
        }
        tagRepository.deleteById(id);
    }
}