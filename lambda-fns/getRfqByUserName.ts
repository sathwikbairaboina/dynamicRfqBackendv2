const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getRfqByUserName(userName: string) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        FilterExpression: "#type = :type_val AND  #userName = :user_val",
        ExpressionAttributeNames: {
            "#type": "type",
            "#userName": "userName"
        },
        ExpressionAttributeValues: { ":type_val": 'rfq' , ":user_val":userName}
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


export default getRfqByUserName;