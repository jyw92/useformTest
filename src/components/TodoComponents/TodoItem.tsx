import {Check, Pencil, Trash2, X} from 'lucide-react';
import {useState} from 'react';

interface TodoItemProps {
  id: number;
  content: string;
  completed: boolean;
  onDelete: () => void;
  onUpdate: (params: {id: number; content: string}) => void;
  onToggle: (id: number, currentCompleted: boolean) => void;
}

export default function TodoItem({id, content, completed, onDelete, onUpdate, onToggle}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(content);

  const handleSave = () => {
    onUpdate({
      id: id,
      content: editVal,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditVal(content);
  };

  const toggleComplete = () => {
    onToggle(id, completed);
  };

  return (
    <li className="group p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
      {isEditing ? (
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            className="flex-1 border border-indigo-300 rounded px-2 py-1"
            autoFocus
          />
          <button onClick={handleSave} className="text-green-500 hover:text-green-700">
            <Check size={18} />
          </button>
          <button onClick={handleCancel} className="text-red-400 hover:text-red-600">
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              onChange={toggleComplete}
              checked={completed}
              className="w-5 h-5 rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
            />
            <span className={`text-slate-700 ${completed ? 'line-through text-slate-400' : ''}`}>
              {content} {/* props로 받은 값 사용 */}
            </span>
          </div>

          {/* 마우스 올렸을 때만 보이는 버튼들 */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="text-slate-300 hover:text-indigo-500 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={18} />
            </button>
            <button className="text-slate-300 hover:text-red-500 transition-colors" onClick={onDelete}>
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
