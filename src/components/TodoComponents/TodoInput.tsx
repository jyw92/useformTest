import {Plus} from 'lucide-react';
import React, {useState} from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export default function TodoInput({onAdd}: TodoInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!value.trim()) return; // 빈칸이면 무시

    onAdd(value); // 🚀 부모에게 "이거 추가해줘!" 하고 데이터 발사
    setValue(''); // 입력창 비우기
  };

  return (
    <form className="p-6 border-b border-slate-100">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="할 일을 입력하세요"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-lg outline-none transition-all"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus />
        </button>
      </div>
    </form>
  );
}
