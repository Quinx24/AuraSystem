package org.example.aurabackend.dto.request;

public class EmotionRequest {

    private String text;

    public EmotionRequest() {
        
    }

    public EmotionRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}