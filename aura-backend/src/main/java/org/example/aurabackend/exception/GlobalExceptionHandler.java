package org.example.aurabackend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.example.aurabackend.dto.response.ApiResponse;

@RestControllerAdvice //Làm cho class này trở thành một global exception handler, có thể xử lý các exception được ném ra từ bất kỳ controller nào trong ứng dụng.
public class GlobalExceptionHandler {
    
@ExceptionHandler(AppException.class)
public ResponseEntity<ApiResponse<?>> handleAppException(AppException ex) {

    ApiResponse<?> response = ApiResponse.builder()
            .code(ex.getErrorCode().getCode())
            .message(ex.getErrorCode().getMessage())
            .build();

        return ResponseEntity
            .badRequest()
            .body(response);
    }

    @ExceptionHandler(Exception.class) //Khi một exception nào đó không phải là AppException được ném ra, phương thức này sẽ được gọi để xử lý exception đó.
    public ApiResponse<?> handleGenericException(Exception ex) {
        return ApiResponse.builder()
                .code(9999)
                .message(ex.getMessage())
                .build();
    }
}
