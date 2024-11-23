import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimpleChatbot from "./components/SimpleChatbot";
import TrendingSection from "./components/TrendingSection";
import Example from "./components/wordCloud";
import SuggestedSongs from "./RecentSuggestions";
import LoginSignupComponent from "./components/loginSignupComponent";


function App() {

    return (
        <Router>
        <Routes>
          <Route path="/" element={<LoginSignupComponent />} />
          <Route
            path="/main"
            element={
              <div className="flex flex-col justify-center">
                <SimpleChatbot />
                <SuggestedSongs />
                <TrendingSection />
                <Example width={500} height={500} />
              </div>
            }
          />
        </Routes>
      </Router>
    );
}

export default App;
