import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, Question, Category, db


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "trivia_test"
        self.database_path = "postgresql://{}{}@{}/{}".format(
            '', ':', 'localhost:5432', self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()

        self.test_wrongPage = 1000000000000

        self.test_wrongQuestionId = 1000000000000

        self.test_categoryJson = {
            'id': 1,
            'type': 'Science'
        }

        self.test_wrongCategoryJson = {
            'id': 1000000000000,
            'type': 'wrongCategory'
        }

        self.test_wrongSearchTermJson = {
            'searchTerm': '你好'
        }

        self.test_searchTermJson = {
            'searchTerm': 'test?'
        }

        self.test_questionJson = {
            'question': self.test_searchTermJson['searchTerm'],
            'answer': 'test',
            'category': self.test_categoryJson['type'],
            'difficulty': 9
        }

        self.test_question = Question(
            question=self.test_searchTermJson['searchTerm'],
            answer='test',
            category=self.test_categoryJson['type'],
            difficulty=9
        )

        self.test_questionId = self.createTestQuestion()

    def tearDown(self):
        """Executed after reach test"""
        pass

    """
    TODO
    Write at least one test for each test for successful operation and for expected errors.
    """

    def createTestQuestion(self):
        self.test_question.insert()
        questionId = self.test_question.id

        return questionId

    def searchTestQuestion(self):
        question = Question.query.filter(
            Question.id == self.test_questionId).one_or_none()

        if question is None:
            isExist = False
        else:
            isExist = True

        return isExist

    def getTestQuizzes(self, category, previousQuestionIds):
        response = self.client().post(
            f"/questions/quizzes", json={'previousQuestionIds': previousQuestionIds, 'category': category})

        return response

    def test_getCategories_success_200(self):
        response = self.client().get("/categories")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['data'])
        self.assertTrue(data['total'])

    def test_getCategories_failure_405(self):
        response = self.client().post("/categories")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], "Method not allowed")

    def test_getQuestions_success_200(self):
        response = self.client().get("/questions")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['data'])
        self.assertTrue(data['total'])

    def test_getQuestions_failure_404(self):
        response = self.client().get(f"/questions?page={self.test_wrongPage}")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], "Not found")

    def test_createQuestion_success_200(self):
        response = self.client().post(f"/questions", json=self.test_questionJson)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['data'])

    def test_createQuestion_failure_404(self):
        response = self.client().post(f"/questions")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 422)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], "Unprocessable request")

    def test_searchQuestion_success_200(self):
        self.createTestQuestion()
        response = self.client().post(f"/questions/searches", json=self.test_searchTermJson)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['data'])
        self.assertTrue(data['total'])

    def test_searchQuestion_failure_404(self):
        response = self.client().post(f"/questions/searches",
                                      json=self.test_wrongSearchTermJson)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], "Not found")

    def test_getQuestionsByCategory_success_200(self):
        self.createTestQuestion()
        response = self.client().get(
            f"/categories/{self.test_categoryJson['id']}/questions")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['data'])
        self.assertTrue(data['total'])

    def test_getQuestionsByCategory_failure_404(self):
        response = self.client().get(
            f"/categories/{self.test_wrongCategoryJson['id']}/questions")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], "Not found")

    def test_getQuizzez_success_200(self):
        self.createTestQuestion()
        questions = db.session.query(Question, Category).join(
            Category, Question.category == Category.type).filter(Category.id == self.test_categoryJson['id']).all()
        lastQuestion = questions[-1]
        questions.pop()

        previousQuestionIds = [question.Question.id for question in questions]

        response = self.getTestQuizzes(
            self.test_categoryJson['type'], previousQuestionIds)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(data['data']['id'], lastQuestion.Question.id)

        previousQuestionIds.append(lastQuestion.Question.id)

        response = self.getTestQuizzes(
            self.test_categoryJson['type'], previousQuestionIds)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(data['data'], None)

    def test_getQuizzez_failure_422(self):
        response = self.getTestQuizzes(
            self.test_wrongCategoryJson['type'], None)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 422)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], "Unprocessable request")

    def test_deleteQuestion_success_200(self):
        response = self.client().delete(f"/questions/{self.test_questionId}")
        data = json.loads(response.data)

        isQuestionExist = self.searchTestQuestion()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(isQuestionExist, False)

    def test_deleteQuestion_failure_422(self):
        response = self.client().delete(
            f"/questions/{self.test_wrongQuestionId}")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 422)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], "Unprocessable request")

        # Make the tests conveniently executable


if __name__ == "__main__":
    unittest.main()
