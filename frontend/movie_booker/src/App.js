import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Movies from "./components/Movies";

const App = () => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegister = async (email, password) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      alert("Registration successful. Please log in.");
    } else {
      alert("Registration failed.");
    }
  };

  const handleLogin = async (email, password) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      setIsLoggedIn(true);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token); 
    } else {
      alert("Login failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">MovieBooker</h1>
      {!isLoggedIn ? (
        <>
           <div className="flex flex-col items-center">
           <div className="mb-4">
             <h2 className="text-xl font-bold mb-2">Register</h2>
             <Register onRegister={handleRegister} />
           </div>

           <div>
             <h2 className="text-xl font-bold mb-2">Login</h2>
             <Login onLogin={handleLogin} />
           </div>
         </div>
            
          
          
        </>
      ) : (
        <Movies token={token} />
      )}
    </div>
  );
};

export default App;
