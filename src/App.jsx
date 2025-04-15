import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./routes/contexts/authContext";

import "./App.css";
import Login from "./routes/login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/*Pagina de login*/}
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
