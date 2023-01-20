import * as lambda from "aws-cdk-lib/aws-lambda"
import * as cdk from 'aws-cdk-lib'
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apiGateway from 'aws-cdk-lib/aws-apigateway'
import * as cwlogs from 'aws-cdk-lib/aws-logs'
import { Construct } from "constructs"

interface ECommerceApiStackProps extends cdk.StackProps {
  productsFetchHandler: lambdaNodeJS.NodejsFunction
  productsAdminHandler: lambdaNodeJS.NodejsFunction
}

export class ECommerceApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
    super(scope, id, props)

    const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs")
    const api = new apiGateway.RestApi(this, 'ECommerceApi', {
      restApiName: 'ECommerceApi',
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apiGateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apiGateway.AccessLogFormat.jsonWithStandardFields({
          ip: true, 
          user: true,
          caller: true,
          status: true,
          protocol: true, 
          httpMethod: true,
          requestTime: true, 
          resourcePath: true, 
          responseLength: true,
        })
      }
    })

    // Criando a integração para o método
    // Produto
    const productsFetchIntegration = new apiGateway.LambdaIntegration(props.productsFetchHandler);
  
    // REST ROUTES 
    // "/products"
    const productsResource = api.root.addResource("products")
    productsResource.addMethod("GET", productsFetchIntegration)


    // GET  /products/{id}
    const productIdResource = productsResource.addResource('{id}')
    productIdResource.addMethod("GET", productsFetchIntegration)

    // Admin de Produto
    const productsAdminIntegration = new apiGateway.LambdaIntegration(props.productsAdminHandler)

      // POST /products
      productsResource.addMethod("POST", productsAdminIntegration)

      // PUT /products/{id}
      productIdResource.addMethod("PUT", productsAdminIntegration)

      // DELETE /products/{id}
      productIdResource.addMethod("DELETE", productsAdminIntegration)

  }
}