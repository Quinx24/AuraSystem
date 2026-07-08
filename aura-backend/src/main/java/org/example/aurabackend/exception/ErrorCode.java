package org.example.aurabackend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter // Tác dụng tự động tạo các phương thức getter cho tất cả các trường của enum
@RequiredArgsConstructor // Tác dụng tự động tạo constructor cho enum với tất cả các trường được khai báo là final
public enum ErrorCode {

    JOURNAL_ENTRY_NOT_FOUND(1001, "Journal entry not found"), // Trường dữ liệu của enum, mỗi giá trị của enum sẽ có một mã lỗi và một thông điệp lỗi tương ứng

    TAG_NOT_FOUND(1002, "Tag not found"),

    TAG_ALREADY_EXISTED(1003, "Tag already existed"),

    SIDE_QUEST_NOT_EXISTED(1004, "Side-quest not existed"),

    SIDE_QUEST_ALREADY_ADDED(1005, "Side-quest already added"),

    EMAIL_ALREADY_EXISTS(1006, "Email already exists"),

    EMAIL_NOT_FOUND(1007, "Email not found"),

    INVALID_PASSWORD(1008, "Invalid password"),

    REFRESH_TOKEN_NOT_FOUND(1009, "Refresh token not found"),

    INVALID_REFRESH_TOKEN(1010, "Invalid refresh token"),

    REFRESH_TOKEN_EXPIRED(1011, "Refresh token expired"),

    USER_SIDE_QUEST_NOT_EXISTED(1012, "User side-quest not existed"),

    USER_SIDE_QUEST_ALREADY_COMPLETED(1013, "User side-quest already completed"),

    UNAUTHORIZED(1014, "You are not allowed to access this resource"),

    STREAK_NOT_FOUND(1015, "Streak not found"),

    USER_NOT_FOUND(1016, "User not found"),

    NEW_PASSWORD_MUST_BE_DIFFERENT(1017, "New password must be different from current password"),

    INSPIRATION_PROMPT_NOT_FOUND(1018, "Inspiration prompt not found");

    private final int code; // Mã lỗi, được sử dụng để xác định loại lỗi cụ thể
    private final String message; // Thông điệp lỗi, cung cấp mô tả chi tiết về lỗi để người dùng hoặc nhà phát triển có thể hiểu được vấn đề đã xảy ra
}
