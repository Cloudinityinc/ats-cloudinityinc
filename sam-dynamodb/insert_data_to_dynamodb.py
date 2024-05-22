# import boto3
# import pandas as pd

# print("Script started...")

# # Load the Excel file
# excel_file_path = "C:/Users/Admin/Documents/Code/sam-dynamodb/sample_date.xlsx"
# print(f"Loading Excel file from {excel_file_path}")
# df = pd.read_excel(excel_file_path)

# print(f"Excel file loaded. Number of rows to process: {len(df)}")

# # Initialize a DynamoDB client
# print("Initializing DynamoDB client...")
# dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
# table = dynamodb.Table('ats-cloudinity-table')
# print(f"DynamoDB client initialized. Table name: {table.name}")

# # Helper function to convert data types
# def convert_dtype(val):
#     if pd.isna(val):
#         return None  # DynamoDB doesn't store None values, they are omitted
#     if isinstance(val, (int, float)):
#         return str(val)  # Convert numbers to strings
#     if isinstance(val, pd.Timestamp):
#         return val.isoformat()  # Convert timestamps to ISO format
#     return val

# # Iterate through each row in the dataframe and add it to DynamoDB
# # ...
# # ...
# for index, row in df.iterrows():
#     try:
#         # Construct an item with all columns
#         item = {col: convert_dtype(row[col]) for col in df.columns}

#         # Ensure 'ReqId' and 'FullName' are present and correctly named
#         if 'Req Id' not in df.columns or 'Full Name' not in df.columns:
#             raise ValueError(f"Required columns 'Req Id' or 'Full Name' are missing in the Excel file")

#         # Rename columns to match DynamoDB attribute names
#         # Convert 'Req Id' to a number, as DynamoDB expects 'ReqId' to be a number
#         item['ReqId'] = int(row['Req Id']) if not pd.isna(row['Req Id']) else None
#         item['FullName'] = item.pop('Full Name')

#         # Remove 'Req Id' and 'Full Name' from the item as they are now renamed
#         item.pop('Req Id', None)
#         item.pop('Full Name', None)

#         # Put the item into the DynamoDB table
#         response = table.put_item(Item=item)
#         print(f"Successfully inserted item: {index+1}")
#     except Exception as e:
#         print(f"Error inserting item at row {index+1}: {e}")
# # ...


# print("Script completed.")




import boto3
import pandas as pd

print("Script started...")

# Load the Excel file
excel_file_path = "C:/Users/Admin/Documents/Code/sam-dynamodb/sample_date.xlsx"
print(f"Loading Excel file from {excel_file_path}")
df = pd.read_excel(excel_file_path)

print(f"Excel file loaded. Number of rows to process: {len(df)}")

# Initialize a DynamoDB client
print("Initializing DynamoDB client...")
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('ats-cloudinity-table')
print(f"DynamoDB client initialized. Table name: {table.name}")

# Define your column mappings here
# Format: 'Excel Column Name': ('DynamoDB Attribute Name', 'Data Type')
column_mappings = {
    'Req Id': ('ReqId', 'N'),  # 'N' for number
    'Full Name': ('FullName', 'S'),  # 'S' for string
    'BillRate Margin':  ('BillRateMargin', 'N'),  
    'Candidate Current Location':  ('CandidateCurrentLocation', 'S'),
    'Candidate Pay Rate $$':  ('CandidatePayRate', 'N'), 
    'Contact Number':  ('ContactNumber','S'),
    'Contract Type':  ('ContractType','S'),
    'DOB (MM/DD)':  ('DOB','S'),  
    'Email Id':  ('EmailId','S'),
    'Employer Information':  ('EmployerInformation','S'),
    'Formatted By':  ('FormattedBy','S'),
    'Immigration Status':  ('ImmigrationStatus','S'),
    'LinkedIn ID':  ('LinkedInID','S'),
    'Professional References':  ('ProfessionalReferences','S'),
    'Recruiter Name':  ('RecruiterName','S'),
    'Req Creation Date':  ('ReqCreationDate','S'), 
    'Req Skills':  ('ReqSkills','S'),
    'Req Submission End date':  ('ReqSubmissionEndDate','S'), 
    'Req Title':  ('ReqTitle','S'),
    'Resume Formatting Needed?':  ('ResumeFormattingNeeded','S'),  
    'ResumeSource (LinkedIn/Corp/BenchSales)':  ('ResumeSource','S'),
    'Role':  ('Role','S'),
    'State':  ('State','S'),
    'Submission Date':  ('SubmissionDate','S'), 
    'Submission Status':  ('SubmissionStatus','S'),
    'Vender Rate $$':  ('VendorRate','S'), 
    'Vendor ID':  ('VendorID','S'), 
    # Add more mappings as needed
    # 'ExcelColumnName': ('DynamoDBAttributeName', 'Data Type')
}

def convert_dtype(val, data_type):
    """Convert data type based on the specified DynamoDB data type."""
    if pd.isna(val):
        return None  # DynamoDB doesn't store None values, they are omitted
    if data_type == 'N':
        return int(val) if not pd.isna(val) else None
    elif data_type == 'S':
        return str(val)
    elif data_type == 'BOOL':
        return bool(val)
    # Add more data type conversions as needed
    return val

for index, row in df.iterrows():
    item = {}
    for col, (ddb_attr, data_type) in column_mappings.items():
        if col in df.columns:
            item[ddb_attr] = convert_dtype(row[col], data_type)
        else:
            print(f"Warning: Column '{col}' not found in Excel file.")

    try:
        # Put the item into the DynamoDB table
        response = table.put_item(Item=item)
        print(f"Successfully inserted item: {index+1}")
    except Exception as e:
        print(f"Error inserting item at row {index+1}: {e}")

print("Script completed.")
