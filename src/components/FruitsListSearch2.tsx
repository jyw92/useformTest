// ✨ 1. KeyboardEvent 앞에 'type'을 붙여줍니다.
import {useState, useCallback, type KeyboardEvent} from 'react';

// 오타 수정: FruitType
interface FruitType {
  id: string;
  name: string;
  price: number;
}

const fruits: FruitType[] = [
  {id: '1', name: '사과', price: 3000},
  {id: '2', name: '바나나', price: 4500},
  {id: '3', name: '포도', price: 8000},
  {id: '4', name: '딸기', price: 12000},
  {id: '5', name: '수박', price: 20000},
  {id: '6', name: '오렌지', price: 5000},
  {id: '7', name: '참외', price: 7000},
  {id: '8', name: '복숭아', price: 9000},
  {id: '9', name: '망고', price: 15000},
  {id: '10', name: '키위', price: 6000},
];

export default function FruitsListSearch() {
  const [fruitName, setFruitName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [result, setResult] = useState<FruitType[]>(fruits);

  const search = useCallback(() => {
    const fruitsFilter = fruits.filter((f) => {
      const isNameMatch = f.name.includes(fruitName);
      const isPriceMatch = price === '' ? true : f.price <= price;
      return isNameMatch && isPriceMatch;
    });

    setResult(fruitsFilter);
  }, [fruitName, price]);

  // ✨ KeyboardEvent<HTMLInputElement> 제네릭을 명시해주면 더 좋습니다.
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl overflow-hidden max-w-2xl">
        <div className="bg-red-500 p-4">
          <h1 className="text-white text-xl font-bold">🍎 신선 과일 목록</h1>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-100 flex gap-2 justify-end">
          <input
            type="text"
            className="border-gray-300 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="과일 이름"
            value={fruitName}
            onChange={(e) => setFruitName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="number"
            className="border-gray-300 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="최대 가격"
            value={price}
            onChange={(e) => {
              const val = e.target.value;
              setPrice(val === '' ? '' : Number(val));
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            onClick={search}
          >
            검색
          </button>
        </div>

        <ul className="divide-y divide-gray-200 max-h-125 overflow-y-auto">
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
