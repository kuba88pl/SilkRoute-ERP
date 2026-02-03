package com.silkroute_erp.weather.controller;

import com.silkroute_erp.weather.model.WeatherForecast;
import com.silkroute_erp.weather.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    public WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/api/weather")
    public WeatherForecast getForcast(@RequestParam String city){
        return weatherService.getForecastForCity(city);
    }
}
