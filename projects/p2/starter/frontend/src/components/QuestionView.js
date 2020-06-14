import React, { Component } from "react";

import "../stylesheets/App.css";
import Question from "./Question";
import Search from "./Search";
import $ from "jquery";

class QuestionView extends Component {
 constructor() {
  super();
  this.state = {
   questions: [],
   page: 1,
   totalQuestions: 0,
   categories: {},
   currentCategory: null,
   searchTerm: null,
  };
 }

 componentDidMount() {
  this.getCategories();
  this.getQuestions();
 }

 async initQuestionsByCategory(newCurrentCategoty) {
  this.setSearchTerm(null);
  document.getElementById("searchTerm").value = null;
  await this.setPageToFirst();
  await this.setCurrentCategoty(newCurrentCategoty);
  this.getQuestionsByCategory();
 }

 initSearch = async (newSearchTerm) => {
  this.setCurrentCategoty(null);
  await this.setPageToFirst();
  await this.setSearchTerm(newSearchTerm);
  this.submitSearch();
 };

 async setPageToFirst() {
  this.setState({
   page: 1,
  });
 }

 async setSearchTerm(newSearchTerm) {
  this.setState({
   searchTerm: newSearchTerm,
  });
 }

 async setCurrentCategoty(newCurrentCategoty) {
  this.setState({
   currentCategory: newCurrentCategoty,
  });
 }

 getCategories = () => {
  $.ajax({
   url: `/categories`, //TODO: update request URL
   type: "GET",
   success: (result) => {
    this.setState({
     categories: result.data,
    });
    return;
   },
   error: (error) => {
    alert("Unable to load categories. Please try your request again");
    return;
   },
  });
 };

 getQuestions = () => {
  $.ajax({
   url: `/questions?page=${this.state.page}`, //TODO: update request URL
   type: "GET",
   success: (result) => {
    this.setState({
     questions: result.data,
     totalQuestions: result.total,
     //categories: result.categories,
     //currentCategory: result.current_category,
    });
    return;
   },
   error: (error) => {
    alert("Unable to load questions. Please try your request again");
    return;
   },
  });
 };

 selectPage(num) {
  if (this.state.searchTerm != null)
   this.setState({ page: num }, () => this.submitSearch());
  else if (this.state.currentCategory != null)
   this.setState({ page: num }, () => this.getQuestionsByCategory());
  else this.setState({ page: num }, () => this.getQuestions());
 }

 createPagination() {
  let pageNumbers = [];
  let maxPage = Math.ceil(this.state.totalQuestions / 10);
  for (let i = 1; i <= maxPage; i++) {
   pageNumbers.push(
    <span
     key={i}
     className={`page-num ${i === this.state.page ? "active" : ""}`}
     onClick={() => {
      this.selectPage(i);
     }}
    >
     {i}
    </span>
   );
  }
  return pageNumbers;
 }

 getQuestionsByCategory() {
  $.ajax({
   url: `/categories/${this.state.currentCategory}/questions?page=${this.state.page}`, //TODO: update request URL
   type: "GET",
   success: (result) => {
    this.setState({
     questions: result.data,
     totalQuestions: result.total,
     //currentCategory: result.current_category,
    });
    return;
   },
   error: (xhr, ajaxOptions, thrownError) => {
    switch (xhr.status) {
     case 404:
      alert(xhr.message);
    }
    return;
   },
  });
 }

 submitSearch = () => {
  $.ajax({
   url: `/questions/searches?page=${this.state.page}`, //TODO: update request URL
   type: "POST",
   dataType: "json",
   contentType: "application/json",
   data: JSON.stringify({ searchTerm: this.state.searchTerm }),
   xhrFields: {
    withCredentials: true,
   },
   crossDomain: true,
   success: (result) => {
    this.setState({
     questions: result.data,
     totalQuestions: result.total,
     //currentCategory: result.current_category,
    });
    return;
   },
   error: (error) => {
    alert("Unable to load questions. Please try your request again");
    return;
   },
  });
 };

 questionAction = (id) => (action) => {
  if (action === "DELETE") {
   if (window.confirm("are you sure you want to delete the question?")) {
    $.ajax({
     url: `/questions/${id}`, //TODO: update request URL
     type: "DELETE",
     success: (result) => {
      alert("Question deleted successfully");
      this.getQuestions();
     },
     error: (error) => {
      alert("Unable to load questions. Please try your request again");
      return;
     },
    });
   }
  }
 };

 render() {
  return (
   <div className="question-view">
    <div className="categories-list">
     <h2
      onClick={() => {
       this.getQuestions();
      }}
     >
      Categories
     </h2>
     <ul>
      {Object.entries(this.state.categories).map(([id, c]) => (
       <li
        key={c.id}
        onClick={() => {
         this.initQuestionsByCategory(c.id);
        }}
       >
        <img className="category" src={`${c.type}.svg`} />
       </li>
      ))}
     </ul>
     <Search initSearch={this.initSearch} />
    </div>
    <div className="questions-list">
     <h2>Questions</h2>
     {this.state.questions.map((q) => (
      <Question
       key={q.id}
       question={q.question}
       answer={q.answer}
       category={q.category}
       difficulty={q.difficulty}
       questionAction={this.questionAction(q.id)}
      />
     ))}
     <div className="pagination-menu">{this.createPagination()}</div>
    </div>
   </div>
  );
 }
}

export default QuestionView;
