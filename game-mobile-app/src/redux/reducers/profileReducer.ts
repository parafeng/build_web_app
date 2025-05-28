import {
  ProfileState,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  User
} from '../types';

interface FetchProfileRequestAction {
  type: typeof FETCH_PROFILE_REQUEST;
}

interface FetchProfileSuccessAction {
  type: typeof FETCH_PROFILE_SUCCESS;
  payload: User;
}

interface FetchProfileFailureAction {
  type: typeof FETCH_PROFILE_FAILURE;
  payload: string;
}

interface UpdateProfileRequestAction {
  type: typeof UPDATE_PROFILE_REQUEST;
}

interface UpdateProfileSuccessAction {
  type: typeof UPDATE_PROFILE_SUCCESS;
  payload: User;
}

interface UpdateProfileFailureAction {
  type: typeof UPDATE_PROFILE_FAILURE;
  payload: string;
}

type ProfileActionTypes =
  | FetchProfileRequestAction
  | FetchProfileSuccessAction
  | FetchProfileFailureAction
  | UpdateProfileRequestAction
  | UpdateProfileSuccessAction
  | UpdateProfileFailureAction;

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null
};

const profileReducer = (state = initialState, action: ProfileActionTypes): ProfileState => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false,
        error: null
      };
    case FETCH_PROFILE_FAILURE:
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default profileReducer; 