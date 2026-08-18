import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./redux/cart/cartSlice";

function App() {
  const dispatch = useDispatch();

const { isAuthenticated } = useSelector(
    state => state.auth
);

useEffect(() => {

    if(isAuthenticated){
        dispatch(fetchCart());
    }

},[isAuthenticated]);
  return (
    <>
      <AppRoutes />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default App;