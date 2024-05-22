import boto3
import base64
from botocore.exceptions import ClientError
import logging
import json
import re  # Importing the 're' module for regular expression operations

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def is_base64(sb):
    try:
        if isinstance(sb, str):
            # Check if there are only base64 characters
            if not re.match('^[A-Za-z0-9+/]+={0,2}$', sb):
                return False
            # Try to decode
            sb_bytes = bytes(sb, 'ascii')
            base64.b64decode(sb_bytes)
            return True
        elif isinstance(sb, bytes):
            # Try to encode and decode
            return base64.b64encode(base64.b64decode(sb)) == sb
        else:
            raise ValueError("Argument must be string or bytes")
    except Exception:
        return False

def lambda_handler(event, context):
    # Log the received event
    logger.info('Received event: %s', json.dumps(event))
    s3_client = boto3.client('s3')
    bucket_name = 'ats-cloudinityinc'  

    try:
        # Get file content from the request
        file_content = event['body']
        if event.get('isBase64Encoded', False) and is_base64(file_content):
            file_content = base64.b64decode(file_content)
        else:
            # Log for non-base64 content
            logger.info('Body content is not base64 encoded')
        file_path = event['pathParameters']['filename']

        # Upload the file to S3
        s3_client.put_object(Bucket=bucket_name, Key=file_path, Body=file_content)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust in production
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS, POST',
            },
            'body': json.dumps({'message': 'File uploaded successfully'})
        }
    except ClientError as e:
        logger.error(f'Error uploading the file: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust in production
            },
            'body': json.dumps({'error': f'Error uploading the file: {str(e)}'})
        }
    except Exception as e:
        logger.error(f'Unexpected error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust in production
            },
            'body': json.dumps({'error': f'Unexpected error: {str(e)}'})
        }




