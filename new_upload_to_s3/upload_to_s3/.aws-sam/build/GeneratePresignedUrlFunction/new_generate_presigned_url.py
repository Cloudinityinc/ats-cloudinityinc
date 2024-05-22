import boto3

def lambda_handler(event, context):
    # Check if the file name is provided in the request body
    if 'fileName' not in event['body']:
        return {
            'statusCode': 400,
            'body': 'File name is missing in the request body'
        }
    
    # Retrieve the file name from the request body
    file_name = event['body']['fileName']

    # Initialize S3 client
    s3 = boto3.client('s3')

    # S3 Bucket
    bucket_name = 'ats-cloudinityinc'

    # Generate pre-signed URL
    try:
        presigned_url = s3.generate_presigned_url('get_object',
                                                  Params={'Bucket': bucket_name, 'Key': file_name},
                                                  ExpiresIn=3600)  # URL expires in 1 hour
        print(f"Pre-Signed URL: {presigned_url}")
        return {
            'statusCode': 200,
            'body': {'presigned_url': presigned_url}
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': "Error generating pre-signed URL"
        }



# import boto3

# def lambda_handler(event, context):
#     # Initialize S3 client
#     s3 = boto3.client('s3')

#     # S3 Bucket and Object name
#     bucketName = 'ats-cloudinityinc'
#     fileName = 'Praateek-Resume.pdf'

#     # Generate pre-signed URL
#     try:
#         presigned_url = s3.generate_presigned_url('get_object',
#                                                   Params={'Bucket': bucketName, 'Key': fileName},
#                                                   ExpiresIn=3600)  # URL expires in 1 hour
#         print(f"Pre-Signed URL: {presigned_url}")
#         return {
#             'statusCode': 200,
#             'body': f"Pre-Signed URL generated: {presigned_url}"
#         }
#     except Exception as e:
#         print(e)
#         return {
#             'statusCode': 500,
#             'body': "Error generating pre-signed URL"
#         }
