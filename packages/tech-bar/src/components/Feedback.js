import React from 'react';
import { connect } from '../redux/store';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { DisplayTabs } from './Display';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { createSubmission } from '@kineticdata/react';
import { selectCurrentKapp, addToastAlert } from 'common';
import { TIME_FORMAT } from '../constants';
import { actions as appointmentActions } from '../redux/modules/appointments';
import { actions as walkInActions } from '../redux/modules/walkIns';
import { I18n, Moment } from '@kineticdata/react';

import moment from 'moment';

const FEEDBACK_FORM_SLUG = 'feedback';

export const FeedbackComponent = ({
  crosslink,
  techBarId,
  loading,
  getFilteredAppointments,
  handleExperienceClick,
  experience,
  input,
  setInput,
  appointment,
  setAppointment,
  disabled,
  feedbackIdentityRequired,
  resetExperience,
  handleSubmitFeedback,
}) => {
  const filteredAppointments =
    experience && input.length > 2 ? getFilteredAppointments() : null;
  return (
    <section className="tech-bar-display tech-bar-display--feedback">
      <div className="full-screen-container">
        {crosslink && (
          <DisplayTabs techBarId={techBarId} feedbackClassName={'bg-dark'} />
        )}
        <div className="header bg-dark" />
        <div className="body">
          <div className="form">
            <h1>
              <I18n>How was your experience?</I18n>
            </h1>
            <div className="experience-options">
              <button
                type="button"
                className="btn btn-success"
                disabled={disabled}
                onClick={() => handleExperienceClick('Positive')}
              >
                <span className="fa fa-smile-o" />
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={disabled}
                onClick={() => handleExperienceClick('Negative')}
              >
                <span className="fa fa-frown-o" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {experience && (
        <Modal
          isOpen={!!experience}
          toggle={resetExperience}
          size="md"
          className="feedback-identity-modal"
        >
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                type="button"
                className="btn btn-link"
                onClick={resetExperience}
              >
                <I18n>Cancel</I18n>
              </button>
              <span>
                <I18n>Tell Us Who You Are</I18n>
              </span>
            </h4>
          </div>
          <ModalBody>
            <div className="form">
              <div
                className={`form-group ${
                  feedbackIdentityRequired ? 'required' : ''
                }`}
              >
                <label htmlFor="appointment-search-input">
                  <I18n>Find Your Appointment by Name or Email</I18n>
                  {feedbackIdentityRequired ? (
                    <span className="text-danger">*</span>
                  ) : (
                    <span>
                      {' '}
                      (<I18n>Optional</I18n>)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="appointment-search-input"
                  id="appointment-search-input"
                  className="form-control"
                  autoComplete="off"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    setAppointment(null);
                  }}
                />
              </div>
              {filteredAppointments && (
                <div className="form-group">
                  {filteredAppointments.map(appt => (
                    <div
                      className={`tech-bar-appointment-card ${
                        appointment && appointment.id === appt.id
                          ? 'selected'
                          : ''
                      }`}
                      key={appt.id}
                    >
                      <div className="details">
                        <div>
                          {appt.displayName}{' '}
                          <span className="text-muted">
                            (<I18n>{appt.type}</I18n>)
                          </span>
                        </div>
                        <div className="text-muted">
                          <Moment
                            timestamp={moment(appt.eventTime, TIME_FORMAT)}
                            format={Moment.formats.time}
                          />
                          {' - '}
                          <I18n>{appt.eventType}</I18n>
                        </div>
                      </div>
                      {(!appointment || appointment.id !== appt.id) && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setAppointment(appt)}
                        >
                          <I18n>Select</I18n>
                        </button>
                      )}
                    </div>
                  ))}
                  {filteredAppointments.size === 0 &&
                    (loading ? (
                      <div className="text-center">
                        <span className="fa fa-spinner fa-spin" />
                      </div>
                    ) : (
                      <div className="alert alert-warning text-center">
                        <I18n>No appointments found.</I18n>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-primary"
              disabled={feedbackIdentityRequired && !appointment}
              onClick={() => handleSubmitFeedback()}
            >
              <I18n>Submit Feedback</I18n>
            </button>
          </ModalFooter>
        </Modal>
      )}
    </section>
  );
};

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
  loading: !state.appointments.today || !state.walkIns.today,
  errors: [state.appointments.error, state.walkIns.error].filter(e => e),
  appointments: state.appointments.today,
  walkIns: state.walkIns.today,
  records: (state.appointments.today || [])
    .map(a => ({
      id: a.id,
      type: 'Appointment',
      username: a.values['Requested For'],
      displayName: a.values['Requested For Display Name'],
      schedulerId: a.values['Scheduler Id'],
      eventType: a.values['Event Type'],
      eventDate: a.values['Event Date'],
      eventTime: a.values['Event Time'],
    }))
    .concat(
      (state.walkIns.today || []).map(w => ({
        id: w.id,
        type: 'Walk-In',
        username: w.values['Requested For'] || w.values['Email'],
        displayName:
          w.values['Requested For Display Name'] ||
          `${w.values['First Name']} ${w.values['Last Name']}`,
        schedulerId: w.values['Scheduler Id'],
        eventType: w.values['Event Type'],
        eventDate: w.values['Date'],
        eventTime: w.values['Time'],
      })),
    ),
});

export const mapDispatchToProps = {
  fetchTodayAppointmentsRequest:
    appointmentActions.fetchTodayAppointmentsRequest,
  fetchTodayWalkInsRequest: walkInActions.fetchTodayWalkInsRequest,
};

const getFilteredAppointments = ({ input, records }) => () =>
  records.filter(
    appt =>
      appt.username.toLowerCase().includes(input.toLowerCase()) ||
      appt.displayName.toLowerCase().includes(input.toLowerCase()),
  );

const resetExperience = ({
  experience,
  setExperience,
  input,
  setInput,
}) => () => {
  setExperience('');
  setInput('');
};

const handleExperienceClick = ({
  feedbackIdentityAvailable,
  setExperience,
  handleSubmitFeedback,
  techBarId,
  fetchTodayAppointmentsRequest,
  fetchTodayWalkInsRequest,
}) => value => {
  if (feedbackIdentityAvailable) {
    setExperience(value);
    fetchTodayAppointmentsRequest({ schedulerId: techBarId });
    fetchTodayWalkInsRequest({ schedulerId: techBarId });
  } else {
    handleSubmitFeedback({ Experience: value });
  }
};

const handleSubmitFeedback = ({
  kapp,
  techBarId,
  experience,
  appointment,
  resetExperience,
  setDisabled,
}) => values => {
  createSubmission({
    kappSlug: kapp.slug,
    formSlug: FEEDBACK_FORM_SLUG,
    values: values
      ? {
          ...values,
          'Scheduler Id': techBarId,
        }
      : {
          Experience: experience,
          'Scheduler Id': techBarId,
          ...(appointment
            ? {
                'Appointment Id': appointment.id,
                'Event Type': appointment.eventType,
                'Event Date': appointment.eventDate,
              }
            : {}),
        },
    completed: true,
  }).then(({ submission, error }) => {
    if (error) {
      addToastAlert({
        message:
          'There was an error while submitting your feedback. Please consult an administrator.',
        duration: 5000,
      });
    } else {
      addToastAlert({
        title: 'Thank You',
        message: 'Your feedback has been submitted.',
        severity: 'success',
        duration: 4000,
      });
      setDisabled(true);
      setTimeout(() => setDisabled(false), 4000);
    }
    resetExperience();
  });
};

export const Feedback = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ techBar, kapp }) => {
    return {
      techBarId: techBar.values['Id'],
      feedbackIdentityAvailable:
        techBar.settings.feedbackIdentitifcation !== 'Hidden',
      feedbackIdentityRequired:
        techBar.settings.feedbackIdentitifcation === 'Required',
    };
  }),
  withState('experience', 'setExperience', null),
  withState('input', 'setInput', ''),
  withState('appointment', 'setAppointment', null),
  withState('disabled', 'setDisabled', false),
  withHandlers({ resetExperience }),
  withHandlers({
    getFilteredAppointments,
    handleSubmitFeedback,
  }),
  withHandlers({ handleExperienceClick }),
)(FeedbackComponent);
