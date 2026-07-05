package org.example.aurabackend.dto.request;

import lombok.Data;

@Data
public class TagCreationRequest {
    
    private String name;
    
    private Integer usedCount;
}
