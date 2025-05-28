import {
  GameState,
  FETCH_GAMES_REQUEST,
  FETCH_GAMES_SUCCESS,
  FETCH_GAMES_FAILURE,
  START_GAME,
  END_GAME,
  UPDATE_SCORE,
  Game
} from '../types';

interface FetchGamesRequestAction {
  type: typeof FETCH_GAMES_REQUEST;
}

interface FetchGamesSuccessAction {
  type: typeof FETCH_GAMES_SUCCESS;
  payload: Game[];
}

interface FetchGamesFailureAction {
  type: typeof FETCH_GAMES_FAILURE;
  payload: string;
}

interface StartGameAction {
  type: typeof START_GAME;
  payload: Game;
}

interface EndGameAction {
  type: typeof END_GAME;
}

interface UpdateScoreAction {
  type: typeof UPDATE_SCORE;
  payload: number;
}

type GameActionTypes =
  | FetchGamesRequestAction
  | FetchGamesSuccessAction
  | FetchGamesFailureAction
  | StartGameAction
  | EndGameAction
  | UpdateScoreAction;

const initialState: GameState = {
  currentGame: null,
  gameList: [],
  score: 0,
  isPlaying: false,
  loading: false,
  error: null
};

const gameReducer = (state = initialState, action: GameActionTypes): GameState => {
  switch (action.type) {
    case FETCH_GAMES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_GAMES_SUCCESS:
      return {
        ...state,
        gameList: action.payload,
        loading: false,
        error: null
      };
    case FETCH_GAMES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case START_GAME:
      return {
        ...state,
        currentGame: action.payload,
        isPlaying: true,
        score: 0
      };
    case END_GAME:
      return {
        ...state,
        isPlaying: false
      };
    case UPDATE_SCORE:
      return {
        ...state,
        score: action.payload
      };
    default:
      return state;
  }
};

export default gameReducer; 