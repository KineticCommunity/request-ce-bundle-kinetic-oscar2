import { reducer as app } from './modules/app';
import servicesAppReducer from './modules/servicesApp';
import formsReducer from './modules/forms';
import searchReducer from './modules/search';
import submissionsReducer from './modules/submissions';
import submissionReducer from './modules/submission';
import submissionCountsReducer from './modules/submissionCounts';
import settingsFormsReducer from './modules/settingsForms';
import settingsCategoriesReducer from './modules/settingsCategories';
import { reducer as errors } from './modules/errors';
import { reducer as settingsDatastore } from './modules/settingsDatastore';

export default {
  app,
  forms: formsReducer,
  search: searchReducer,
  servicesApp: servicesAppReducer,
  submissions: submissionsReducer,
  submission: submissionReducer,
  submissionCounts: submissionCountsReducer,
  settingsForms: settingsFormsReducer,
  settingsCategories: settingsCategoriesReducer,
  settingsDatastore: settingsDatastore,
  errors: errors,
};
