const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteService(id: string) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: {
          id: id,
        }
    }
    try {
        await docClient.delete(params).promise()
        return id
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteService;