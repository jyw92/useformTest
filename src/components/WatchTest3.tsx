// ✨ 1. import 문 수정: type 키워드 추가
import {useForm, type SubmitHandler} from 'react-hook-form';

interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function WatchTest3() {
  const {
    register,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({mode: 'onChange'});

  const password = watch('password');

  // ✨ SubmitHandler는 타입이므로 import 할 때 type을 붙여야 했던 것!
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('제출 성공!', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <div className="flex flex-col">
        <input
          type="password"
          placeholder="비밀번호"
          {...register('password', {
            required: '비밀번호를 입력해주세요',
          })}
          className="border p-2 rounded"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
      </div>

      <div className="flex flex-col">
        <input
          type="password"
          placeholder="비밀번호 확인"
          {...register('confirmPassword', {
            required: '확인을 위해 입력해주세요',
            validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
          })}
          className="border p-2 rounded"
        />
        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        확인
      </button>
    </form>
  );
}
