import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'serverless-ecommerce',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline' ],
  provider: {
    name: 'aws',
    region: 'sa-east-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"]
      },
   
    ]
  },
  // import the function via paths
  functions: {
    productsAdmin: {
      handler: "src/functions/products/productsAdminFunction.handler",
      events: [
        {
          http: {
            path: 'product',
            method: 'post',
            // cors: true,
          }
        }
      ]
    },
    productFetch: {
      handler: "src/functions/products/productsFetchFunction.handler",
      events: [
        {
          http: {
            path: 'product',
            method: 'get',
            // cors: true,
          }
        }
      ]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
