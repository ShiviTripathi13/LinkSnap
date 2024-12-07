# API Documentation


## URL Operations

### /api/urls/shorten
- **Method**: POST
- **Description**: Creates a new shortened URL.
- **Request Body**:
  ```json
  {
    "original_url": "http://example.com"
  }
- **Response**:
  ```json
  {
    "short_code": "abc123",
    "original_url": "http://example.com"
  }
### /api/urls
- **Method**: GET
- **Description**: Gets the list of all URLs with details.
- **Response**:
  ```json
  [
  {
    "short_code": "abc123",
    "original_url": "http://example.com"
  },
  {
    "short_code": "xyz456",
    "original_url": "http://anotherexample.com"
  }
  ]

### /api/urls/:code
- **Method**: GET
- **Description**: Retrieve details of a specific URL using its short code.
- **URL Parameter**: code (the shortened URL code)
- **Response**:
  ```json
  {
  "short_code": "abc123",
  "original_url": "http://example.com",
  "expirationDate": "2024-12-31T23:59:59.000Z"
  }

### /api/urls/:code
- **Method**: DELETE
- **Description**: Delete a URL based on its short code.
- **URL Parameter**: code (the shortened URL code)
- **Response**:
  ```json
  {
    "url": {
        "_id": "17y829u2326372682",
        "original_url": "https://example.com/problems/problem1/description/",
        "short_url": "http://localhost:8000/myshorturl",
        "short_code": "myshorturl",
        "clicks": 2,
        "customAlias": "myshorturl",
        "expirationDate": "2020-01-02T18:30:00.000Z",
        "created_at": "2020-01-01T16:01:48.538Z",
        "__v": 0
    },
    "message": "Url deleted successfully"
  }

## Analytics

### /api/urls/:code/stats
- **Method**: GET
- **Description**: Retrieve analytics for a specific URL, such as original url, shortened url, number of clicks, referrers(apps from which URL has been clicked), geo-location, time-stamp etc.
- **URL Parameter**: code (the shortened URL code)
- **Response**:
  ```json
  {
  "original_url": "https://example.com/problems/problem1/description/",
  "short_url": "http://localhost:8000/mylink",
  "clicks": 3,
  "referrers": [],
  "user_agents": [],
  "geo_locations": [],
  "timestamps": []
  }

### /api/urls/:code/qr
- **Method**: GET
- **Description**: Retrieve a QR code for a specific shortened URL.
- **URL Parameter**: code (the shortened URL code)
- **Response**: Returns a PNG image of the QR code.
  