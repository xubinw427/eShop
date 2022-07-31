package com.xubin.ecommerce.config;

import com.xubin.ecommerce.entity.Country;
import com.xubin.ecommerce.entity.Product;
import com.xubin.ecommerce.entity.ProductCategory;
import com.xubin.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;
    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
        HttpMethod[] theUnsupportedActions = {HttpMethod.POST, HttpMethod.PUT,
                                                HttpMethod.DELETE, HttpMethod.PATCH};
        // disable the http methods for Products
        disableHttpMethods(Product.class, config, theUnsupportedActions);

        // disable the http methods for Product-Category
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

        // disable the http methods for Country
        disableHttpMethods(Country.class, config, theUnsupportedActions);

        // disable the http methods for State
        disableHttpMethods(State.class, config, theUnsupportedActions);
        // call an internal helper method
        exposeIds(config);

        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);

    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration().forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config){
        // expose entity ids
        //

        // -get a list of aall entity classes from the entity manger
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // -create an array of the entity types
        List<Class> entityClass = new ArrayList<>();

        // - get the entity types for the entities
        for (EntityType tempEntityType : entities) {
            entityClass.add(tempEntityType.getJavaType());
        }

        Class[] domainTypes = entityClass.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
