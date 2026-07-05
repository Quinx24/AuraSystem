package org.example.aurabackend.repository;

import java.time.LocalDate;
import java.util.List;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserSideQuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSideQuestRepository extends JpaRepository<UserSideQuest, Long> {

    boolean existsByUserAndSideQuest(
            User user,
            SideQuest sideQuest
    );

    List<UserSideQuest> findByUserAndAssignedDateAndCompleted(
            User user,
            LocalDate assignedDate,
            boolean completed
    );

    List<UserSideQuest> findByUser(User user);

    List<UserSideQuest> findByUserAndCompleted(
        User user, 
        boolean completed
    );
}
