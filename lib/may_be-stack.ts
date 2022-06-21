import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
// import * as sqs from '@aws-cdk/aws-sqs';

export class RfqOrderStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
   super(scope, id, props);

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'cdk-order-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/dynamicrfq.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
     value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });

    // lib/appsync-cdk-app-stack.ts
    const notesLambda = new lambda.Function(this, 'AppSyncNotesHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024
    });

    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', notesLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getRfqById"
    });

     lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getRfqByUserName"
    });


    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getServiceById"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getAllRfq"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getAllServices"
    });    

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createOrUpdateRfq"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createOrUpdateService"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteRfq"
    });

    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteService"
    });
    

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getRfqByService"
    });

    const notesTable = new ddb.Table(this, 'FinalCDKNotesTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
      sortKey: { name: 'type', type: ddb.AttributeType.STRING,},
    });

    notesTable.addGlobalSecondaryIndex({
      indexName: 'record',
      partitionKey: { name: 'id', type: ddb.AttributeType.STRING },
      sortKey: { name: 'type', type: ddb.AttributeType.STRING },
    });

    // enable the Lambda function to access the DynamoDB table (using IAM)
    notesTable.grantFullAccess(notesLambda)

    // Create an environment variable that we will use in the function code
    notesLambda.addEnvironment('NOTES_TABLE', notesTable.tableName);



  }
}
