# Event_Finder
A RESTful service that provides event data based on a user's geographical location and a specified date.

### Choice of Tech Stack and Database

- **Tech Stack:** Node.js, Express.js, Axios
- **Database:** JSON File

#### Design Decisions:

- **Modular Structure:** The project follows a modular structure, separating routes, middleware, and utility functions for better organization and maintainability.
  
- **Error Handling:** Robust error handling is implemented throughout the application to ensure graceful degradation and improved user experience. Errors are logged with relevant information for debugging purposes.
  
- **Asynchronous Operations:** Asynchronous operations, such as fetching weather data and calculating distances, are handled using async/await syntax to prevent blocking the event loop and improve performance.

#### Challenges and Solutions:

- **External API Integration:** Integrating external APIs for weather data and distance calculation presented challenges such as handling asynchronous operations and error handling. These challenges were addressed by utilizing async/await syntax for asynchronous operations and implementing robust error handling mechanisms.

- **Data Pagination:** Implementing pagination for fetching events required careful consideration of performance and efficiency. The use of slicing and pagination metadata allows for efficient retrieval of paginated data while minimizing server load.

## Instructions to Set Up and Run the Project

### Prerequisites

- Node.js installed on your system.
- Text editor or IDE (e.g., VS Code).
- Postman or any REST API client for testing API endpoints.

### Setup

1. Clone or download the project files from the repository.
2. Navigate to the project directory in your terminal.
3. Install dependencies by running `npm install`.

### Running the Project

1. Start the server by running `node index.js` or `npm start` command.
2. The server will start running at the specified port (default is 5000).

### Testing the API Endpoints

1. Use Postman or any REST API client to test the endpoints.
2. Send GET requests to `/events/find` to search for events based on date, latitude, longitude, and page. Example url : 'http://localhost:5000/events/find?date=2024-03-15&latitude=40.7128&longitude=-74.0060&page=1'
3. Send POST requests to `/events/add` to add new events to the database.


---


### GET /events/find

#### Description

Searches for events based on specified parameters such as date, latitude, longitude, and page number. Returns paginated results sorted by date and distance.

#### Request

- Method: GET
- URL: `/events/find`
- Query Parameters:
  - `date`: Date in yyyy-mm-dd format (required)
  - `latitude`: Latitude of the location (required)
  - `longitude`: Longitude of the location (required)
  - `page`: Page number for pagination (required)

#### Response

- Status Code: 200 OK
- Body: JSON object containing paginated events along with pagination metadata.

Example:

```json
{
    "events": [
        {
            "event_name": "Event 1",
            "city_name": "City 1",
            "date": "2024-03-15",
            "weather": "Sunny",
            "distance_km": 10.5
        },
        {
            "event_name": "Event 2",
            "city_name": "City 2",
            "date": "2024-03-16",
            "weather": "Cloudy",
            "distance_km": 15.2
        },
        
    ],
    "page": 1,
    "pageSize": 10,
    "totalEvents": 44,
    "totalPages": 5
}
```

#### Error Codes

- 400 Bad Request: If any required query parameter is missing or invalid.
- 500 Internal Server Error: If an unexpected error occurs.

### POST /events/add

#### Description

Adds a new event to the database.

#### Request

- Method: POST
- URL: `/events/add`
- Body: JSON object containing details of the event to be added.
  - `event_name`: Name of the event (required)
  - `city_name`: Name of the city (required)
  - `date`: Date of the event in yyyy-mm-dd format (required)
  - `time`: Time of the event (required)
  - `latitude`: Latitude of the location (required)
  - `longitude`: Longitude of the location (required)

#### Response

- Status Code: 201 Created
- Body: JSON object with a success message indicating that the event was added successfully.

Example:

```json
{
    "message": "Event added successfully"
}
```

#### Error Codes

- 400 Bad Request: If any required field is missing or invalid.
- 500 Internal Server Error: If an unexpected error occurs.


