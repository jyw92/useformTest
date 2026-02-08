import {useState} from 'react';

export default function TestElement() {
  const [count, setCount] = useState(0);
  console.log('컴포넌트 렌더링됨, 현재 count:', count);
  return (
    <div>
      <button type="button" onClick={() => setCount(count + 1)}>
        카운트
      </button>
      <div>{count}</div>
    </div>
  );
}
