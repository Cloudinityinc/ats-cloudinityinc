import json
import boto3
from botocore.exceptions import ClientError
import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ats-cloudinity-table') 

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))  # Log the event for debugging

    try:
        # Handle different potential event structures
        if 'body' in event:
            request_body = json.loads(event['body'])
        else:
            request_body = event    

       # Validate required fields
        if not request_body.get('ReqId'):
            raise ValueError('Missing required field: reqId')

        if not request_body.get('FullName'):
            raise ValueError('Missing required field: fullName')

        current_date = datetime.datetime.now().strftime("%Y-%m-%d") 

        # Map form fields to DynamoDB attributes with type checks and defaults
        item = {
            'ReqId': int(request_body.get('ReqId')),  
            'FullName': request_body.get('FullName'),
            'BillRate': request_body.get('BillRate'),  
            'BillRateMargin': request_body.get('BillRateMargin'),  
            'CandidateCurrentLocation': request_body.get('CandidateCurrentLocation'),
            'CandidatePayRate': request_body.get('CandidatePayRate'), 
            'ContactNumber': request_body.get('ContactNumber'),
            'ContractType': request_body.get('ContractType'),
            'DOB': request_body.get('DOB'),  
            'EmailId': request_body.get('EmailId'),
            'EmployerInformation': request_body.get('EmployerInformation'),
            'FormattedBy': request_body.get('FormattedBy'),
            'ImmigrationStatus': request_body.get('ImmigrationStatus'),
            'LinkedInID': request_body.get('LinkedInID'),
            'ProfessionalReferences': request_body.get('ProfessionalReferences'),
            'RecruiterName': request_body.get('RecruiterName'),
            'ReqCreationDate': request_body.get('ReqCreationDate'), 
            'ReqSkills': request_body.get('ReqSkills'),
            'ReqSubmissionEndDate': request_body.get('ReqSubmissionEndDate'), 
            'ReqTitle': request_body.get('ReqTitle'),
            'ResumeFormattingNeeded': request_body.get('ResumeFormattingNeeded'),  
            'ResumeSource': request_body.get('ResumeSource'),
            'Role': request_body.get('Role'),
            'State': request_body.get('State'),
            'SubmissionDate': request_body.get('SubmissionDate'), 
            'SubmissionStatus': request_body.get('SubmissionStatus'),
            'VenderRate': request_body.get('VenderRate'), 
            'VendorID': request_body.get('VendorID'), 
            'Date': current_date
        }

        # Put item into DynamoDB table
        response = table.put_item(Item=item)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Item added successfully'}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        }

    except (ValueError, ClientError) as e:
        return {
            'statusCode': 400 if isinstance(e, ValueError) else 500,
            'body': json.dumps({'message': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        }

