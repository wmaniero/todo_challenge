import { homepageConstants } from "../_constants";

export const homepageActions = {
    createTodo,
    updateTodo,
    deleteTodo,
    recordAction,
    clearRecordings,
    playRecordings
};

function createTodo(payload) {
    return { type: homepageConstants.CREATE_TODO, payload };
}

function updateTodo(payload) {
    return { type: homepageConstants.UPDATE_TODO, payload };
}

function deleteTodo(payload) {
    return { type: homepageConstants.DELETE_TODO, payload };
}

function recordAction(payload) {
    return { type: homepageConstants.RECORD_ACTION, payload };
}

function clearRecordings(payload) {
    return { type: homepageConstants.CLEAR_RECORDINGS, payload };
}

function playRecordings(payload) {
    return { type: homepageConstants.PLAY_RECORDINGS, payload };
}
