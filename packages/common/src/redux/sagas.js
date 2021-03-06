import { all } from 'redux-saga/effects';
import { watchSchedulers } from './sagas/schedulers';
import { watchSearchHistory } from './sagas/searchHistory';
import { watchDiscussionRest } from './sagas/discussions.rest';
import { watchActivityFeed } from './sagas/activityFeed';
import { watchLocationChange } from './sagas/location';
import { watchToasts } from './sagas/toasts';

export default function*() {
  yield all([
    watchSchedulers(),
    watchSearchHistory(),
    watchDiscussionRest(),
    watchActivityFeed(),
    watchLocationChange(),
    watchToasts(),
  ]);
}
