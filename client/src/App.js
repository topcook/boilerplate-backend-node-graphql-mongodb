import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// apollo client

import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost'
import gql from 'graphql-tag'

const endPointUrl = 'http://localhost:4000/graphql'
const client = new ApolloClient({
   link: new HttpLink({uri:endPointUrl}),
   cache:new InMemoryCache()
});

async function loadStudentsAsync() {
   const query = gql`
   {
      listAllStudents {
         # id
         firstName
         lastName
         collegeId
         # college{
         #    name
         # }
      }
   }
   `
   const {data} = await client.query({query}) ;
   return data.listAllStudents;
}
class  App  extends Component {
   constructor(props) {
      super(props);
      this.state = {
         students:[]
      }
      this.studentTemplate =  [];
      // localStorage.setItem("authorization", 
      // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFraWUzcmFuLnBhbmlncmFoaUB0dXRvcmlhbHBvaW50Lm9yZyIsInV1aWQiOiIxYTY3OGQyNi1lZjI0LTRmYzUtOTI3MC0yYjE0ZGFhOWExODgiLCJpYXQiOjE2NTczOTc4NDAsImV4cCI6MTY1Nzc1Nzg0MH0.yoOw7SK8hpzSatidMM5oKZcKMYj6trM42pT24m87NNI"
      // );
   }
   async loadStudents() {
      const studentData =  await loadStudentsAsync();
      this.setState({
         students: studentData
      })
   }
   render() {
      return(
         <div>
            <input type = "button"  value = "loadStudents" onClick = {this.loadStudents.bind(this)}/>
            <div>
               <br/>
               <hr/>
               <table border = "3">
                  <thead>
                     <tr>
                        <td>First Name</td>
                        <td>Last Name</td>
                        <td>college Id</td>
                     </tr>
                  </thead>
                  
                  <tbody>
                     {
                        this.state.students && this.state.students.map(s => {
                           return (
                              <tr key = {s.id}>
                                 <td>
                                    {s.firstName}
                                 </td>
                                 <td>
                                    {s.lastName}
                                 </td>
                                 <td>
                                    {s.collegeId}
                                 </td>
                              </tr>
                           )
                        })
                     }
                  </tbody>
               </table>
            </div>
         </div>
      )
   }
}

export default App;