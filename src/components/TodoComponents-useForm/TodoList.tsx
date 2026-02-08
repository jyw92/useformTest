import TodoItem from './TodoItem';

interface TodoItemType {
  id: number;
  content: string;
  completed: boolean;
}

interface TodoListProps {
  todos: TodoItemType[];
  onDelete: (id: number) => void;
  onUpdate: (params: {id: number; content: string}) => void;
  onToggle: (id: number, currentCompleted: boolean) => void;
}

export default function TodoList({todos, onDelete, onUpdate, onToggle}: TodoListProps) {
  return (
    <ul className="divide-y divide-slate-50 h-96 overflow-y-auto">
      {todos.length > 0 ? (
        <>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              onDelete={() => onDelete(todo.id)}
              onUpdate={onUpdate}
              onToggle={onToggle}
            />
          ))}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10">
          <p>할 일이 없습니다.</p>
        </div>
      )}
    </ul>
  );
}
