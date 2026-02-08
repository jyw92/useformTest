import {Plus} from 'lucide-react';
import {useEffect} from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

//폼 데이터의 타입 정의
interface FormValues {
  todo: string;
}

export default function TodoInput({onAdd}: TodoInputProps) {
  // 2. useForm 훅 사용
  // register: input을 등록하는 함수
  // handleSubmit: 전송 처리 함수
  // reset: 입력창 비우는 함수

  const {register, handleSubmit, reset, watch} = useForm<FormValues>();
  // console.log(watch('todo'));

  // 1. 변수에 담습니다.
  const todoValue = watch('todo');

  // 2. useEffect 안에서 감시합니다.
  useEffect(() => {
    console.log('현재 입력값:', todoValue);
  }, [todoValue]); // todoValue가 바뀔 때만 실행됨

  //3. 전송 실행 함수 (유효성 검사 통과 시 실행됨)
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onAdd(data.todo); //부모에게 데이터 전달
    reset();
  };

  return (
    <form className="p-6 border-b border-slate-100" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="할 일을 입력하세요"
          className="flex-1 px-4 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-lg outline-none transition-all"
          // 5. {...register('이름')}으로 연결
          //registerd:true를 넣으면 빈칸일 때 onSubmit이 실행 안됨
          {...register('todo', {required: true})}
        />
        <button
          typeof="submit"
          className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus />
        </button>
      </div>
    </form>
  );
}
