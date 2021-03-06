import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { Avatar, openModalForm } from 'common';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { bundle } from '@kineticdata/react';
import { I18n } from '@kineticdata/react';
import * as selectors from '../../redux/selectors';

const HELP_FORM_CONFIG = {
  formSlug: 'help',
  kappSlug: 'admin',
  title: 'Get Help',
  confirmationMessage: "We'll get you a response as soon as possible.",
};

const FEEDBACK_FORM_CONFIG = {
  formSlug: 'feedback',
  kappSlug: 'admin',
  title: 'Give Feedback',
  confirmationMessage:
    "Thanks for your feedback. We'll get that routed to the right team.",
};

const INVITE_OTHERS_FORM_CONFIG = {
  formSlug: 'invite-users',
  kappSlug: 'admin',
  title: 'Invite Others',
  confirmationMessage: "We'll send those invitations out right away.",
};

const KITCHEN_SINK_FORM_CONFIG = {
  formSlug: 'kitchen-sink-form',
  kappSlug: 'queue',
  title: 'Kitchen Sink',
  confirmationMessage: 'That was the kitchen sink, how fun.',
};

const ProfileDropdownComponent = ({
  profile,
  openFeedbackForm,
  openHelpForm,
  openInviteOthersForm,
  isOpen,
  toggle,
  isGuest,
}) => (
  <Dropdown isOpen={isOpen} toggle={toggle}>
    <DropdownToggle
      nav
      role="button"
      className="icon-wrapper"
      style={{ padding: '0 0.75rem' }}
    >
      <Avatar size={24} user={profile} previewable={false} />
    </DropdownToggle>
    <DropdownMenu right className="profile-menu">
      <div className="profile-header">
        <h6>
          {profile.displayName}
          <br />
          <small>{profile.email}</small>
        </h6>
      </div>
      <div className="profile-links">
        <div className="dropdown-divider" />
        <Link to="/profile/edit" className="dropdown-item" onClick={toggle}>
          <I18n>Profile</I18n>
        </Link>
        {profile.spaceAdmin && (
          <a
            role="button"
            tabIndex="0"
            onClick={openInviteOthersForm}
            className="dropdown-item"
          >
            <I18n>Invite Others</I18n>
          </a>
        )}
        {!isGuest && (
          <a
            role="button"
            tabIndex="0"
            onClick={openHelpForm}
            className="dropdown-item"
          >
            <I18n>Get Help</I18n>
          </a>
        )}
        {!isGuest && (
          <a
            role="button"
            tabIndex="0"
            onClick={openFeedbackForm}
            className="dropdown-item"
          >
            <I18n>Give Feedback</I18n>
          </a>
        )}
        {!isGuest && (
          <Link to="/about" className="dropdown-item" onClick={toggle}>
            <I18n>About My Space</I18n>
          </Link>
        )}
        <div className="dropdown-divider" />
        <a
          onClick={() => localStorage.removeItem('token')}
          href={`${bundle.spaceLocation()}/app/logout`}
          className="dropdown-item"
        >
          <I18n>Logout</I18n>
        </a>
      </div>
    </DropdownMenu>
  </Dropdown>
);

const mapStateToProps = state => ({
  profile: state.app.profile,
  isGuest: selectors.selectIsGuest(state),
});

export const ProfileDropdown = compose(
  connect(mapStateToProps),
  withState('isOpen', 'setIsOpen', false),
  withHandlers({
    openHelpForm: props => () => {
      props.setIsOpen(false);
      openModalForm(HELP_FORM_CONFIG);
    },
    openFeedbackForm: props => () => {
      props.setIsOpen(false);
      openModalForm(FEEDBACK_FORM_CONFIG);
    },
    openInviteOthersForm: props => () => {
      props.setIsOpen(false);
      openModalForm(INVITE_OTHERS_FORM_CONFIG);
    },
    openKitchenSinkForm: props => () => {
      props.setIsOpen(false);
      openModalForm(KITCHEN_SINK_FORM_CONFIG);
    },
    toggle: props => () => props.setIsOpen(open => !open),
  }),
)(ProfileDropdownComponent);
