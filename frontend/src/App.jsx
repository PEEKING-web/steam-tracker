import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Games from './pages/Games';
import Friends from './pages/Friends';
import FriendProfile from './pages/FriendProfile';
import Activity from './pages/Activity';
import Achievements from './pages/Achievements';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';



function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Landing />} />

      {/* Protected Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="/games" element={
        <ProtectedRoute>
          <Games />
        </ProtectedRoute>
      } />

      <Route path="/friends" element={
        <ProtectedRoute>
          <Friends />
        </ProtectedRoute>
      } />

      <Route path="/friends/:steamId" element={
        <ProtectedRoute>
          <FriendProfile />
        </ProtectedRoute>
      } />

      <Route path="/activity" element={
        <ProtectedRoute>
          <Activity />
        </ProtectedRoute>
      } />

           <Route path="/achievements" element={
        <ProtectedRoute>
          <Achievements />
        </ProtectedRoute>
      } /> 

          <Route
      path="/categories"
      element={
        <ProtectedRoute>
          <Categories />
        </ProtectedRoute>
      }
    />

    <Route
  path="/categories/:id"
  element={
    <ProtectedRoute>
      <CategoryDetails />
    </ProtectedRoute>
  }
/>


    </Routes>
  );
}

export default App;