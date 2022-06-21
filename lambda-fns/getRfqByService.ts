
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getRfqByService(id: string) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        FilterExpression: "#type = :type_val AND  #serviceId = :user_val",
        ExpressionAttributeNames: {
            "#type": "type",
            "#serviceId": "serviceId"
        },
        ExpressionAttributeValues: { ":type_val": 'rfq' , ":user_val":id}
    }
    try {
        const data = await docClient.scan(params).promise()
        console.log('DynamoDB data: ', data)
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}


export default getRfqByService;