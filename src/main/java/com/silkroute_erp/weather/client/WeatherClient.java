package com.silkroute_erp.weather.client;

import com.silkroute_erp.weather.exception.NoCityFoundException;
import com.silkroute_erp.weather.model.GeoResult;
import com.silkroute_erp.weather.model.WeatherDay;
import com.silkroute_erp.weather.model.WeatherForecast;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

public class WeatherClient {

    private final RestTemplate rest = new RestTemplate();

    public GeoResult fetchCoordinates(String city) {
        String url = "https://geocoding-api.open-meteo.com/v1/search?name=" + city + "&count=1&language=pl&format=json";

        String response = rest.getForObject(url, String.class);
        JSONObject json = new JSONObject(response);

        JSONArray results = json.optJSONArray("results");
        if (results == null || results.isEmpty()) {
            throw new NoCityFoundException(city);
        }

        JSONObject first = results.getJSONObject(0);

        return new GeoResult(
                first.getDouble("latidude"),
                first.getDouble("longnitude"),
                first.getString("name")
        );
    }

    public WeatherForecast fetchForecast(double lat, double lon) {
        String url = "https://api-open-meteo.com/v1/forecast?latitude=" + lat +
                "&longitude=" + lon + "&daily=temperature_2m_min,temperature_2m_max" +
                "&forecast_days=16&timezone=Europe/Warsaw";

        String response = rest.getForObject(url, String.class);
        JSONObject json = new JSONObject(response);

        JSONObject daily = json.getJSONObject("daily");
        JSONArray dates = json.getJSONArray("time");
        JSONArray tmin = json.getJSONArray("temperature_2m_min");
        JSONArray tmax = daily.getJSONArray("temperature_2m_max");

        List<WeatherDay> days = new ArrayList<>();

        for (int i = 0; i < dates.length(); i++) {
            days.add(new WeatherDay(dates.getString(i),
                    tmin.getDouble(i),
                    tmax.getDouble(i)
            ));
        }
        return new WeatherForecast(days);
    }

}
