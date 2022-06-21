const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import { Names } from '@aws-cdk/core';
import Service from './Service';
// import {get} from 'lodash';
import getServiceById from'./getServiceById';
// const {"v4": uuid} = require('uuid');
// type Params = {
//   TableName: string | undefined,
//   Key: string | {},
//   ExpressionAttributeValues: any,
//   ExpressionAttributeNames: any,
//   UpdateExpression: string,
//   ReturnValues: string
// }

async function createOrUpdateService(service: Service) {


    try {
            let Item =  service;
            const {id} = service;
            let UpdatedItem ;

            if(!id){
                const tempId = new Date().valueOf().toString();
                Object.assign(Item, { id: tempId , type:'service' ,record:"service"});
            }else{
            const existingService = await getServiceById(id).catch((err)=>{throw err});
            console.log('DynamoDB existingService: ', existingService , Item); 
            // if(existingService){}  	
            UpdatedItem = {
                            ...existingService,
                            ...Item
                            };
                        }                                       

            let params  = {
                TableName: process.env.NOTES_TABLE,
                Item: id ? UpdatedItem : Item,
            }; 
            console.log('DynamoDB params: ', params);

            const result = await docClient.put(params).promise();
            console.log('DynamoDB result create: ', result , params);
            return service;

            // const result = await docClient.update(params).promise();
            // return result;
        }
        catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
   
}

export default createOrUpdateService;