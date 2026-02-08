import './App.css';
import TodoMainUseForm from './components/TodoMain';
import WatchTest from './components/watchTest';
import WatchTest2 from './components/WatchTest2';
import WatchTest3 from './components/WatchTest3';

function App() {
  return (
    <div className="flex gap-2 items-center">
      <TodoMainUseForm />
      <div className="flex flex-col">
        <WatchTest />
        <WatchTest2 />
        <WatchTest3 />
      </div>
    </div>
  );
}

export default App;
