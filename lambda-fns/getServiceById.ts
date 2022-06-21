import { type } from "os";

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getServiceById(id: string) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: { id: id , type:'service'}
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getServiceById