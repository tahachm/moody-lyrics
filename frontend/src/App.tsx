import "./App.css";
import SimpleChatbot from "./components/SimpleChatbot";
import TrendingSection from "./components/TrendingSection";
import Example from "./components/wordCloud";
import SuggestedSongs from "./RecentSuggestions";

function App() {

    return (
        <div className="flex flex-col justify-center">
            <SimpleChatbot />
            <SuggestedSongs/>
            <TrendingSection/>
            <Example width={500} height={500}/>
        </div>
    );
}

export default App;
