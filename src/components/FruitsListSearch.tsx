import {useCallback, useState} from 'react';

interface FruitTpyes {
  id: string;
  name: string;
  price: number;
}

const fruits: FruitTpyes[] = [
  {id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: '사과', price: 3000},
  {id: '550e8400-e29b-41d4-a716-446655440000', name: '바나나', price: 4500},
  {id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: '포도', price: 8000},
  {id: '7d444840-9dc0-11d1-b245-5ffdce74fad2', name: '딸기', price: 12000},
  {id: 'e4b2a1f0-7b3d-4c2a-9e5b-1a2b3c4d5e6f', name: '수박', price: 20000},
  {id: 'a8f1e2d3-c4b5-4a6b-8c7d-9e0f1a2b3c4d', name: '오렌지', price: 5000},
  {id: 'b9e8d7c6-b5a4-4321-8901-23456789abcd', name: '참외', price: 7000},
  {id: 'f1e2d3c4-b5a6-4789-9012-3456789abcde', name: '복숭아', price: 9000},
  {id: 'd5c4b3a2-1e0f-4987-8765-43210fedcba9', name: '망고', price: 15000},
  {id: 'c3b2a10e-9d8c-4b7a-a6f5-e4d3c2b1a098', name: '키위', price: 6000},
];

export default function FruitsListSearch() {
  const [fruitName, setFuitName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [result, setResult] = useState<FruitTpyes[]>(fruits);

  const search = useCallback(() => {
    const fruitsFilter = fruits.filter((f) => {
      // 1. 이름 검색 (대소문자 구분 없이 하고 싶다면 toLowerCase() 사용)
      const isNameMatch = f.name.includes(fruitName);

      // 2. 가격 검색 (빈 값이면 true를 반환해서 모든 가격 통과)
      const isPriceMatch = price === '' ? true : f.price <= price;

      return isNameMatch && isPriceMatch;
    });

    setResult(fruitsFilter);
  }, [fruitName, price]); // fruitName도 의존성 배열에 추가!

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search();
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-red-500 p-4">
          <h1 className="text-white text-xl font-bold">🍎 신선 과일 목록</h1>
        </div>

        <div className="p-2.5 flex gap-2 justify-end">
          <input
            type="text"
            className="border-gray-600 border rounded-md"
            placeholder="과일이름"
            value={fruitName}
            onChange={(e) => setFuitName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="number"
            className="border-gray-600 border rounded-md"
            placeholder="가격"
            value={price}
            onChange={(e) => {
              const val = e.target.value;
              // 비어있으면 빈 문자열, 아니면 숫자로 변환
              setPrice(val === '' ? '' : Number(val));
            }}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className="bg-red-500 p-4 text-white rounded-md" onClick={search}>
            검색
          </button>
        </div>

        <ul className="divide-y divide-gray-200">
          {result.length > 0 ? (
            result.map((fruit) => (
              <li key={fruit.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                <span className="text-lg font-medium text-gray-800">{fruit.name}</span>
                <span className="text-red-500 font-semibold">{fruit.price.toLocaleString()}원</span>
              </li>
            ))
          ) : (
            <li className="p-10 text-center text-gray-500">검색 결과가 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
