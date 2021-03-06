import React from 'react';
import { I18n } from '@kineticdata/react';

const GenericMessage = ({ className, heading, title, message, actions }) => (
  <div className={className}>
    {heading && <div className={`${className}__heading`}>{heading}</div>}
    {title && (
      <div className={`${className}__title`}>
        <I18n>{title}</I18n>
      </div>
    )}
    {message && (
      <div className={`${className}__message`}>
        <I18n>{message}</I18n>
      </div>
    )}
    {actions && (
      <div className={`${className}__actions`}>
        <div className="btn-group">
          {actions.filter(a => (a.label || a.icon) && a.onClick).map((a, i) => (
            <button
              key={`action-${i}`}
              className={`btn btn-inverse`}
              onClick={a.onClick}
            >
              {a.icon && <span className={`fa fa-fw ${a.icon}`} />}
              {a.label && (
                <span>
                  <I18n>{a.label}</I18n>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

export const EmptyMessage = ({ title, ...rest }) => (
  <GenericMessage
    className="empty-state"
    {...rest}
    title={title || 'No results found.'}
  />
);

export const ErrorMessage = ({ title, ...rest }) => (
  <GenericMessage
    className="error-state"
    heading={<I18n>Oops!</I18n>}
    {...rest}
    title={title || 'An error occurred.'}
  />
);

export const InfoMessage = props =>
  props.title || props.message ? (
    <GenericMessage className="info-state" {...props} />
  ) : null;

export const LoadingMessage = ({ title, ...rest }) => (
  <GenericMessage
    className="loading-state"
    heading={<span className="fa fa-spinner fa-spin fa-lg fa-fw" />}
    {...rest}
    title={title || 'Loading'}
  />
);

export const StateListWrapper = ({
  data,
  error,
  loading,
  children,
  errorTitle,
  errorMessage,
  errorActions,
  loadingTitle,
  loadingMessage,
  emptyTitle,
  emptyMessage,
  emptyActions,
  components = {},
}) => {
  if (error) {
    const ErrorMessageComponent = components.ErrorMessage || ErrorMessage;
    return (
      <ErrorMessageComponent
        title={errorTitle}
        message={errorMessage === true ? error.message || error : errorMessage}
        actions={errorActions}
      />
    );
  } else if (loading || (typeof loading === 'undefined' && !data)) {
    const LoadingMessageComponent = components.LoadingMessage || LoadingMessage;
    return (
      <LoadingMessageComponent title={loadingTitle} message={loadingMessage} />
    );
  } else if (!data || data.length === 0 || data.size === 0) {
    const EmptyMessageComponent = components.EmptyMessage || EmptyMessage;
    return (
      <EmptyMessageComponent
        title={emptyTitle}
        message={emptyMessage}
        actions={emptyActions}
      />
    );
  } else {
    return children(data);
  }
};
