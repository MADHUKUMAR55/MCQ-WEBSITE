import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
