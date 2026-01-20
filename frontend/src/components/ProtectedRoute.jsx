import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background scanlines">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_hsl(120_100%_50%/0.5)]"></div>
          <p className="text-muted-foreground font-mono text-lg text-glow-sm">AUTHENTICATING...</p>
          <p className="text-primary/50 font-mono text-xs mt-2">Verifying credentials</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;