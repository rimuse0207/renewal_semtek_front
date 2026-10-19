import { Request_Get_Axios } from "../../API";

// 1. Action Types
const FETCH_HOLIDAYS_REQUEST = "holiday/FETCH_HOLIDAYS_REQUEST";
const FETCH_HOLIDAYS_SUCCESS = "holiday/FETCH_HOLIDAYS_SUCCESS";
const FETCH_HOLIDAYS_FAILURE = "holiday/FETCH_HOLIDAYS_FAILURE";

// 2. Initial State
const initialState = {
  holidays: [],
  loading: false,
  isLoaded: false,
  error: null,
};

export const fetchHolidays = (year = new Date().getFullYear()) => {
  return async (dispatch, getState) => {
    const { isLoaded, loading } = getState().holiday;
    if (isLoaded || loading) return;

    dispatch({ type: FETCH_HOLIDAYS_REQUEST });

    try {
      const req = await Request_Get_Axios("/Home/Getting_Holiday_Lists");

      if (req.status) {
        dispatch({
          type: FETCH_HOLIDAYS_SUCCESS,
          payload: req.data,
        });
      }
    } catch (error) {
      console.error("휴일 정보 로드 실패:", error);
      dispatch({
        type: FETCH_HOLIDAYS_FAILURE,
        payload: error.message || "휴일 정보를 불러오지 못했습니다.",
      });
    }
  };
};

// 4. Reducer
export default function holidayReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_HOLIDAYS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_HOLIDAYS_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoaded: true,
        holidays: action.payload,
      };
    case FETCH_HOLIDAYS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
