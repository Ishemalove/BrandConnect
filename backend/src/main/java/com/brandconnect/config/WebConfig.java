package com.brandconnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get the absolute path to the uploads directory
        Path uploadsDir = Paths.get("uploads");
        String uploadsAbsolutePath = uploadsDir.toFile().getAbsolutePath();

        // Configure resource handler for uploaded files
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsAbsolutePath + "/")
                .setCachePeriod(3600) // Cache for 1 hour
                .resourceChain(true);
    }
} 