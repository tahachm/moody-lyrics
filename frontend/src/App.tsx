import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimpleChatbot from "./components/SimpleChatbot";
import NavbarComp from "./components/NavbarComp";
import TrendingSectionStatic from "./components/TrendingSectionStatic";
// import TrendingSection from "./components/TrendingSection"; // UnComment this line when DB is connected to EC2
import Example from "./components/wordCloudSample";
// import WordCloud from "./components/wordCloud"; // UnComment this line when DB is connected to EC2
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
                      <NavbarComp />
                      <SimpleChatbot />
                      <SuggestedSongs />
                      <TrendingSectionStatic />
                      {/* <TrendingSection /> */}
                      <Example width={500} height={500} /> {/* Comment this line when DB is connected to EC2 */}
                      {/* <WordCloud width={500} height={500} /> */}  {/* UnComment this line when DB is connected to EC2 */}
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
