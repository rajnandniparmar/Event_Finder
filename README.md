# Event_Finder
A RESTful service that manages and queries event data based on a user's geographical location and a specified date.

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
- Text editor or IDE (e.g., VS Code, Sublime Text).
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
2. Send GET requests to `/events` to retrieve all events or `/events/find` to search for events based on date, latitude, longitude, and page. Example url : 'http://localhost:5000/events/find?date=2024-03-15&latitude=40.7128&longitude=-74.0060&page=1'
3. Send POST requests to `/events/add` to add new events to the database.

---
