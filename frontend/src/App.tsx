import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimpleChatbot from "./components/SimpleChatbot";
import TrendingSection from "./components/TrendingSection";
import Example from "./components/wordCloud";
import SuggestedSongs from "./RecentSuggestions";
import LoginSignupComponent from "./components/loginSignupComponent";
import { AuthProvider } from "./auth";
import ProtectedRoute from "./protectedRoutes";
import { RecoilRoot } from "recoil";


const App: React.FC = () => {
  return (
    <RecoilRoot>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<LoginSignupComponent />} />

            {/* Protected Route */}
            <Route
              path="/main"
              element={
                <ProtectedRoute
                  element={
                    <div className="flex flex-col justify-center">
                      <SimpleChatbot />
                      <SuggestedSongs />
                      <TrendingSection />
                      <Example width={500} height={500} />
                    </div>
                  }
                />
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </RecoilRoot>
  );
};

export default App;
