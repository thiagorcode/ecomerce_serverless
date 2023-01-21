import { APIGatewayProxyHandler, } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) =>{

   // const lambdaRequestId = event.awsRequestId
   const apiRequestId = event.requestContext.requestId

   console.log(`API Gateway RequestId: ${apiRequestId} `)
   
   const method = event.httpMethod
   if (event.resource === "/products") {
      if (method === 'GET') {
         console.log('GET')

         return {
            statusCode: 200,
            body: JSON.stringify({
               message: "GET Products - OK"               
            })
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