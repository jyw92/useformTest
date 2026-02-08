import {useForm} from 'react-hook-form';

export default function WatchTest() {
  const {register, watch} = useForm();

  // 1. 'isOther'라는 체크박스를 실시간 감시!
  const isOtherChecked = watch('isOther');

  return (
    <form className="border p-2">
      <label>
        <input type="checkbox" {...register('isOther')} />
        기타 (직접 입력)
      </label>

      {/* 2. 감시한 값이 true일 때만 입력창이 짠! 하고 나타남 */}
      {isOtherChecked && <input type="text" placeholder="기타 사유를 적어주세요" {...register('otherReason')} />}
    </form>
  );
}
