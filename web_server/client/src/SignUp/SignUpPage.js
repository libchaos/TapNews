import React, {PropTypes} from 'react';
import SignUpForm from './SignUpForm';
import Auth from '../Auth/Auth';

class SignUpPage extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            errors: {
                
            },
            user: {
                email: '',
                password: '',
                confirm_password: ''
            }
        }

        this.processForm = this.processForm.bind(this);
        this.changeUserInfo = this.changeUserInfo.bind(this);
    }

    processForm(event){
        event.preventDefault();
        const email = this.state.user.email;
        const password = this.state.user.password;
        const confirm_password = this.state.confirm_password;
        if(password !== confirm_password){
            return;
        }
        
        fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            cache: false,
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                email: this.state.user.email,
                password: this.state.password
            })       
        }).then(res => {
            if(res.status === 200){
                this.setState({
                    errors: {},                  
                });
                res.json().then(function(json){
                    Auth.authenticateUser(json.token, email);
                    this.context.router.replace('/login');
                }.bind(this));
            } else {
                console.log('Signup failed');
                res.json().then(function(json){
                    const errors = json.errors ? json.errors : {};
                    errors.summary = errors;
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
        if(this.state.user.password !== this.state.user.confirm_password){
            const errors = this.state.errors;
            errors.password = "Password and Confirm Password don't match";
            this.setState({errors});
        } else {
            const errors = this.state.errors;
            errors.password = '';
            this.setState({errors});
        }
        
    }

    render(){
        return (
            <SignUpForm onSubmit={this.processForm} 
                       onChange={this.changeUserInfo}
                       errors={this.state.errors} />
        );
    }
}

SignUpPage.contextTypes = {
    router: PropTypes.object.isRequired
}

export default SignUpPage;