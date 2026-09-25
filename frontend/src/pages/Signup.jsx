import { useState } from 'react';
import './Signup.css';


function Signup() {
  const [credentials, setCredentials] = useState({
  name: "",
  email: "",
  password: ""
});
 const handleSubmit = async (e) => {
  e.preventDefault();

  const response = await fetch("http://localhost:5000/api/auth/createuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password
    })
  });
const json = await response.json();

console.log(json);

if (json.success) {
  localStorage.setItem('token', json.authToken);
  console.log("Signup successful");
}
  return (
    <div className="signup-container">
      <div className="signup-card">

        <h1>Create your account</h1>
        <p>Join NoteSphere and manage your notes easily.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={credentials.name}
              onChange={(e) => setCredentials({...credentials, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials,email:e.target.value})
            }
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials,password:e.target.value})}
            />
          </div>

          <button type="submit">
            Sign Up
          </button>
        </form>

      </div>
    </div>
  );
}

export default Signup;