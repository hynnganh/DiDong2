package com.ngocanh.anh05.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.ExternalDocumentation;
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI springShopOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("E-Commerce Application API")
                .description("Backend APIs for E-Commerce Application")
                .version("v1.0.0")
                .contact(new Contact()
                    .name("Ngoc Anh")
                    .url("huynhthingocanh2008@gmail.com")
                    .email("huynhthingocanh2008@gmail.com"))
                .license(new License()
                    .name("License")
                    .url("/"))
            )
            .externalDocs(new ExternalDocumentation()
                .description("E-Commerce App Documentation")
                .url("http://localhost:8080/swagger-ui/index.html"));
    }
}

