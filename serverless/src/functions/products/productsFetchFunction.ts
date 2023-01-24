import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler, } from "aws-lambda";
import { ProductRepository } from './layers/productRepository';

const productsDdb = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient()

const productRepository = new ProductRepository(ddbClient, productsDdb)

export const handler: APIGatewayProxyHandler = async (event) =>{

   // const lambdaRequestId = context.awsRequestId
   const apiRequestId = event.requestContext.requestId

   // console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`)
   
   const method = event.httpMethod
   if (event.resource === "/products") {
      if (method === 'GET') {
         console.log('GET /products')

         const products = await productRepository.getAllProducts()

         return {
            statusCode: 200,
            body: JSON.stringify(products)
         }
      }
   } else if (event.resource === "/products/{id}") {
      const productId = event.pathParameters!.id as string
      console.log(`GET /products/${productId}`)

      try {
         const product = await productRepository.getProductById(productId)
         return {
            statusCode: 200,
            body: JSON.stringify(product)
         }   
      } catch (error) {
         console.error((<Error>error).message)
         return {
            statusCode: 404,
            body: (<Error>error).message
         }
      }
   }

   return {
      statusCode: 400,
      body: JSON.stringify({
         message: "Bad request"
      })
   }
}