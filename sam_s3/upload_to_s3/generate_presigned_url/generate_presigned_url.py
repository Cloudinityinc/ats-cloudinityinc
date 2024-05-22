import boto3
import json

def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    bucket_name = 'ats-cloudinityinc'
    file_name = event['queryStringParameters']['filename']  # Expect the filename in the query string parameter
    
    try:
        # Generate a presigned URL for the S3 object
        presigned_url = s3_client.generate_presigned_url('get_object',
                                                         Params={'Bucket': bucket_name,
                                                                 'Key': file_name},
                                                         ExpiresIn=3600)  # Link expires in 1 hour
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Adjust in production
            },
            'body': json.dumps({'url': presigned_url})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
