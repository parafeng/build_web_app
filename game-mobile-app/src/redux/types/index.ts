// Auth types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

// Game types
export const FETCH_GAMES_REQUEST = 'FETCH_GAMES_REQUEST';
export const FETCH_GAMES_SUCCESS = 'FETCH_GAMES_SUCCESS';
export const FETCH_GAMES_FAILURE = 'FETCH_GAMES_FAILURE';
export const START_GAME = 'START_GAME';
export const END_GAME = 'END_GAME';
export const UPDATE_SCORE = 'UPDATE_SCORE';

// User types
export const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
export const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

// Type definitions for state
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  selectedAvatar?: number;
  score?: number;
  level?: number;
  coins?: number;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  highestScore?: number;
}

export interface GameState {
  currentGame: Game | null;
  gameList: Game[];
  score: number;
  isPlaying: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  game: GameState;
  profile: ProfileState;
}

// Action types
interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: User;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

interface RegisterRequestAction {
  type: typeof REGISTER_REQUEST;
}

interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
}

interface RegisterFailureAction {
  type: typeof REGISTER_FAILURE;
  payload: string;
}

export type AuthActionTypes = 
  | LoginRequestAction 
  | LoginSuccessAction 
  | LoginFailureAction 
  | LogoutAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction; 