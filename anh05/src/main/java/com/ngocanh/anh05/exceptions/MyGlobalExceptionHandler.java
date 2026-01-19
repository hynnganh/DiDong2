package com.ngocanh.anh05.exceptions;

import java.util.HashMap;
import java.util.Map;

import javax.naming.AuthenticationException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.ngocanh.anh05.payloads.APIResponse;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class MyGlobalExceptionHandler {

    // ===== Resource Not Found =====
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse> myResourceNotFoundException(
            ResourceNotFoundException exception) {

        String message = exception.getMessage();

        APIResponse res = new APIResponse(message, false);

        return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
    }

    // ===== API Exception =====
    @ExceptionHandler(APIException.class)
    public ResponseEntity<APIResponse> myAPIException(APIException exception) {

        String message = exception.getMessage();

        APIResponse res = new APIResponse(message, false);

        return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
    }

    // ===== Method Argument Validation =====
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException exception) {

        Map<String, String> res = new HashMap<>();

        exception.getBindingResult().getAllErrors().forEach(err -> {
            String fieldName = ((FieldError) err).getField();
            String message = err.getDefaultMessage();
            res.put(fieldName, message);
        });

        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    // ===== Constraint Validation =====
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(
            ConstraintViolationException exception) {

        Map<String, String> res = new HashMap<>();

        exception.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            res.put(fieldName, message);
        });

        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> myAuthenticationException(AuthenticationException e) {
        String res = e.getMessage();
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingPathVariableException.class)
    public ResponseEntity<APIResponse> myMissingPathVariableException(MissingPathVariableException e) {
        APIResponse res = new APIResponse(e.getMessage(), false);
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<APIResponse> myDataIntegrityException(DataIntegrityViolationException e) {
        APIResponse res = new APIResponse(e.getMessage(), false);
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }     
}
