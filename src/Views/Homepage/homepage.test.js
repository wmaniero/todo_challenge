import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { UnwrappedHomepage } from "./";
import { 
    homepage as homepageReducer, 
    initialState as homePageInitialState 
} from "../../_reducers/homepage.reducer";
import { homepageConstants } from "../../_constants";

configure({ adapter: new Adapter() });

let component;
const mockProps = {
    recordedActions: []
};

describe("homepage Component", () => {
	beforeAll(() => {
		component = shallow(<UnwrappedHomepage {...mockProps} />);
	});

	it("displays initial todos", () => {
		expect(component.find("#total-todos").text()).toBe("0");
	});
});

describe("reducers", () => {
	describe("homepage", () => {
        let updatedState = {};
        
		it("handles add todo action", () => {
			updatedState = {
                loading: false,
                recordedActions: [],
                todos: [{
                    id: "todo-1",
                    name: "test name",
                    description: "test description",
                    creationDate: "2020-07-20 12:00:00"
                }]
			};
			expect(
				homepageReducer({ ...homePageInitialState }, { 
                    type: homepageConstants.CREATE_TODO,
                    payload: {
                        id: "todo-1",
                        name: "test name",
                        description: "test description",
                        creationDate: "2020-07-20 12:00:00"
                    }
                })
			).toEqual(updatedState);
        });
        
		it("handles update todo action", () => {
			updatedState = {
                loading: false,
                recordedActions: [],
                todos: [{
                    id: "todo-1",
                    name: "test name updated",
                    description: "test description updated",
                    creationDate: "2020-07-20 12:00:00"
                }]
			};
			expect(
				homepageReducer({ 
                    ...homePageInitialState, 
                    todos: [{
                        id: "todo-1",
                        name: "test name",
                        description: "test description",
                        creationDate: "2020-07-20 12:00:00"
                    }]
                }, { 
                    type: homepageConstants.UPDATE_TODO,
                    payload: {
                        id: "todo-1",
                        name: "test name updated",
                        description: "test description updated",
                        creationDate: "2020-07-20 12:00:00"
                    }
                })
			).toEqual(updatedState);
		});
        
		it("handles delete todo action", () => {
			updatedState = {
                loading: false,
                recordedActions: [],
                todos: []
			};
			expect(
				homepageReducer({ 
                    ...homePageInitialState, 
                    todos: [{
                        id: "todo-1",
                        name: "test name",
                        description: "test description",
                        creationDate: "2020-07-20 12:00:00"
                    }]
                }, { 
                    type: homepageConstants.DELETE_TODO,
                    payload: {
                        id: "todo-1",
                        name: "test name",
                        description: "test description",
                        creationDate: "2020-07-20 12:00:00"
                    }
                })
			).toEqual(updatedState);
		});
        
		it("handles record action", () => {
			updatedState = {
                loading: false,
                todos: [],
                recordedActions: [{
                    action: homepageConstants.CREATE_TODO,
                    payload: {
                        id: "todo-1",
                        name: "test name",
                        description: "test description",
                        creationDate: "2020-07-20 12:00:00"
                    }
                }]
			};
			expect(
				homepageReducer({ 
                    ...homePageInitialState
                }, { 
                    type: homepageConstants.RECORD_ACTION,
                    payload: {
                        action: homepageConstants.CREATE_TODO,
                        payload: {
                            id: "todo-1",
                            name: "test name",
                            description: "test description",
                            creationDate: "2020-07-20 12:00:00"
                        }
                    }
                })
			).toEqual(updatedState);
		});
        
		it("handles clear recording action", () => {
			updatedState = {
                loading: false,
                todos: [],
                recordedActions: []
			};
			expect(
				homepageReducer({ 
                    ...homePageInitialState
                }, { 
                    type: homepageConstants.CLEAR_RECORDINGS
                })
			).toEqual(updatedState);
        });
        
		it("handles play recording action", () => {
			updatedState = {
                loading: false,
                todos: [{
                    id: "todo-1",
                    name: "test name",
                    description: "test description",
                    creationDate: "2020-07-20 12:00:00"
                }],
                recordedActions: [{
                    action: homepageConstants.CREATE_TODO,
                    payload: {
                        id: "todo-1",
                        name: "test name",
                        description: "test description",
                        creationDate: "2020-07-20 12:00:00"
                    }
                }]
            };
            
            let stateAfterRecordedAction = homepageReducer({ 
                ...homePageInitialState
            }, { 
                type: homepageConstants.RECORD_ACTION,
                payload: {
                    action: homepageConstants.CREATE_TODO,
                    payload: {
                        id: "todo-1",
                        name: "test name",
                        description: "test description",
                        creationDate: "2020-07-20 12:00:00"
                    }
                }
            });

			expect(homepageReducer({ 
                ...stateAfterRecordedAction
            }, { 
                type: homepageConstants.CREATE_TODO,
                payload: {
                    id: "todo-1",
                    name: "test name",
                    description: "test description",
                    creationDate: "2020-07-20 12:00:00"
                }
            })
            ).toEqual(updatedState);
		});
	});
});
