# Tasks Service

The Tasks Service is an API that allows clients to create and publish tasks that need to be completed by workers. Workers can browse available tasks and accept the ones they're interested in completing. Clients can monitor the status of their tasks and provide feedback to workers once they're completed.

## Technologies Used

The Tasks Service is built with the following technologies:

-   Django: A high-level Python web framework
-   Django REST Framework: A powerful and flexible toolkit for building APIs
-   PostgreSQL: A powerful, open-source object-relational database system
-   Docker: A tool for creating and managing containers

## Getting Started

To get started with the Tasks Service, you'll need to have the following tools installed:

-   Docker
-   Docker Compose

Once you have these tools installed, you can run the following commands to start the Tasks Service:

1.  Clone the repository:
	```bash
	git clone https://github.com/your-username/tasks-service.git
	```
2.  Change into the project directory:
	```bash
	cd tasks-service
	```
3.  Start the Docker containers:
	```bash
	docker-compose up -d --build
	```
4.  Create the database tables:
	```bash
	docker-compose exec web python manage.py migrate
	```
5.  Create a superuser:
	```bash
	docker-compose exec web python manage.py createsuperuser
	```
You should now be able to access the Tasks Service API at [http://localhost:8000/](http://localhost:8000/).

## API Documentation

The Tasks Service API documentation can be found at [http://localhost:8000/swagger/](http://localhost:8000/swagger/) or [http://localhost:8000/redoc/](http://localhost:8000/redoc/).

## License

The Tasks Service is released under the [MIT License](https://opensource.org/licenses/MIT).