import {useEffect, useState} from 'react';
import TodoHeader from './TodoComponents/TodoHeader';
import TodoInput from './TodoComponents/TodoInput';
import TodoList from './TodoComponents/TodoList';
import axios from 'axios';

interface TodoItem {
  id: number;
  content: string;
  completed: boolean;
}

export default function TodoMainUseForm() {
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
      const response = await axios.patch(`/todos/${id}`, {
        completed: !currentCompleted,
      });

      // 2. 화면 업데이트할 때는 내가 계산한 값(!currentCompleted)을 쓰지 말고,
      // ✨ 서버가 "오케이, 이렇게 바꿨어" 하고 돌려준 값(response.data)을 그대로 씁니다.
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? response.data : todo)));
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
