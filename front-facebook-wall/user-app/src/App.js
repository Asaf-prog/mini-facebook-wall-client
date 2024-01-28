import './App.css';
import { useState } from 'react';
import Login from './components/login/Login.js';
import Sidebar from './components/sidebar/Sidebar.js';
import UserPostsComponent from './components/UserPost/UserPostsComponent.js';
import SearchUser from './components/searchUser/SearchUser.js';
import Register from './components/register/Register.js';
import AdminDashboard from './components/admin/AdminDashboard .js';


function App() {

  const [showLoginComponent, setShowLoginComponent] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userName, setUserName] = useState('');
  const [showMyPostComponent, setshowMyPostComponent] = useState(false);
  const [showSearchUser, setSearchUser] = useState(false);
  const [showRegisterComponent, setShowRegisterComponent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  function handleChangeLogin(enteredUserName,isAdminUser) {
    setShowLoginComponent(false);
    setShowSidebar(true);
    setUserName(enteredUserName);
    setIsAdmin(isAdminUser);
    setShowRegisterComponent(false);
    
      if(isAdminUser) {
        setShowSidebar(false);
          
      }
  };

  function handleSetshowMyPostComponent() {
    setshowMyPostComponent(true);
    setSearchUser(false);
    setShowRegisterComponent(false);
  };

  function handleSetSearchUser() {
    setSearchUser(true);
    setshowMyPostComponent(false);
  };

  function handleRegisterComponent() {
    setShowRegisterComponent(true);
    setShowLoginComponent(false);
  }

  return (
   <main>
    <h1 className="app-title">mini Facebook Wall</h1>

     {showLoginComponent ? <Login handleChangeLogin={handleChangeLogin}
     handleRegisterComponent={handleRegisterComponent}
     />: null}
     {showRegisterComponent ? <Register handleChangeLogin={handleChangeLogin}
     />: null}
     
     {showSidebar ? <Sidebar myPostComponent = {handleSetshowMyPostComponent}
     SearchUserComponent={handleSetSearchUser}
     />: null}
     {showMyPostComponent ? <UserPostsComponent userName={userName}
     />: null}
     {showSearchUser ? <SearchUser userName={userName}
     />: null}     


    {isAdmin ? (
            <div>
              <AdminDashboard/>
            </div>
          ) : null}
   </main>
  );
}

export default App;
