import { RouterProvider, createBrowserRouter } from "react-router-dom";

import PatentIntro from "./components/PatentIntro";
import PatentDetails from "./components/PatentsDetails";
import PatentContextProvider from "./context/PatentContextProvider";




function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PatentIntro />,
    },


    {
      path: '/patent-details/:patentId',
      element: <PatentDetails />
    },


  ]);

  return (
    <div className="App overflow-hidden">
      {/* <Navbar />*/}

      <PatentContextProvider>
        <RouterProvider router={router} />

      </PatentContextProvider>




    </div>
  );
}

export default App;
