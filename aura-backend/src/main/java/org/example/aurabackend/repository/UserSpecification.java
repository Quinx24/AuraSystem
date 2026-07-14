package org.example.aurabackend.repository;

import org.example.aurabackend.entity.User;
import org.example.aurabackend.enumeration.Role;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecification {

    private UserSpecification() {
    }

    public static Specification<User> containsKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String value = "%" + keyword.trim().toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), value),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), value));
        };
    }

    public static Specification<User> hasRole(Role role) {
        return (root, query, criteriaBuilder) -> role == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("role"), role);
    }

    public static Specification<User> hasLocked(Boolean locked) {
        return (root, query, criteriaBuilder) -> locked == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("locked"), locked);
    }
}
