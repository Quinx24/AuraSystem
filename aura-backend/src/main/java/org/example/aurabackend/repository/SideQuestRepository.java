package org.example.aurabackend.repository;

import java.util.List;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.enumeration.Emotion;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SideQuestRepository extends JpaRepository<SideQuest, Long>, JpaSpecificationExecutor<SideQuest>{
    
    List<SideQuest> findByEmotion(Emotion emotion);
}
