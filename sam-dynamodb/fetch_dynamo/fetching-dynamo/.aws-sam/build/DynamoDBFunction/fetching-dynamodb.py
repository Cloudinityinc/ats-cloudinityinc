import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ats-cloudinity-table')


def decimal_default(obj):
    if isinstance(obj, Decimal):
        return str(obj)
    raise TypeError
    
def lambda_handler(event, context):
    try:
        
        response = table.scan() # Use scan or query based on your requirements
        items = response['Items']
        return {
            'statusCode': 200,
            'body': json.dumps(items, default=decimal_default),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' # Allow any domain to access
            }
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(e.response['Error']['Message']),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }