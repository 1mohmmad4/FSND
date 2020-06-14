# Full Stack Trivia API Backend

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py.

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server.

## Database Setup

With Postgres running, restore a database using the trivia.psql file provided. From the backend folder in terminal run:

```bash
psql trivia < trivia.psql
```

## Running the server

From within the `backend` directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
export FLASK_APP=flaskr
export FLASK_ENV=development
flask run
```

Setting the `FLASK_ENV` variable to `development` will detect file changes and restart the server automatically.

Setting the `FLASK_APP` variable to `flaskr` directs flask to use the `flaskr` directory and the `__init__.py` file to find the application.

## Tasks

One note before you delve into your tasks: for each endpoint you are expected to define the endpoint and response data. The frontend will be a plentiful resource because it is set up to expect certain endpoints and response data formats already. You should feel free to specify endpoints in your own way; if you do so, make sure to update the frontend or you will get some unexpected behavior.

1. Use Flask-CORS to enable cross-domain requests and set response headers.
2. Create an endpoint to handle GET requests for questions, including pagination (every 10 questions). This endpoint should return a list of questions, number of total questions, current category, categories.
3. Create an endpoint to handle GET requests for all available categories.
4. Create an endpoint to DELETE question using a question ID.
5. Create an endpoint to POST a new question, which will require the question and answer text, category, and difficulty score.
6. Create a POST endpoint to get questions based on category.
7. Create a POST endpoint to get questions based on a search term. It should return any questions for whom the search term is a substring of the question.
8. Create a POST endpoint to get questions to play the quiz. This endpoint should take category and previous question parameters and return a random questions within the given category, if provided, and that is not one of the previous questions.
9. Create error handlers for all expected errors including 400, 404, 422 and 500.

REVIEW_COMMENT

```
This README is missing documentation of your endpoints. Below is an example for your endpoint to get all categories. Please use it as a reference for creating your documentation and resubmit your code.

Endpoints
GET '/categories'
GET ...
POST ...
DELETE ...

apiSaveResponse contain:
- capsolate all endpoint responses to make response more save and errorless.
- body:
success [Boolean]: to detremine either response is success or not
data [Any]: required data object that's recived by response
total [Int]: in case if response is list
- json
{
   success:
   data:
   total:
}

question model:
- body:
id [int] {primary key}:
question [string]:
answer [string]:
category [string]: type name of available categorie
difficulty [int]: range from 1 to 5 as 5 is the most difficulty
- json:
{
   'id':,
   'question':'',
   'answer':'',
   'category':'',
   'difficulty':
}

category model:
- body:
id [int] {primary key}:
type [string]:
- json:
{
   'id':,
   'type':''
}

error handlers:
- body
success [Boolean]: to detremine either response is success or not
error [Any]: status code for request
message [Int]: error explaination
- available error types:
400, 404, 405, 422
- json
{
   'success': False,
   'error': 0,
   'message': ''
}



GET '/categories'
- Fetches a dictionary of categories in which the keys are the ids and the value is the corresponding string of the category
- Request Query: None
- Request Arguments: None
- Request Body: None
- Returns: An object with a single key, categories, that contains a object of id: category_string key:value pairs.
{'1' : "Science",
'2' : "Art",
'3' : "Geography",
'4' : "History",
'5' : "Entertainment",
'6' : "Sports"}

################

GET '/questions'
- Fetches a dictionary of questions in which the keys are the ids and values is the corresponding string of the question plus answer, category type and difficulty of that's question
- Request Query: None
- Request Arguments: (page) [int], for select page number for questions
- Request Body: None
- Response Body: questions list inside data of apiSaveResponse
data [list of questions models](page size = 10)
   * Response Body json
{
   success: false,
   total: 0,
   data: [
      {
         'id':,
         'question':'',
         'answer':'',
         'category':'',
         'difficulty':
      },
      ...
   ]
}

################

DELETE '/questions/{questionId}'
- get from client id of questions that's which he want to remove it from database and remove it if it is exists.
- Request Query: (questionId) [int], for delete that's question which have this particular id
- Request Arguments: None
- Request Body: None
- Response Body: apiSaveResponse contain just success proberties
success: true if item is deleted successfully or false if happen error
   * Response Body json:
      {
         success: false
      }

################

POST '/questions'
- get from client questions model that's which he want to add it to database and return for him the id of his question.
- Request Query: None
- Request Arguments: None
- Request Body: question model without id
   * Request Body Json:
      {
         'question':'',
         'answer':'',
         'category':'',
         'difficulty':
      }
- Response Body: apiSaveResponse his data proberty contain:
id [int]: id of added question
   * Response Body json:
      {
         success: false,
         'data':''
      }

################

POST '/questions/searches'
- get from client questions name that's which he want to get it from database and return for him a list of
questions that's may he want it depending on client's search term.
- Request Query: None
- Request Arguments: (page) [int], for select page number for questions
- Request Body: search word for question's name
   * Request Body Json:
      {
         'searchTerm':''
      }
- Response Body: questions list may thair name similar to search word of the client inside data of apiSaveResponse
data [list of questions models](page size = 10)
   * Response Body json
      {
         success: false,
         total: 0,
         data: [
            {
               'id':,
               'question':'',
               'answer':'',
               'category':'',
               'difficulty':
            },
            ...
         ]
      }

################

GET '/categories/{categoryId}/questions'
- Fetches a dictionary of questions for single category provided by client in which the keys are the ids and values is the corresponding string of the question plus answer, category type and difficulty of that's question
- Request Query: (category id) [int], category id for which client he want get questions from
- Request Arguments: (page) [int], for select page number for questions
- Request Body: None
- Response Body: questions list inside data of apiSaveResponse
data [list of questions models](page size = 10)
   * Response Body json
      {
         success: false,
         total: 0,
         data: [
            {
               'id':,
               'question':'',
               'answer':'',
               'category':'',
               'difficulty':
            },
            ...
         ]
      }

################

POST '/questions/quizzes'
- Fetches a random question for single category provided by client and not in not in the list of previousQuestion that's provided from client in which the keys are the ids and values is the corresponding string of the question plus answer, category type and difficulty of that's question
- Request Query: None
- Request Arguments: None
- Request Body: None
- Response Body: one question inside data of apiSaveResponse
data [question object]
   * Remember: this question is from qategory that's provided by client and not in previous question ids list that's updated and provided by client every time
   * Response Body json
      {
         success: false,
         data: {
               'id':,
               'question':'',
               'answer':'',
               'category':'',
               'difficulty':
            }
      }

```

## Testing

To run the tests, run

```
dropdb trivia_test
createdb trivia_test
psql trivia_test < trivia.psql
python test_flaskr.py
```
