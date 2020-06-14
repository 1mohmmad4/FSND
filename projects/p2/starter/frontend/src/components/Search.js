import React, { Component } from "react";

class Search extends Component {
 getInfo = (event) => {
  event.preventDefault();
  this.props.initSearch(this.search.value);
 };

 render() {
  return (
   <form onSubmit={this.getInfo}>
    <input
     placeholder="Search questions..."
     ref={(input) => (this.search = input)}
     id="searchTerm"
    />
    <input type="submit" value="Submit" className="button" />
   </form>
  );
 }
}

export default Search;
