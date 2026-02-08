import {useEffect, useState} from 'react';
import TodoHeader from './TodoComponents-useForm/TodoHeader';
import TodoInput from './TodoComponents-useForm/TodoInput';
import TodoList from './TodoComponents-useForm/TodoList';
import axios from 'axios';

interface TodoItem {
  id: number;
  content: string;
  completed: boolean;
}

export default function TodoMain() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axios.get('/todos');
        setTodos(response.data);
      } catch (error) {
        console.error('로딩 실패:', error);
      }
    };
    fetchApi();
  }, []);

  const addTodo = async (text: string) => {
    try {
      const response = await axios.post('/todos', {
        content: text,
        completed: false,
      });
      setTodos([response.data, ...todos]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodo = async ({id, content}: {id: number; content: string}) => {
    try {
      await axios.patch(`/todos/${id}`, {
        content: content,
      });
      setTodos(todos.map((todo) => (todo.id === id ? {...todo, content: content} : todo)));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (id: number, currentCompleted: boolean) => {
    try {
      await axios.patch(`/todos/${id}`, {
        completed: !currentCompleted,
      });

      setTodos(todos.map((todo) => (todo.id === id ? {...todo, completed: !currentCompleted} : todo)));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <TodoHeader />
        <TodoInput onAdd={addTodo} />
        <TodoList todos={todos} onDelete={deleteTodo} onUpdate={updateTodo} onToggle={toggleComplete} />
      </div>
    </div>
  );
}
