export default function StudyTemplate() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🛠️ 게시글 관리</h2>
      {/* 입력 폼 영역 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">새 글 작성</h3>
        <form className="flex flex-col gap-6">
          {/* 1. 차량 정보 (콤보박스) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BMW 시리즈</label>
              <select
                name=""
                id=""
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">시리즈 선택</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">세부 모델</label>
              <select
                name=""
                id=""
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">{true ? '모델 선택' : '시리즈를 먼저 선택하세요'}</option>
              </select>
            </div>
          </div>

          {/* 2. 연료 및 옵션 (라디오 & 체크박스) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            {/* 🔘 라디오 버튼 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">연료 타입</label>
              <div className="flex gap-4"></div>
            </div>
            {/* ☑️ 체크박스 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">추가 옵션</label>
              <div className="flex flex-wrap gap-4"></div>
            </div>
          </div>
          {/* 3. 제목 및 파일 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지</label>
              <input
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded px-3 py-2.5 bg-white text-sm h-10.5"
              />
            </div>
          </div>
          {/* 이미지 미리보기 */}
          {true && (
            <div className="relative w-40 h-40 border-2 border-gray-300 rounded-lg overflow-hidden">
              <img src="" alt="미리보기" className="w-full h-full object-cover" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          )}
          {/* 4. 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="내용을 입력하세요"
            />
          </div>
          {/* 전송 버튼 */}
          <button
            type="submit"
            className={`self-end px-8 py-2.5 rounded text-white font-bold transition-colors shadow-sm ${
              true ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {true ? '업로드중...' : '등록하기'}
          </button>
        </form>
      </div>
      {/* 🔵 게시글 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-700">등록된 게시글</h3>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="p-4 w-12 text-center">No</th>
              <th className="p-4 w-24">사진</th>
              <th className="p-4 w-48">차량 정보</th>
              <th className="p-4">제목 / 내용</th>
              <th className="p-4 w-28">작성일</th>
              <th className="p-4 w-20 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm"></tbody>
        </table>
      </div>
    </div>
  );
}
