import { MainContext } from "./MainContext";
import useMain from "../hocks/useMain";

function MainContextProvider({ children }) {
  const useMainGlobal = useMain();
  return (
    <MainContext.Provider value={useMainGlobal}>
      {children}
    </MainContext.Provider>
  );
}

export default MainContextProvider;
