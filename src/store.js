import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {hashHistory} from 'react-router';
import {createLogger} from 'redux-logger'
import reducers from './reducers';

const store = createStore(
    reducers,
    // compose(persistState(['auth', 'ui'])),
    applyMiddleware(createLogger(), thunkMiddleware, routerMiddleware(hashHistory))
);
export default store;