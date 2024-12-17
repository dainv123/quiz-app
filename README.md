# Quiz app

## Architecture Diagram

```plaintext
+-----------------------+        +-------------------+        +--------------------+
|                       |        |                   |        |                    |
|    Frontend (React)   | <----> |   Backend (NestJS)| <----> |   Database         |
|                       |        |                   |        |                    |
+-----------------------+        +-------------------+        +--------------------+
        ^                            ^      |                          |
        |                            |      v                          v
        |                            |  +-------------------+      +-------------------+
        |                            |  |                   |      |                   |
        |                            +->| WebSocket Server  | <--> | Redis (Optional)  |
        |                               |   (Socket.IO)     |      | (Caching, Sessions)|
        |                               |                   |      |                   |
        +-------------------------------+-------------------+      +-------------------+
                      Real-time updates              Cache & Session Management

```
## Technology Stack

- **NestJS**: A powerful Node.js framework for building scalable and maintainable backend applications.
- **ReactJS**: A popular JavaScript library for building user interfaces, especially single-page applications (SPAs). React's component-based structure allows for reusable UI elements, making development more modular and efficient. Im also following the **Container/Presentational Pattern**.
- **Socket.IO**: A library for enabling real-time, bidirectional communication between the server and the client.
- **TypeScript**: Ensures type safety throughout the application, reducing runtime errors and improving code quality.
- **Redis** (not implemented): A fast, in-memory data store for caching frequently requested data, such as leaderboard information, to improve performance.
- **Database** (not implemented):
    - **MongoDB** or
    - **PostgreSQL**
- **Axios**: A promise-based HTTP client for making requests to the backend server.
- **Bootstrap**: A CSS framework for quickly designing responsive and styled UI components.
- **Jest**: A testing framework for running unit tests and ensuring the reliability of the application.

## Data Flow Overview

### 1. **Admin Actions**
   - **Create Quiz**: Admin creates a quiz by specifying a `quizId` and duration.
   - **Process**:
     - The API Gateway routes the data to the Quiz Service.
     - The Quiz Service stores the quiz in the database with `active = false`.
   - **Output**: The quiz is successfully created, and the quiz list is updated for the admin.

### 2. **Starting the Quiz**
   - **Start Quiz**: Admin starts the quiz by specifying a `quizId`.
   - **Process**:
     - The Quiz Service retrieves the quiz data from the database.
     - It sets the quiz state to `active = true` and calculates the `endTime` based on the quiz duration.
     - The active quiz data is stored in Redis for faster access.
   - **Output**: Real-time updates about the quiz are sent to the users via WebSocket.

### 3. **User Actions**
   - **Scenario 1: Quiz is Inactive**
     - **Input**: A user logs in with `quizId` and username.
     - **Process**: The Quiz Service checks if the quiz is active. If not, the user waits for the quiz to start.
     - **Output**: The user is notified to wait for the quiz to begin.

   - **Scenario 2: Quiz is Active**
     - **Input**: A user logs in with `quizId` and username.
     - **Process**: The Quiz Service retrieves the active quiz data, including questions and remaining time, from Redis.
     - **Output**: The user receives the quiz data and the remaining time via API.

### 4. **Submission and Leaderboard**
   - **Submit Answers**: A user submits their answers to the quiz.
   - **Process**:
     - The Quiz Service checks if the user has already submitted answers.
     - It evaluates the answers and calculates the score based on the number of correct answers and time taken.
     - The leaderboard is updated in Redis.
   - **Output**: Real-time leaderboard updates are sent to the users via WebSocket.

### 5. **End of Quiz**
   - **End Quiz**: The quiz ends either when the timer expires or manually by the admin.
   - **Process**:
     - The Quiz Service marks the quiz as inactive (`active = false`).
     - The leaderboard and user submissions are saved from Redis to the database.
     - Redis memory is cleared for the quiz.
   - **Output**: The final leaderboard is stored in the database, and the quiz is marked as finished.

---

### Key Observations

- **Real-Time Operations**:
  - Redis helps to quickly access active quiz data, leaderboard updates, and timers.
  - WebSocket Gateway ensures real-time communication for quiz updates, such as timer changes and leaderboard changes.
  - **Last 30-Second Sync**: The system emits a timer update for the last 30 seconds of the quiz to all users to ensure they are synchronized.

- **Persistence**:
  - The database is used to store long-term data, such as quiz results and historical submissions.

- **Submission Restrictions**:
  - Users can only submit their answers once. After submission, they can only view the leaderboard.

- **User Experience**:
  - Users will be notified if the quiz is inactive and will wait until it starts.
  - Once the quiz is active, users can immediately start answering questions and see the timer.

- **Scalability**:
  - Redis and WebSocket Gateway ensure that the system can handle a large number of users and provide real-time functionality.

- **Reliability**:
  - Data is saved in the database at the end of the quiz to prevent data loss.

## Frontend Structure

- `./components`: Contains reusable React components for the UI.
    - `./Timer`:
        - `Timer.tsx`: A component that displays the remaining time for the quiz.
        - `Timer.test.tsx`: A unit test for the timer component.
    - `AdminQuizForm.tsx`: A form for administrators to create or start quizzes.
    - `JoinQuizForm.tsx`: A form for users to join a quiz by entering the `quizId` and username.
    - `Leaderboard.tsx`: Displays the quiz leaderboard, showing the ranking of users.
    - `QuestionForm.tsx`: A form for displaying and submitting quiz questions.
    - `QuizQuestion.tsx`: A component for displaying individual quiz questions.
    - `QuizCard.tsx`: Displays individual quizzes in a card format, showing details like quiz title and status.
    - `QuizzesList.tsx`: A list of quizzes that users can join or admins can manage.

- `./constants`: Contains constant values, such as event names or API endpoints.
    - `socket-event.ts`: Defines constants for WebSocket events like `QUIZ_UPDATE`, `QUIZ_END`, etc.

- `./helpers`: Contains utility functions and API service functions.
    - `api.ts`: Defines functions for making API requests, such as fetching quiz data or submitting answers.

- `./interfaces`: Defines TypeScript interfaces for type-checking data structures used throughout the app.
    - `quiz.ts`: Defines the structure of quiz-related data, such as questions and answers.

- `./pages`:
    - `./Quiz`:
        - `User.tsx`: The page where users participate in quizzes.
        - `Admin.tsx`: The page where admins can create, start, and track quizzes.
        - `User.test.tsx`: Unit test for the user page.
        - `Admin.test.tsx`: Unit test for the admin page.

## Backend Structure

- `./constants`: Contains constant values for event names, API endpoints, or other configuration values.
    - `socket-event.ts`: Defines constants for WebSocket events like `QUIZ_UPDATE`, `QUIZ_END`, etc.

- `./interfaces`: Contains TypeScript interfaces to type-check data used in the app.
    - `quiz.ts`: Defines quiz-related data structures like quiz questions, answers, and more.

- `./modules`:
    - `./quiz`:
        - `quiz.controller.ts`: Handles incoming HTTP requests related to quiz operations, such as creating or retrieving quizzes.
        - `quiz.controller.spec.ts`: Unit tests for the quiz controller, verifying its functionality.
        - `quiz.gateway.ts`: Implements the WebSocket logic for real-time communication (e.g., broadcasting quiz updates to users).
        - `quiz.service.ts`: Contains the business logic for handling quizzes, such as retrieving data and processing submissions.
        - `quiz.service.spec.ts`: Unit tests for the quiz service to ensure it works as expected.


