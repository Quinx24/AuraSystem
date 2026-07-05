package org.example.aurabackend.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException { //Tạo một lớp ngoại lệ tùy chỉnh có tên AppException, kế thừa từ RuntimeException, cho phép chúng ta ném ra các lỗi cụ thể liên quan đến ứng dụng của chúng ta và cung cấp thông tin chi tiết về lỗi thông qua ErrorCode
    
    private final ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage()); //Gọi constructor của RuntimeException với thông điệp lỗi lấy từ ErrorCode, giúp đảm bảo rằng khi ngoại lệ này được ném ra, nó sẽ mang theo thông điệp lỗi chi tiết từ enum ErrorCode
        this.errorCode = errorCode; //Gán giá trị của errorCode cho trường errorCode của AppException, cho phép chúng ta truy cập mã lỗi và thông điệp lỗi thông qua đối tượng AppException khi nó được ném ra và xử lý trong GlobalExceptionHandler
    }

}
