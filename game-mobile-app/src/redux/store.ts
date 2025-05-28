import { createStore, applyMiddleware, Store, AnyAction } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { RootState } from './types';

// Tạo store với middleware thunk để xử lý async actions
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
) as unknown as Store<RootState, AnyAction>;

export default store; 