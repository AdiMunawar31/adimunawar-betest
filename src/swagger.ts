import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';

import App from '@app';

function initSwagger(server: App) {
  const schemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: classTransformerDefaultMetadataStorage,
    refPointerPrefix: '#/components/schemas/',
  });
  const routingControllersOptions = {
    controllers: server.getControllers,
    routePrefix: '/api',
  };
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, routingControllersOptions, {
    components: {
      schemas,
      securitySchemes: {
        basicAuth: {
          scheme: 'basic',
          type: 'http',
        },
      },
    },
    info: {
      description: 'Microservices Beckend Test (NodeJs Express) - Adi Munawar',
      title: 'BETEST ADI MUNAWAR API',
      version: '1.0.0',
    },
  });
  server.getServer().use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
}

export { initSwagger };
