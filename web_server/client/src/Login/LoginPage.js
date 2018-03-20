import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import Auth from '../Auth/Auth';

class LoginPage extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            errors: {
                
            },
            user: {
                email: '',
                password: ''
            }
        }

        this.processForm = this.processForm.bind(this);
        this.changeUserInfo = this.changeUserInfo.bind(this);
    }

    processForm(event){
        event.preventDefault();
        
        const email = this.state.user.email;

        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            cache: false,
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                email: this.state.user.email,
                password: this.state.user.password
            })       
        }).then(res => {
            if(res.status === 200){
                this.setState({
                    errors: {},                  
                });
                res.json().then(function(json){
                    Auth.authenticateUser(json.token, email);
                    this.context.router.replace('/');
                }.bind(this));
            } else {
                console.log('Login failed');
                res.json().then(function(json){
                    const errors = json.errors ? json.errors : {};
                    errors.summary = json.message;
                    this.setState({
                        errors
                    })
                }.bind(this));
            }
        })

    }

    changeUserInfo(event){
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        this.setState({user});
    }

    render(){
        return (
            <LoginForm onSubmit={this.processForm} 
                       onChange={this.changeUserInfo}
                       errors={this.state.errors} />
        );
    }
}

LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
}

export default LoginPage;