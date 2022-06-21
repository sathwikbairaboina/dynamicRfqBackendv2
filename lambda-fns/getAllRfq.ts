const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getAllRfq() {
    const params = {
        TableName: process.env.NOTES_TABLE,
        FilterExpression: "#type = :type_val",
        ExpressionAttributeNames: {
            "#type": "type",
        },
        ExpressionAttributeValues: { ":type_val": 'rfq' }
    }
    try {
        const data = await docClient.scan(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default getAllRfq;