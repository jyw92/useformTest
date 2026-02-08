import {Check, Pencil, Trash2, X} from 'lucide-react';
import {useState} from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';

interface TodoItemProps {
  id: number;
  content: string;
  completed: boolean;
  onDelete: () => void;
  onUpdate: (params: {id: number; content: string}) => void;
  onToggle: (id: number, currentCompleted: boolean) => void;
}

//form 데이터 타입
interface EditFormValues {
  editContent: string;
}

export default function TodoItem({id, content, completed, onDelete, onUpdate, onToggle}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  // const [editVal, setEditVal] = useState(content);

  const {register, handleSubmit, reset, setFocus} = useForm<EditFormValues>({
    defaultValues: {
      editContent: content,
    },
  });

  //수정모드 진입
  const startEdit = () => {
    setIsEditing(true);

    //팁: 모드 켜질 때 기존 값으로 리셋해주면 데이터 꼬임 방지
    reset({editContent: content});

    //약간의 지연 후 포커스 (리액트 렌더링 타이밍 때문)
    setTimeout(() => setFocus('editContent'), 0);
  };

  //저장 실행
  const onSubmit: SubmitHandler<EditFormValues> = (data) => {
    //값이 변한 게 없거나 빈칸이면 그냥 닫기 (선택사항)
    if (!data.editContent.trim() || data.editContent === content) {
      setIsEditing(false);
      return;
    }

    onUpdate({id, content: data.editContent});
    setIsEditing(false);
  };

  //취소
  const handleCancel = () => {
    setIsEditing(false);
    reset({editContent: content});
  };

  return (
    <li className="group p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
      {isEditing ? (
        // ✨ 수정 모드 (form 태그로 감싸거나, input에서 엔터 처리)
        // 여기서는 간단하게 div로 하고 input에서 onKeyDown으로 엔터 처리를 해도 되지만,
        // 정석대로 form 태그를 작게 써보겠습니다.
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 w-full">
          <input
            type="text"
            // ✨ register 연결
            {...register('editContent', {required: true})}
            className="flex-1 border border-indigo-300 rounded px-2 py-1 outline-none"
          />
          <button type="submit" className="text-green-500 hover:text-green-700">
            <Check size={18} />
          </button>
          <button type="button" onClick={handleCancel} className="text-red-400 hover:text-red-600">
            <X size={18} />
          </button>
        </form>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              onChange={() => onToggle(id, completed)}
              checked={completed}
              className="w-5 h-5 rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
            />
            <span className={`text-slate-700 ${completed ? 'line-through text-slate-400' : ''}`}>
              {content} {/* props로 받은 값 사용 */}
            </span>
          </div>

          {/* 마우스 올렸을 때만 보이는 버튼들 */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-slate-300 hover:text-indigo-500 transition-colors" onClick={startEdit}>
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
