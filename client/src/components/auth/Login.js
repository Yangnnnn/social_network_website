
import React,{Fragment,useState} from 'react';
// import axios from 'axios';
import {Link} from "react-router-dom";

export const Login = () => {
    const [formData,setFormData] = useState({
        email:'',
        password:''
    });
    const {email,password} = formData
    const onChange = e => setFormData({
        ...formData,[e.target.name]:e.target.value
    })
    const onSubmit = async e =>{
        e.preventDefault();
        console.log("Done!")
        console.log(formData)
    }
    return <Fragment>
    <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        
        <div className="form-group">
          <input type="email" placeholder="Email Address" value ={email} onChange={e=>onChange(e)} name="email" />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value ={password}
            onChange={e=>onChange(e)}
            minLength="6"
          />
        </div>
        
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </Fragment>
}

export default Login