import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import { createSubmission } from '@kineticdata/react';

const RequestAccount = ({
  submitted,
  email,
  handleEmail,
  firstName,
  handleFirstName,
  lastName,
  handleLastName,
  formValid,
  handleSubmit,
}) =>
  submitted ? (
    <div className="login-form-container">
      <div className="submitted">
        <h3 className="form-title">Create Account</h3>
        <p className="subtitle">
          Your request for a new account has been received.
        </p>
        <p className="explaination">
          Your request for a new account is being reviewed by the team. Once
          approved you will receive an email with further instructions.
        </p>
      </div>
    </div>
  ) : (
    <form className="login-form-container" onSubmit={handleSubmit}>
      <div>
        <h3 className="form-title">Create Account</h3>
        <div className="name-section">
          <div className="form-group">
            <label className="required">First Name</label>
            <input
              autoFocus
              className="form-control"
              type="text"
              value={firstName}
              onChange={handleFirstName}
            />
          </div>
          <div className="form-group">
            <label className="required">Last Name</label>
            <input
              className="form-control"
              type="text"
              value={lastName}
              onChange={handleLastName}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="required">Email</label>
          <input
            className="form-control"
            type="text"
            value={email}
            onChange={handleEmail}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label>Comments</label>
          <input className="form-control" type="text" />
        </div>
      </div>
      <div className="button-group">
        <button className="btn btn-primary" type="submit" disabled={!formValid}>
          Request Account
        </button>
        <hr />
        <Link className="btn btn-link" to="/login">
          &larr; Back to Sign In
        </Link>
      </div>
    </form>
  );

const validateForm = ({ setFormValid, firstName, lastName, email }) => () =>
  setFormValid(firstName.length > 0 && lastName.length > 0 && email.length > 0);

const handleFirstName = ({ setFirstName, validateForm }) => e => {
  setFirstName(e.target.value);
  validateForm();
};
const handleLastName = ({ setLastName, validateForm }) => e => {
  setLastName(e.target.value);
  validateForm();
};
const handlePhone = ({ setPhone, validateForm }) => e => {
  setPhone(e.target.value);
};
const handleComments = ({ setComments }) => e => setComments(e.target.value);
const handleEmail = ({ setEmail, validateForm }) => e => {
  setEmail(e.target.value);
  validateForm();
};
const handleSubmit = ({
  firstName,
  lastName,
  email,
  phone,
  comments,
  setSubmitted,
  setError,
}) => async e => {
  e.preventDefault();

  try {
    await createSubmission({
      kappSlug: 'admin',
      formSlug: 'account-request',
      values: {
        'First Name': firstName,
        'Last Name': lastName,
        Email: email,
        'Phone Number': phone,
        Comments: comments,
      },
      authAssumed: false,
    });

    setSubmitted(true);
  } catch (e) {
    setError(
      'There was a problem requesting your new account. Please verify the information you entered.',
    );
  }
};

export const RequestAccountForm = compose(
  withState('submitted', 'setSubmitted', false),
  withState('error', 'setError', ''),
  withState('firstName', 'setFirstName', ''),
  withState('lastName', 'setLastName', ''),
  withState('phone', 'setPhone', ''),
  withState('comments', 'setComments', ''),
  withState('formValid', 'setFormValid', false),
  withHandlers({
    validateForm,
  }),
  withHandlers({
    handleFirstName,
    handleLastName,
    handlePhone,
    handleComments,
    handleEmail,
    handleSubmit,
  }),
)(RequestAccount);
