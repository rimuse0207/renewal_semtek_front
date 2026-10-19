import { useDispatch } from "react-redux";
import RouterMainPage from "./routes";
import { fetchHolidays } from "./Models/ReduxThunk/holiday";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);
  return (
    <div className="App">
      <RouterMainPage></RouterMainPage>
    </div>
  );
}

export default App;
