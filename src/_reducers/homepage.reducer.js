import { homepageConstants } from "../_constants";

export const initialState = {
    loading: false,
    todos: [],
    recordedActions: []
};

export function homepage(state = initialState, action) {
    switch (action.type) {
        case homepageConstants.CREATE_TODO:

            return {
                ...state,
                todos: [
                    ...state.todos,
                    action.payload
                ]
            }
            
        case homepageConstants.UPDATE_TODO:

            return Object.assign({}, state, {
                todos: state.todos.map(todo => {
                    return todo.id === action.payload.id ? action.payload : todo;
                })
            }); 

        case homepageConstants.DELETE_TODO:

            return {
                ...state,
                todos: state.todos.filter((todo) => {
                    return todo.id !== action.payload.id
                })
            }

        case homepageConstants.RECORD_ACTION:

            return {
                ...state,
                recordedActions: [
                    ...state.recordedActions,
                    action.payload
                ]
            }

        case homepageConstants.CLEAR_RECORDINGS:

            return {
                ...state,
                recordedActions: []
            }
            
        case homepageConstants.PLAY_RECORDINGS:

            return {
                ...state,
                todos: []
            }

        default:
            return state;
    }
}
