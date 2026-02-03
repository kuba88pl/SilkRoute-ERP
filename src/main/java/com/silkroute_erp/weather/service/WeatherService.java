package com.silkroute_erp.weather.service;

import com.silkroute_erp.weather.client.WeatherClient;
import com.silkroute_erp.weather.model.GeoResult;
import com.silkroute_erp.weather.model.WeatherForecast;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {
    private final WeatherClient weatherClient;

    public WeatherService(WeatherClient weatherClient) {
        this.weatherClient = weatherClient;
    }

    public WeatherForecast getForecastForCity(String city) {
        GeoResult geo = weatherClient.fetchCoordinates(city);

        return weatherClient.fetchForecast(geo.latitude(), geo.longnitude());
    }
}
