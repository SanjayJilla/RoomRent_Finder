import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import "./App.css";
import Register from "./pages/Register.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import AddRoom from "./pages/AddRoom.jsx";
import EditRoom from "./pages/EditRoom.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import UploadRoomImage from "./pages/UploadRoomImage.jsx"; 
import ManageRoomImages from "./pages/ManageRoomImages.jsx";
import Favorites from "./pages/favorites.jsx";
import OwnerEnquiries from "./pages/OwnerEnquiries.jsx";
import StudentRegister from "./pages/StudentRegister.jsx";
import StudentLogin from "./pages/StudentLogin.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentChangePassword from "./pages/StudentChangePassword";
import StudentProfile from "./pages/StudentProfile";

import OwnerProfile from "./pages/OwnerProfile";


function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("access_token");

  return token ? children : <Navigate to="/login" replace />;
}
function StudentProtectedRoute({ children }) {
  const token = sessionStorage.getItem("student_access_token");

  return token
    ? children
    : <Navigate to="/student/login" replace />;
}

function App() {
  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/login">Owner Login</Link>
        <Link to="/register">Owner Register</Link>
        <Link to="/favorites">♥ Saved Rooms</Link>
        <Link to="/student/login">Student Login</Link>
        <Link to="/student/register">Student Register</Link>
        
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/add-room"
          element={
            <ProtectedRoute>
              <AddRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/edit-room/:roomId"
          element={
            <ProtectedRoute>
              <EditRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:roomId"
          element={<RoomDetails />}
        />
        <Route
          path="/owner/upload-image/:roomId"
          element={
            <ProtectedRoute>
              <UploadRoomImage />
            </ProtectedRoute>
          }
        />
        <Route path="/owner/rooms/:roomId/upload"
            element={
                <ProtectedRoute>
                    <UploadRoomImage />
                </ProtectedRoute>
            }
        />  
        <Route
        path="/owner/rooms/:roomId/photos"
        element={
            <ProtectedRoute>
            <ManageRoomImages />
            </ProtectedRoute>
        }
        />
        <Route path="/favorites" element={<Favorites />} />
        <Route
        path="/owner/enquiries"
        element={
            <ProtectedRoute>
            <OwnerEnquiries />
            </ProtectedRoute>
        }
        />
        <Route

        path="/student/register"
        element={<StudentRegister />}
        />

        <Route
        path="/student/login"
        element={<StudentLogin />}
        />

        <Route
        path="/student/dashboard"
        element={
            <StudentProtectedRoute>
            <StudentDashboard />
            </StudentProtectedRoute>
        }
        />
        <Route
        path="/student/profile"
        element={
            <StudentProtectedRoute>
            <StudentProfile />
            </StudentProtectedRoute>
        }
        />
        <Route
        path="/student/change-password"
        element={
            <StudentProtectedRoute>
            <StudentChangePassword />
            </StudentProtectedRoute>
        }
        />
        <Route
          path="/owner/profile"
          element={
            <ProtectedRoute>
              <OwnerProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;