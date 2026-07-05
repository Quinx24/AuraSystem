package org.example.aurabackend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.util.HashSet;
import java.util.Set;

import org.example.aurabackend.enumeration.Emotion;

@Entity
@Table(name = "journal_entries")
@Getter //Tác dụng tự động tạo getter cho tất cả các trường
@Setter //Tác dụng tự động tạo setter cho tất cả các trường
@NoArgsConstructor //Tác dụng tự động tạo constructor không tham số
@AllArgsConstructor //Tác dụng tự động tạo constructor với tất cả các tham số
@Builder //Tác dụng tự động tạo builder pattern cho class này, giúp dễ dàng tạo đối tượng với cú pháp linh hoạt
public class JournalEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String journalContent;

    @Column(length = 300)
    private String noteToSelf;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Emotion primaryEmotion;

    private Double confidence;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
        name = "journal_tags",
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(
        mappedBy = "journalEntry",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private Set<JournalEmotion> journalEmotions = new HashSet<>();
}
