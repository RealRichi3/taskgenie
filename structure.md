# TaskGenie
Effortlessly Get Things Done

## key features
Task Management: Gigwalk allows clients to create and publish tasks that need to be completed by workers. Workers can browse available tasks and accept the ones they're interested in completing. Clients can monitor the status of their tasks and provide feedback to workers once they're completed.
    
  Payment Processing and Management: Gigwalk handles payment processing and management, including invoicing, payment collection, and distribution. Workers are paid for the tasks they complete, and clients can view their payment history and manage their payment preferences.
    
 User Authentication and Profile Management: Gigwalk requires users to create accounts and provides user authentication and profile management functionality. Users can update their personal information, view their task history, and manage their preferences.
    
 Communication Between Users: Gigwalk provides communication channels between clients and workers, including messaging and notifications. This allows users to stay informed about task status updates and provide feedback to each other.
    
  Reporting and Analytics: Gigwalk provides reporting and analytics functionality that allows clients to track task completion rates, worker performance, and other relevant metrics. This information can be used to optimize task creation and worker recruitment strategies.
    
Customizable Branding: Gigwalk allows clients to customize their branding, including adding their logos and colors to the application. This allows clients to create a consistent brand experience for their workers and customers.

## APIs
1.  Task Management
    
    -   POST /tasks: Creates a new task with a title, description, location, and other relevant details. Returns the newly created task object.
    -   GET /tasks: Retrieves a list of available tasks, including task details such as title, description, location, and payment. Supports filtering and pagination.
    -   GET /tasks/{id}: Retrieves details of a specific task by ID, including task status, worker assigned, and client feedback.
    -   PUT /tasks/{id}: Updates a task by ID, allowing clients to edit task details such as title, description, and payment.
2.  Payment Processing and Management
    
    -   POST /payments: Creates a new payment for a completed task, including worker ID, task ID, and payment amount. Returns the newly created payment object.
    -   GET /payments: Retrieves a list of payments made to workers, including payment details such as amount, date, and task details.
    -   GET /payments/{id}: Retrieves details of a specific payment by ID, including worker ID, task ID, and payment amount.
    -   PUT /payments/{id}: Updates a payment by ID, allowing clients to adjust payment amounts or issue refunds.
3.  User Authentication and Profile Management
    
    -   POST /register: Creates a new user account with a username, email, and password. Returns the newly created user object and an access token.
    -   POST /login: Authenticates a user with a username and password. Returns an access token.
    -   GET /users/{id}: Retrieves details of a specific user by ID, including username, email, task history, and preferences.
    -   PUT /users/{id}: Updates a user by ID, allowing users to edit their personal information, view task history, and manage preferences.
4.  Communication Between Users
    
    -   POST /messages: Creates a new message between a client and worker, including sender ID, recipient ID, and message text. Returns the newly created message object.
    -   GET /messages: Retrieves a list of messages sent and received by a user, including message details such as sender, recipient, and text.
    -   GET /messages/{id}: Retrieves details of a specific message by ID, including sender, recipient, and text.
5.  Reporting and Analytics
    
    -   GET /metrics/tasks: Retrieves task completion rates and other relevant metrics, including number of tasks created, completed, and canceled.
    -   GET /metrics/workers: Retrieves worker performance metrics, including task completion time, accuracy, and feedback.
    -   GET /metrics/payments: Retrieves payment metrics, including total amount paid, average payment per task, and payment history.
   
6.   Notifications

- POST /notifications: Creates a new notification for a user, including 		  notification type, recipient ID, and message. Returns the newly created notification object. 
- GET /notifications: Retrieves a list of notifications sent to a user, including notification details such as type, sender, and message. 
- GET /notifications/{id}: Retrieves details of a specific notification by ID, including type, sender, and message.

7.  Customizable Branding
    
    -   PUT /branding: Updates client branding settings, allowing clients to add their logos, colors, and other branding elements to the application. Returns the updated branding settings object.
    
## User roles: 
Determine the different user roles for the application. For example, there may be two main user roles: clients who create tasks, and workers who complete tasks.

Clients: Clients are the individuals or businesses that create tasks on the platform. They may have access to features such as creating, managing, and monitoring tasks, as well as reviewing completed tasks and providing feedback to workers. Clients may also have access to payment processing and management features.
    
Workers: Workers are individuals who browse available tasks on the platform and complete them. They may have access to features such as searching and filtering tasks based on their preferences, accepting and completing tasks, communicating with clients, and receiving payments.
    
Administrators: Administrators are users who have access to the backend of the application and can manage and monitor user accounts, tasks, payments, and other application-related data. They may have access to additional features such as analytics and reporting tools, as well as the ability to modify or delete tasks or user accounts as needed.
 
## Create user stories: 
Create user stories to describe the functionality of the application from the perspective of each user role. User stories are brief, narrative descriptions that help you understand how users will interact with the application. For example, a user story for a client may be: "As a client, I want to be able to create a task with a title, description, and location, so that workers can find and complete the task."

## DB schema

### Users Table
![image](https://user-images.githubusercontent.com/29153968/232205760-85828bd7-8148-41f2-853d-3b78167867e2.png)

### Tasks Table
![image](https://user-images.githubusercontent.com/29153968/232205791-c958f736-0c51-49da-b06a-90e06bffbf2e.png)

### Payments Table
![image](https://user-images.githubusercontent.com/29153968/232205831-49c88dd8-bceb-457e-84c7-dbe1cc7c92ce.png)


### Messages Table
![image](https://user-images.githubusercontent.com/29153968/232205839-9866ec69-cb8a-4c28-9fab-e299165512d5.png)


### Other Aspects
1.  Testing: Plan and conduct testing to ensure the application functions as intended and is reliable and secure. This may include unit testing, integration testing, and end-to-end testing.
    
2.  Deployment and Hosting: Plan and deploy the application to a hosting environment that can support its scale and performance requirements. This may include setting up a load balancer, configuring auto-scaling, and monitoring the health of the application.
    
3.  Security: Ensure that the application is secure and that user data is protected. This may involve implementing measures such as encryption, access control, and logging.
    
4.  Maintenance and Support: Plan for ongoing maintenance and support of the application, including bug fixes, updates, and user support.
    
5.  Documentation: Create documentation to help users understand how to use the application, as well as documentation for developers on how to contribute to and maintain the application. This may include user guides, developer guides, and API documentation.