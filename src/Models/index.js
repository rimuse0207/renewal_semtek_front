import { combineReducers } from "redux";
import Login_Info_Reducer_State from "./LoginInfoReducer/LoginInfoReduce";
import holidayReducer from "./ReduxThunk/holiday";

const rootReducer = combineReducers({
  Login_Info_Reducer_State,
  holiday: holidayReducer,
});

export default rootReducer;
