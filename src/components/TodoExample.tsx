import axios from 'axios';
import {Plus, Trash2, Pencil, Check, X} from 'lucide-react';
import {useEffect, useState} from 'react';

interface TodoItem {
  id: number;
  content: string;
  completed: boolean;
}

interface EditArgs {
  id: number;
  content: string;
}

export default function TodoExample() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todoInput, setTodoInput] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState('');

  // 1. 조회
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/todos');
        setTodos(response.data);
      } catch (error) {
        console.error('로딩 실패:', error);
      }
    };
    fetchTodos();
  }, []);

  // 2. 추가
  const addTodo = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    try {
      const response = await axios.post('http://localhost:4000/todos', {
        content: todoInput,
        completed: false,
      });
      setTodos([...todos, response.data]);
      setTodoInput('');
    } catch (error) {
      console.error('추가 실패:', error);
    }
  };

  // 3. 삭제
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  // ✨ 4. 완료 상태 토글 (체크박스 클릭 시) - 새로 추가된 부분!
  const toggleComplete = async (id: number, currentCompleted: boolean) => {
    try {
      // 1. 서버에 상태 변경 요청 (현재 값의 반대로!)
      await axios.patch(`http://localhost:4000/todos/${id}`, {
        completed: !currentCompleted,
      });

      // 2. 화면 업데이트 (map을 돌며 해당 id의 completed만 뒤집음)
      setTodos(todos.map((todo) => (todo.id === id ? {...todo, completed: !currentCompleted} : todo)));
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  // 5. 수정 관련 함수들
  const startEdit = ({id, content}: EditArgs) => {
    setEditingId(id);
    setEditInput(content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditInput('');
  };

  const saveEdit = async (id: number) => {
    if (!editInput.trim()) return;
    try {
      await axios.patch(`http://localhost:4000/todos/${id}`, {
        content: editInput,
      });
      setTodos(todos.map((todo) => (todo.id === id ? {...todo, content: editInput} : todo)));
      setEditingId(null);
    } catch (error) {
      console.error('수정 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-6">
          <h1 className="text-white text-2xl font-bold">My Tasks</h1>
          <p className="text-indigo-100 text-sm">오늘 할 일을 관리해보세요.</p>
        </div>

        <form onSubmit={addTodo} className="p-6 border-b border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="할 일을 입력하세요"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-lg outline-none"
            />
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700">
              <Plus />
            </button>
          </div>
        </form>

        <ul className="divide-y divide-slate-50 h-96 overflow-y-auto">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="group p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                {editingId === todo.id ? (
                  // 수정 모드
                  <div className="flex w-full gap-2 items-center">
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="flex-1 border border-indigo-300 rounded px-2 py-1 outline-none text-slate-700"
                      autoFocus
                    />
                    <button onClick={() => saveEdit(todo.id)} className="text-green-500 hover:text-green-700">
                      <Check size={18} />
                    </button>
                    <button onClick={cancelEdit} className="text-red-400 hover:text-red-600">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  // 일반 모드
                  <>
                    <div className="flex items-center gap-3">
                      {/* ✨ 체크박스 연결 부분 수정됨 */}
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        // readOnly를 제거하고 onChange를 연결했습니다.
                        onChange={() => toggleComplete(todo.id, todo.completed)}
                        className="w-5 h-5 rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                      <span className={`text-slate-700 ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                        {todo.content}
                      </span>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit({id: todo.id, content: todo.content})}
                        className="text-slate-300 hover:text-indigo-500 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10">
              <p>할 일이 없습니다.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
