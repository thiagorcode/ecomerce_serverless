import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'serverless-ecommerce',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild', 
    'serverless-dynamodb-local', 
    'serverless-offline', 
    'serverless-plugin-tracing',
    'serverless-plugin-lambda-insights'
  ],
  provider: {
    name: 'aws',
    region: 'sa-east-1',
    runtime: 'nodejs14.x',
    tracing: {
      lambda:'Active',
      apiGateway: true
    },
    
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
      {
        Effect: "Allow",
        Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
        Resource: ["*"]
      }
    ]
  },
  // import the function via paths
  functions: {

    productsAdmin: {
      handler: "src/functions/products/productsAdminFunction.handler",
      tracing: 'Active',
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
      tracing: 'Active',
      
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
  // layers:{ 
  //   productRepository: {
  //     path: 'src/functions/products/layers/productRepository',
  //     name: 'productRepository'
  // }},
  package: { individually: true },
  useDotenv: true,
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
      lambdaInsights:{
        defaultLambdaInsights: true,
        attachPolicy: false ,
        lambdaInsightsVersion: 14
      }
    },
  },
  resources:{
    Resources: {
      dbUsersFile: {
        Type: "AWS::DynamoDB::Table",
        Properties:{
          TableName: "products",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: "HASH"
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
