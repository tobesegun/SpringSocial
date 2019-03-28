import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { loginAdmin } from '../../actions/authActions';

 class LoginAdmin extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      password: '',
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

   componentDidMount() {
     if (this.props.auth.isAuthenticated) {
       this.props.history.push('/dashboardAdmin');
     }
   }

   componentWillReceiveProps(nextProps) {
     if (nextProps.auth.isAuthenticated) {
       this.props.history.push('/dashboardAdmin');
     }

     if (nextProps.errors) {
       this.setState({
         errors: nextProps.errors
       });
     }
   }


   onSubmit(e) {
     e.preventDefault();


     const adminData = {
       name: this.state.name,
       password: this.state.password,
     };

     this.props.loginAdmin(adminData);
   }


  onChange(e){
    this.setState({[e.target.name]: e.target.value});
  }
  render() {
   const { errors } = this.state;

    return (
  <div className="login">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Log In</h1>
          <p className="lead text-center">Sigin your Admin account
          </p>
          < form onSubmit = {
            this.onSubmit
          }>
            <div className="form-group">
              < input type = "name"
              className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.name
                    })}
              placeholder = "name"
              name = "name"
              value = {
                this.state.name
              }
              onChange = {
                this.onChange
              }
              />
              {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
            </div>
            <div className="form-group">
              < input type = "password"
              className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password
                    })}
              placeholder = "Password"
              name = "password"
              value = {
                this.state.password
              }
              onChange = {
                this.onChange
              }
              />
               {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
            </div>
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div>
    )
  }
}
 
LoginAdmin.propTypes = {
  loginAdmin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginAdmin })(LoginAdmin);

