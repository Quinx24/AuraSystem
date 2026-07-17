package org.example.aurabackend.dto.request;

import lombok.Data;
import java.util.Set;
import jakarta.validation.constraints.NotBlank;

@Data
public class JournalEntryCreationRequest {
    
    @NotBlank(message = "Journal content cannot be blank")
    private String journalContent;

    private String noteToSelf;

    private String memoryPhoto;

    private Set<String> tags;
}
