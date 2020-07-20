import React from "react";
import { connect } from "react-redux";
import { homepageActions } from "../../_actions";
import { uniqueId } from "lodash/util";
import { homepageConstants } from "../../_constants";
import { store, buildPageTitle } from "../../_helpers";
import moment from "moment";

class Homepage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            todoInputName: "",
            todoInputDescription: "",
            updatingTodo: null,
            recording: false,
            playingRecording: false,
        };
        
        this.onSubmit = this._onSubmit.bind(this);
        this.onUpdateSubmit = this._onUpdateSubmit.bind(this);
        this.onStartRecording = this._onStartRecording.bind(this);
        this.onStoptRecording = this._onStopRecording.bind(this);
        this.onClearRecording = this._onClearRecording.bind(this);
        this.onPlayRecording = this._onPlayRecording.bind(this);
    }

    componentDidMount() {
        //Set moment locale globally
        moment().locale("it");

        //Set page title
        document.title = buildPageTitle("List");
    }

    /**
     * Handle todo form submission
     */
    _onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const { createTodo, recordAction } = this.props;
        const { todoInputName, todoInputDescription, recording } = this.state;

        //Ignore empty entries
        if(
            todoInputName.trim() !== "" &&
            todoInputDescription.trim() !== ""
        ) {
            const createTodoPayload = {
                id: uniqueId("todo-"),
                name: todoInputName,
                description: todoInputDescription,
                creationDate: moment().format("YYYY-MM-DD HH:mm:ss")
            };
            //Create todo in store
            createTodo(createTodoPayload);

            //If recording, also record user action with payload
            if(recording) {
                recordAction({
                    action: homepageConstants.CREATE_TODO,
                    payload: createTodoPayload
                });
            }
            this.setState({ 
                todoInputName: "", 
                todoInputDescription: "" 
            });
        }
    }

    /**
     * Handle update todo form submission
     */
    _onUpdateSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const { updateTodo, recordAction } = this.props;
        const { updatingTodo, recording } = this.state;
        if(
            updatingTodo !== undefined &&
            updatingTodo !== null &&
            updatingTodo.name !== undefined &&
            updatingTodo.name !== null &&
            updatingTodo.name !== "" &&
            updatingTodo.description !== undefined &&
            updatingTodo.description !== null &&
            updatingTodo.description !== ""
        ) {
            updateTodo(updatingTodo);

            //If recording, also record user action with payload
            if(recording) {
                recordAction({
                    action: homepageConstants.UPDATE_TODO,
                    payload: updatingTodo
                });
            }
            this.setState({ updatingTodo: null });
        }
    }

    /**
     *
     * Handle todo input modification and store current value
     * in component state
     * 
     * @param {*} event
     */
    _onChangeText(event, field) {
        this.setState({ [field]: event.target.value });
    }

    /**
     * Start recording user actions
     */
    _onStartRecording() {
        this.setState({ recording: true });
    }

    /**
     * Stop recording user actions
     */
    _onStopRecording() {
        this.setState({ recording: false });
    }

    /**
     * Clear recording
     */
    _onClearRecording() {
        const { clearRecordings } = this.props;

        clearRecordings();
    }

    /**
     * Play recording
     */
    _onPlayRecording() {
        const { playRecordings, recordedActions } = this.props;

        //Unset todos
        playRecordings();

        //Play recorded actions
        if(
            recordedActions !== undefined &&
            recordedActions !== null &&
            recordedActions.length > 0
        ) {
            this.setState({ playingRecording: true }, () => {

                recordedActions.forEach((record, recordIndex) => {
                    setTimeout(() => {
                        store.dispatch({
                            type: record.action,
                            payload: record.payload
                        });

                        if(recordIndex === (recordedActions.length - 1)) {
                            this.setState({ playingRecording: false });
                        }
                    }, 1000*recordIndex);
                });
            });
        }
    }

    /**
     * Delete todo 
     * 
     * @param {*} todo 
     */
    _deleteTodo(todo) {
        const { deleteTodo, recordAction } = this.props;
        const { recording } = this.state;

        deleteTodo(todo);

        //If recording, also record user action with payload
        if(recording) {
            recordAction({
                action: homepageConstants.DELETE_TODO,
                payload: todo
            });
        }
    }

    /**
     * Store current todo element as updating todo so we can
     * show input instead of default label
     * 
     * @param {*} todo 
     */
    _setUpdatingTodo(todo) {
        this.setState({ updatingTodo: todo });
    }

    /**
     * Update property of updatingTodo element
     * 
     * @param {*} event 
     */
    _setUpdatingTodoProperty(event, field) {
        this.setState({
            updatingTodo: {
                ...this.state.updatingTodo,
                [field]: event.target.value
            }
        });
    }

    /**
     * Render list of stored todos
     */
    _renderTodos() {
        const { todos } = this.props;
        const { updatingTodo } = this.state;

        if(
            todos === undefined ||
            todos === null ||
            todos.length === 0
        ) {
            return null;
        }

        return (
            <ul className="list">
                {todos.map((todo, todoIndex) => {
                    const itemKey = `todo[${todoIndex}]`;

                    return (
                        <li key={itemKey} onDoubleClick={() => this._setUpdatingTodo(todo)}>
                        {
                            (
                                updatingTodo !== undefined &&
                                updatingTodo !== null &&
                                updatingTodo.id === todo.id
                            ) ? 
                            <React.Fragment>
                                <form className="w-100" method="POST" action="" autoComplete="off" noValidate onSubmit={this.onUpdateSubmit}>
                                    <div className="form-inline">
                                        <div className="form-inline-item">
                                            <label htmlFor="inputName">Name</label>
                                            <input 
                                                type="text" 
                                                defaultValue={updatingTodo.name} 
                                                onChange={(event) => this._setUpdatingTodoProperty(event, "name")} />
                                        </div>
                                        <div className="form-inline-item">
                                            <label htmlFor="inputDescription">Description</label>
                                            <input 
                                                type="text" 
                                                defaultValue={updatingTodo.description} 
                                                onChange={(event) => this._setUpdatingTodoProperty(event, "description")} />
                                        </div>
                                        <div className="form-inline-cta">
                                            <button className="cta mr-10" type="submit">
                                                Save
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                                </svg>
                                            </button>
                                            <button className="cta" type="button" onClick={() => this._setUpdatingTodo(null)}>
                                                Cancel
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                                                    <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </React.Fragment> :
                            <React.Fragment>
                                <div className="w-100"><label>Name</label>{todo.name}</div>
                                <div className="w-100"><label>Description</label>{todo.description}</div>
                                <button className="cta" onClick={() => this._deleteTodo(todo)}>
                                    Remove
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                                        <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                                    </svg>
                                </button>
                            </React.Fragment>
                        }
                        </li>
                    )
                })}
            </ul>
        );
    }

    render() {
        const { todos, recordedActions } = this.props;
        const { 
            todoInputName, 
            todoInputDescription, 
            recording, 
            playingRecording
        } = this.state;

        let totalTodos = 0;
        if(
            todos !== undefined &&
            todos !== null &&
            todos.length > 0
        ) {
            totalTodos = todos.length;
        }

        return (
            <div className="page-wrapper">
                <div className="grid">
                    <div className="column column-tools">
                        <div className="record-wrapper">
                            {(recording) ? <div><label>Recording...</label></div> : null}
                            {
                                (
                                    !recording &&
                                    !playingRecording &&
                                    recordedActions !== undefined &&
                                    recordedActions !== null &&
                                    recordedActions.length > 0
                                ) ? 
                                <React.Fragment>
                                <div className="grid">
                                    <div className="column column-cta">
                                        <button className="cta cta-block" type="button" onClick={this.onClearRecording}>
                                            Clear recording
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                            </svg>                                            
                                        </button>
                                    </div>
                                    <div className="column column-cta">
                                        <button className="cta cta-block" type="button" onClick={this.onPlayRecording}>
                                            Play recording
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                            </svg>                                            
                                        </button> 
                                    </div>
                                </div>
                                </React.Fragment> : 
                                (playingRecording) ?
                                <div className="playing-recording">Playing recording...</div> : null
                            }
                            {
                                (!recording && recordedActions.length === 0) ? 
                                <div>
                                    <div><label>Record your actions</label></div>
                                    <button className="cta" type="button" onClick={this.onStartRecording}>
                                        Record
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-circle-fill red" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="8" cy="8" r="8"/>
                                        </svg>
                                    </button>
                                </div> :
                                (recording) ?
                                <div>
                                    <button className="cta" type="button" onClick={this.onStoptRecording}>
                                        Stop recording
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-circle-fill red pulse" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="8" cy="8" r="8"/>
                                        </svg>
                                    </button>
                                </div> : null
                            }
                        </div>
                    </div>

                    <div className="column column-main">
                        <h1>Total TODOs: <span id="total-todos">{totalTodos}</span></h1>
                        {this._renderTodos()}
                        {
                            (!playingRecording ) ?
                            <form method="POST" action="" autoComplete="off" noValidate onSubmit={this.onSubmit}>
                                <div className="form-inline">
                                    <div className="form-inline-item">
                                        <label htmlFor="inputName">Name</label>
                                        <input 
                                            type="text" 
                                            id="inputName" 
                                            placeholder="Eg. Homeworks" 
                                            autoComplete="off" 
                                            onChange={(event) => this._onChangeText(event, "todoInputName")} 
                                            value={todoInputName} />
                                    </div>
                                    <div className="form-inline-item">
                                        <label htmlFor="inputDescription">Description</label>
                                        <input 
                                            type="text" 
                                            id="inputDescription" 
                                            placeholder="Do homeworks for tomorror morning" 
                                            autoComplete="off" 
                                            onChange={(event) => this._onChangeText(event, "todoInputDescription")} 
                                            value={todoInputDescription} />
                                    </div>
                                    <div className="form-inline-cta">
                                        <button className="cta" type="submit">
                                            Add
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
                                                <path fillRule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
                                            </svg>                                            
                                        </button>
                                    </div>
                                </div>
                            </form> : null
                        }
                    </div>
                </div>


                
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { 
        todos, 
        recordedActions
    } = state.homepage;
    
    return { 
        todos,
        recordedActions
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createTodo: (payload) => {
            dispatch(homepageActions.createTodo(payload));
        },
        updateTodo: (payload) => {
            dispatch(homepageActions.updateTodo(payload));
        },
        deleteTodo: (payload) => {
            dispatch(homepageActions.deleteTodo(payload));
        },
        recordAction: (payload) => {
            dispatch(homepageActions.recordAction(payload));
        },
        clearRecordings: (payload) => {
            dispatch(homepageActions.clearRecordings(payload));
        },
        playRecordings: (payload) => {
            dispatch(homepageActions.playRecordings(payload));
        },
    };
}
const wrappedHomepage = connect(mapStateToProps, mapDispatchToProps)(Homepage);

export { 
    Homepage as UnwrappedHomepage,
    wrappedHomepage as Homepage
};
