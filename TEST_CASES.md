# CSV Upload Mini-App - Test Cases

This document describes the various sample CSV files provided for testing the application.

## 📁 Sample Files Overview

| File                                    | Purpose                 | Valid Records | Invalid Records | Test Focus                |
| --------------------------------------- | ----------------------- | ------------- | --------------- | ------------------------- |
| `__mocks__/sample-valid-users.csv`      | All valid data          | 10            | 0               | Successful uploads        |
| `__mocks__/sample-invalid-users.csv`    | All invalid data        | 0             | 10              | Error handling            |
| `__mocks__/sample-mixed-users.csv`      | Mixed valid/invalid     | 5             | 5               | Partial success           |
| `__mocks__/sample-duplicate-emails.csv` | Duplicate emails        | 3             | 5               | Duplicate validation      |
| `__mocks__/sample-missing-fields.csv`   | Missing required fields | 1             | 6               | Required field validation |
| `__mocks__/sample-edge-cases.csv`       | Boundary conditions     | 4             | 6               | Edge case handling        |

## 🧪 Detailed Test Cases

### 1. `sample-valid-users.csv` - All Valid Data

**Expected Result**: All 10 users should be successfully uploaded

- Tests: Basic functionality, successful validation
- Use Case: Normal operation testing

### 2. `sample-invalid-users.csv` - All Invalid Data

**Expected Errors**:

- **Row 1**: Underage user (Bob, 2005 birthdate)
- **Row 2**: Invalid phone number format
- **Row 3**: Underage user (Eve, 2010 birthdate)
- **Row 4**: Phone number too long (16 digits)
- **Row 5**: Invalid phone format (contains hyphens)
- **Row 6**: Invalid email format
- **Row 7**: Underage user (Helen, 2008 birthdate)
- **Row 8**: Phone number too short (3 digits)
- **Row 9**: Invalid phone format (contains letters)
- **Row 10**: Phone number too long (15 digits)

### 3. `sample-mixed-users.csv` - Mixed Valid/Invalid

**Expected Result**: 5 valid, 5 invalid

- **Valid**: John, Jane, Alice, Frank, Grace
- **Invalid**: Bob (underage), Diana (invalid phone), Eve (underage), Charlie (phone too long), Fiona (invalid phone format)

### 4. `sample-duplicate-emails.csv` - Duplicate Email Addresses

**Expected Errors**:

- **Row 3**: Duplicate email (john.doe@example.com)
- **Row 5**: Duplicate email (jane.smith@example.com)
- **Row 7**: Duplicate email (alice.brown@example.com)

### 5. `sample-missing-fields.csv` - Missing Required Fields

**Expected Errors**:

- **Row 2**: Missing last_name
- **Row 3**: Missing email
- **Row 4**: Missing birthdate
- **Row 5**: Missing phone_number
- **Row 6**: Missing first_name
- **Row 7**: Missing phone_number

### 6. `sample-edge-cases.csv` - Boundary Conditions

**Expected Errors**:

- **Row 1**: Underage user (2010 birthdate)
- **Row 3**: Phone number too long (15 digits)
- **Row 4**: Underage user (2011 birthdate)
- **Row 5**: Phone number too long (16 digits)
- **Row 6**: Phone number too short (6 digits)
- **Row 7**: Underage user (2010 birthdate)

## 🎯 Testing Scenarios

### Scenario 1: Happy Path

1. Upload `sample-valid-users.csv`
2. Verify all users appear in "Valid Users" table
3. Test "Download CSV" functionality
4. Verify no errors in "Invalid Users" section

### Scenario 2: Error Handling

1. Upload `sample-invalid-users.csv`
2. Verify all users appear in "Invalid Users" section
3. Check error messages are descriptive
4. Test inline editing functionality

### Scenario 3: Partial Success

1. Upload `sample-mixed-users.csv`
2. Verify 5 users in "Valid Users" table
3. Verify 5 users in "Invalid Users" section
4. Test fixing invalid records one by one

### Scenario 4: Duplicate Detection

1. Upload `sample-duplicate-emails.csv`
2. Verify duplicate emails are flagged
3. Test that only first occurrence is valid
4. Verify error messages mention duplicates

### Scenario 5: Required Fields

1. Upload `sample-missing-fields.csv`
2. Verify missing fields are flagged
3. Test inline editing to add missing data
4. Verify validation works after fixes

### Scenario 6: Edge Cases

1. Upload `sample-edge-cases.csv`
2. Verify boundary conditions are handled
3. Test age validation (13+ requirement)
4. Test phone number length limits

## 🔧 Dry Run Testing

For each test case, also test with "Dry Run" mode enabled:

1. Check the checkbox before uploading
2. Verify no data is actually saved
3. Verify validation still works correctly
4. Verify you can still download results

## 📊 Expected Validation Rules

### Age Validation

- Users must be 13+ years old
- Birthdate must be in ISO format (YYYY-MM-DD)

### Email Validation

- Must be valid email format
- Must be unique across all users
- Must be unique within the same upload

### Phone Validation

- Must be 7-15 digits
- Optional + prefix allowed
- No spaces, hyphens, or special characters

### Required Fields

- All fields are required
- Empty or missing fields cause validation errors

## 🚀 Performance Testing

For large files, test with:

- 100+ valid records
- 100+ invalid records
- Mixed large datasets
- Verify upload time and memory usage

## 🐛 Error Recovery Testing

1. Upload invalid file
2. Fix errors inline
3. Revalidate individual records
4. Verify fixed records move to valid section
5. Test download after fixes
