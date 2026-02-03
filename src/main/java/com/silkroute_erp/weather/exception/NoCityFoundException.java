package com.silkroute_erp.weather.exception;

public class NoCityFoundException extends RuntimeException {
    public NoCityFoundException(String city) {
        super("Nie znaleziono miasta");
    }
}
