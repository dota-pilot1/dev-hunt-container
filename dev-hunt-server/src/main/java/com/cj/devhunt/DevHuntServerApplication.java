package com.cj.devhunt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class DevHuntServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(DevHuntServerApplication.class, args);
	}

}
