import {useForm} from 'react-hook-form';

export default function WatchTest2() {
  const {register, watch} = useForm();

  // 1. 제목과 내용을 감시
  const title = watch('title');
  const content = watch('content');

  return (
    <div className="flex gap-4 border p-2">
      {/* 왼쪽: 입력하는 곳 */}
      <form className="w-1/2">
        <input {...register('title')} placeholder="제목" />
        <textarea {...register('content')} placeholder="내용" />
      </form>

      {/* 오른쪽: 보여주는 곳 (타자 칠 때마다 바뀜) */}
      <div className="w-1/2 bg-gray-100 p-4">
        <h1>{title || '제목 미리보기'}</h1>
        <p>{content || '내용이 여기에 나옵니다...'}</p>
      </div>
    </div>
  );
}
