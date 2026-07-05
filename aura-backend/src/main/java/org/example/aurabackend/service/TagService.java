package org.example.aurabackend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.example.aurabackend.repository.TagRepository;
import org.example.aurabackend.dto.response.TagResponse;
import org.example.aurabackend.entity.Tag;
import java.util.List;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    private TagResponse mapToResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .usedCount(tag.getUsedCount())
                .build();
    }

    public TagResponse createTag(String name) {

        if(tagRepository.findByName(name.trim()).isPresent()) {
            throw new AppException(ErrorCode.TAG_ALREADY_EXISTED);
        }

        Tag newTag = Tag.builder()
                .name(name)
                .usedCount(0)
                .build();
        
        Tag savedTag = tagRepository.save(newTag);
        return mapToResponse(savedTag);
    }

    public TagResponse getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TAG_NOT_FOUND));
        return mapToResponse(tag);
    } 

    public List<TagResponse> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream().map(this::mapToResponse).toList();
    }

    public TagResponse updateTag(Long id, String name) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TAG_NOT_FOUND));

        tagRepository.findByName(name.trim())
            .ifPresent(existingTag -> {
                if (!existingTag.getId().equals(id)) {
                    throw new AppException(ErrorCode.TAG_ALREADY_EXISTED);
                }
            });
        
        tag.setName(name.trim());

        return mapToResponse(tagRepository.save(tag));
    }

    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TAG_NOT_FOUND));
        tagRepository.delete(tag);
    }
}
