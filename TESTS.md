# Test Cases for URL Shortener API

This document outlines the test cases for the URL Shortener API. It includes both integration and unit tests for the URL redirection functionality and edge/error case handling. The tests are designed to validate various aspects of the API, ensuring correct behavior for valid requests, invalid requests, and error scenarios.

## Table of Contents

1. [URL Redirection Integration Tests](#url-redirection-integration-tests)
   - [Valid Shortened URL Redirection](#valid-shortened-url-redirection)
   - [Invalid Shortened URL](#invalid-shortened-url)
2. [URL Controller Unit Tests](#url-controller-unit-tests)
   - [Valid Short URL Redirection](#valid-short-url-redirection)
   - [Invalid Short URL](#invalid-short-url)
   - [Missing Short Code](#missing-short-code)
   - [Expired URL](#expired-url)
   - [Unexpected Errors](#unexpected-errors)

---

## URL Redirection Integration Tests

### Valid Shortened URL Redirection

- **Test Case ID**: URL-001
- **Endpoint**: `/mylink`
- **Method**: `GET`
- **Description**: Test that visiting a valid shortened URL redirects to the original URL.
- **Test Scenario**:
    1. Send a `GET` request to `/mylink`.
    2. Verify the response status is `302` (for redirection).
    3. Verify the `Location` header in the response points to the original URL: `https://www.geeksforgeeks.org/list-contains-method-in-java-with-examples/?ref=lbp`.
- **Expected Output**: The user is redirected to the original URL.

### Invalid Shortened URL

- **Test Case ID**: URL-002
- **Endpoint**: `/invalidCode`
- **Method**: `GET`
- **Description**: Test that an invalid shortened URL returns a 404 error.
- **Test Scenario**:
    1. Send a `GET` request to `/invalidCode`.
    2. Verify the response status is `404`.
    3. Verify the response body contains the error message: `{ "error": "URL not found" }`.
- **Expected Output**: A `404` error response with a message indicating that the URL was not found.

---

## URL Controller Unit Tests

### Valid Short URL Redirection

- **Test Case ID**: URLC-001
- **Endpoint**: `/api/urls/:code`
- **Method**: `GET`
- **Description**: Test that the controller correctly redirects a valid short code to the original URL.
- **Test Scenario**:
    1. Mock the `URL_Schema.findOneAndUpdate` method to return a valid URL with the short code `mylink`.
    2. Send a `GET` request to `/api/urls/mylink`.
    3. Verify the `redirect` function is called with the original URL: `https://www.geeksforgeeks.org/list-contains-method-in-java-with-examples/?ref=lbp`.
- **Expected Output**: The controller should redirect to the original URL.

### Invalid Short URL

- **Test Case ID**: URLC-002
- **Endpoint**: `/api/urls/:code`
- **Method**: `GET`
- **Description**: Test that the controller returns a 404 error if the short code does not exist.
- **Test Scenario**:
    1. Mock the `URL_Schema.findOneAndUpdate` method to return `null` for the short code `nonexistentcode`.
    2. Send a `GET` request to `/api/urls/nonexistentcode`.
    3. Verify the response status is `404`.
    4. Verify the response contains the error message: `{ "error": "URL not found" }`.
- **Expected Output**: A `404` error with the message "URL not found".

### Missing Short Code

- **Test Case ID**: URLC-003
- **Endpoint**: `/api/urls/:code`
- **Method**: `GET`
- **Description**: Test that the controller returns a 400 error if the short code is missing in the request.
- **Test Scenario**:
    1. Send a `GET` request with an empty `params` object.
    2. Verify the response status is `400`.
    3. Verify the response contains the error message: `{ "error": "Short code is required" }`.
- **Expected Output**: A `400` error with the message "Short code is required".

### Expired URL

- **Test Case ID**: URLC-004
- **Endpoint**: `/api/urls/:code`
- **Method**: `GET`
- **Description**: Test that the controller returns a 410 error if the URL has expired.
- **Test Scenario**:
    1. Mock the `URL_Schema.findOneAndUpdate` method to return an expired URL.
    2. Send a `GET` request to `/api/urls/expiredCode`.
    3. Verify the response status is `410`.
    4. Verify the response contains the error message: `{ "error": "URL has expired" }`.
- **Expected Output**: A `410` error indicating that the URL has expired.

### Unexpected Errors

- **Test Case ID**: URLC-005
- **Endpoint**: `/api/urls/:code`
- **Method**: `GET`
- **Description**: Test that the controller handles unexpected errors, such as database failures.
- **Test Scenario**:
    1. Mock the `URL_Schema.findOneAndUpdate` method to reject with an error.
    2. Send a `GET` request to `/api/urls/notValidCode`.
    3. Verify the response status is `500`.
    4. Verify the response contains the error message: `{ "error": "Internal Server Error" }`.
- **Expected Output**: A `500` error indicating an internal server error.

---

## Conclusion

These test cases validate the functionality of the URL Shortener API, covering both integration and unit tests. The integration tests check the redirection and error handling for valid and invalid short codes, while the unit tests validate the controller logic for various scenarios, including missing codes, expired URLs, and unexpected errors.
