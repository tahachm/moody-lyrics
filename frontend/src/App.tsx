import "./App.css";
import SimpleChatbot from "./components/SimpleChatbot";
import Example from "./components/wordCloud";

function App() {

    return (
        <div className="flex flex-col justify-center">
            <Example width={500} height={500}/>
            <SimpleChatbot />
        </div>
    );
}

export default App;
