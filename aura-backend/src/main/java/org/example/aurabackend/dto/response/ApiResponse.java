package org.example.aurabackend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data //Tác dụng của @Data là tự động tạo ra các phương thức getter, setter, toString, equals và hashCode cho tất cả các trường trong lớp ApiResponse. Điều này giúp giảm bớt mã boilerplate và làm cho mã nguồn trở nên sạch sẽ hơn.
@Builder //Tác dụng của @Builder là cung cấp một cách dễ dàng để tạo ra các đối tượng của lớp ApiResponse bằng cách sử dụng builder pattern. Với @Builder, bạn có thể tạo ra một đối tượng ApiResponse bằng cách gọi các phương thức setter trên builder thay vì phải gọi constructor trực tiếp, giúp mã nguồn trở nên dễ đọc và dễ bảo trì hơn.
public class ApiResponse<T> {
    
    private int code;
    private String message;
    private T result;

    public static <T> ApiResponse<T> success(String message, T result) {
        return ApiResponse.<T>builder()
                .code(0)
                .message(message)
                .result(result)
                .build();
    }
}
