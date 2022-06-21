const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Rfq from './Rfq';
import {get} from 'lodash';
import getRfqById from'./getRfqById';

async function createOrUpdateRfq(rfq: Rfq) {


    try {
            let Item =  rfq;
            const {id} = rfq;
            let UpdatedItem ;

            if(!id){
                const tempId = new Date().valueOf().toString();
                Object.assign(Item, { id: tempId , type:'rfq' ,record:"rfq"});
            }else{
            const existingrfq = await getRfqById(id).catch((err)=>{throw err});
            console.log('DynamoDB existingrfq: ', existingrfq , Item); 
            // if(existingrfq){}  	
            UpdatedItem = {
                            ...existingrfq,
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
            return rfq;

            // const result = await docClient.update(params).promise();
            // return result;
        }
        catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
   
}

export default createOrUpdateRfq;
