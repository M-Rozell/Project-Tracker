import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "./api"; // axios instance configured with base URL
import { jwtDecode } from "jwt-decode";
import SessionWarningModal from "../components/modals/SessionWarningModal";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  // useRef for timers to persist across renders
  const logoutTimer = useRef(null);
  const warningTimer = useRef(null);
  // Clear timers helper
  const clearTimers = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
      warningTimer.current = null;
    }
  };
  
  
  ///////////// Logout function///////////
  const logout = () => {
    clearTimers();
    setUser(null);
    setShowWarning(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    console.log("User logged out.");
  };

  
  /////////// Fetch new access token to extend session//////////
  const extendSession = async () => {
    console.log("User clicked extend session");
    try {
      setLoading(true); // start loading
      setShowWarning(false);
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        console.log("No refresh token found, logging out");
        logout();
        return;
      }
      const response = await api.post(
        "/refresh",
        new URLSearchParams({ refresh_token }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      console.log("Refresh response", response.data);

      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      await api.get("/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      }).then((res) => {
        setUser(res.data); // Ensure consistent structure
      });
      scheduleLogout(access_token); // reschedule timers with new token
      setShowWarning(false);
      console.log("Session extended for 1 hour.");
    } catch (err) {
      console.error("Failed to extend session", err);
      logout();
    }finally {
      setLoading(false); // done loading
    }
  };

  
  
  ///////////Schedule Logout////////////
  const scheduleLogout = (token) => {
    clearTimers();

    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      console.log("scheduleLogout: timeUntilExpiry =", timeUntilExpiry);
      if (timeUntilExpiry <= 0) {
        console.log("Token already expired. Logging out.");
        logout();
        return;
      }

      // Show warning 5 minutes before expiry by opening modal
      const warningTime = timeUntilExpiry - 5 * 60 * 1000;
      console.log("Warning will show in ms:", warningTime);
      if (warningTime > 0) {
        warningTimer.current = setTimeout(() => {
          console.log("Showing warning modal now");
          setShowWarning(true);
          console.log("Showing warning modal");
        }, warningTime);
      } else {
        console.log("Not enough time for warning, showing immediately");
        setShowWarning(true);
      }

      logoutTimer.current = setTimeout(() => {
        console.log("Token expired. Logging out.");
        logout();
      }, timeUntilExpiry);
    } catch {
      console.error("Error decoding token:", e);
      logout();
    }
  };

  
  
  /////////////Reset Timers on User Activity///////////
  const resetTimers = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      scheduleLogout(token);
    } else {
      clearTimers();
    }
  };

  
  
  /////////////Track user actions///////////
  useEffect(() => {
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];
    const activityHandler = () => {
      console.log("User activity detected, resetting timers");
      resetTimers();
    };

    events.forEach((event) => window.addEventListener(event, activityHandler));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );
      clearTimers();
    };
  }, []);
  
  
  
  
  //////////// On app load, check token and user////////////
  useEffect(() => {
    const token = localStorage.getItem("access_token");
  
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now();
  
        if (decoded.exp * 1000 > now) {
          api.get("/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setUser(res.data);
            scheduleLogout(token); // re-schedule logout
          })
          .catch(() => {
            logout();
          });
        } else {
          // Token is expired
          logout();
        }
      } catch (err) {
        logout(); // token decoding failed
      }
    } else {
      setUser(null);
    }
  
    setLoading(false);
  }, []);

  
  
  /////////// Login function/////////////
  const login = async (username, password) => {
    try {
      const response = await api.post("/login", { username, password });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      const decoded = jwtDecode(access_token);
      console.log("Decoded JWT:", decoded);
      setUser(decoded);
      scheduleLogout(access_token);
    } catch (error) {
      setUser(null);
      throw error;
    }
  }
  
 

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
      {showWarning && (
        <SessionWarningModal
          onExtend={extendSession}
          onLogout={logout}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};