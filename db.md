                              +--------------+
                              |     User     |
                              +--------------+
                              | id           | integer, primary key
                              | email        | string, unique email address
                              | password     | string, hashed password
                              | first_name   | string, first name of the user
                              | last_name    | string, last name of the user
                              | is_worker    | boolean, flag indicating if the user is a worker
                              | is_client    | boolean, flag indicating if the user is a client
                              +--------------+

                        +------------------------+
                        |        TaskType        |
                        +------------------------+
                        | id                     | integer, primary key
                        | name                   | string, name of the task type (e.g. "Survey", "Mystery Shopper", etc.)
                        +------------------------+

                         +------------------------+
                         |         Task           |
                         +------------------------+
                         | id                     | integer, primary key
                         | title                  | string, title of the task
                         | description            | string, description of the task
                         | location               | string, location of the task
                         | price                  | decimal, price of the task in Nigerian Naira
                         | status                 | string, status of the task (e.g. "open", "assigned", "completed", etc.)
                         | task_type_id (FK)      | integer, foreign key referencing TaskType.id
                         | client_id (FK)         | integer, foreign key referencing User.id (client)
                         | worker_id (FK)         | integer, foreign key referencing User.id (worker)
                         | created_at             | datetime, timestamp when the task was created
                         | updated_at             | datetime, timestamp when the task was last updated
                         +------------------------+

                         +------------------------+
                         |        Payment         |
                         +------------------------+
                         | id                     | integer, primary key
                         | amount                 | decimal, amount paid for the task in Nigerian Naira
                         | status                 | string, status of the payment (e.g. "pending", "completed", etc.)
                         | task_id (FK)           | integer, foreign key referencing Task.id
                         | worker_id (FK)         | integer, foreign key referencing User.id (worker)
                         | client_id (FK)         | integer, foreign key referencing User.id (client)
                         | created_at             | datetime, timestamp when the payment was created
                         | updated_at             | datetime, timestamp when the payment was last updated
                         +------------------------+
