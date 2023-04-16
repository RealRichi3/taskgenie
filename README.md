# taskgenie
Task genie allows clients to create and publish tasks that need to be completed by workers. Workers can browse available tasks and accept the ones they're interested in completing. Clients can monitor the status of their tasks and provide feedback to workers once they're completed.
backend/
--- services/
------ task_service/
--------- api/
------------ v1/
--------------- views.py
--------------- serializers.py
--------- tasks/
------------ tasks.py
--------- models.py
--------- urls.py
--------- tests/
------------ test_views.py
------------ test_serializers.py
------ payment_service/
--------- api/
------------ v1/
--------------- views.py
--------------- serializers.py
--------- payments/
------------ payments.py
--------- models.py
--------- urls.py
--------- tests/
------------ test_views.py
------------ test_serializers.py
--- config/
------ settings.py
------ urls.py
--- requirements.txt
--- manage.py

frontend/
--- src/
------ components/
--------- App.js
--------- TaskList.js
--------- TaskDetails.js
--------- PaymentHistory.js
--------- PaymentDetails.js
------ services/
--------- taskService.js
--------- paymentService.js
------ utils/
--------- api.js
------ App.css
------ App.test.js
------ index.js
--- package.json
--- README.md
--- yarn.lock

node_service/
--- api/
------ v1/
--------- routes/
------------ tasks.js
------------ payments.js
--------- controllers/
------------ taskController.js
------------ paymentController.js
--------- models/
------------ taskModel.js
------------ paymentModel.js
--------- tests/
------------ taskController.test.js
------------ paymentController.test.js
--- app.js
--- package.json
--- README.md

docker-compose.yml
