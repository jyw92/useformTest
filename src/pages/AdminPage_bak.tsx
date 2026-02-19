import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {useSearchParams} from 'react-router-dom';

// 🟢 타입 정의
type BmwData = {
  [key: string]: string[];
};

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  series: string;
  model: string;
  fuel: string;
  options: string[];
}

interface FormInputs {
  title: string;
  content: string;
  file: FileList;
  series: string;
  model: string;
  fuel: string;
  options: string[];
}

export default function AdminPage_bak() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [bmwData, setBmwData] = useState<BmwData>({});

  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🟢 URL 쿼리스트링 상태 가져오기 (페이지네이션)
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    watch,
    setValue,
    formState: {isSubmitting},
  } = useForm<FormInputs>();

  const {ref: registerRef, ...registerRest} = register('file');

  const selectedSeries = watch('series');
  const models = selectedSeries ? bmwData[selectedSeries] : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, bmwRes] = await Promise.all([axios.get('/posts'), axios.get('/bmw')]);
        setPosts(postsRes.data);
        setBmwData(bmwRes.data);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      }
    };
    fetchData();
  }, []);

  const refreshPosts = async () => {
    try {
      const res = await axios.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('목록 갱신 실패:', err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const removePreviewImage = () => {
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    resetField('file');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까? 🗑️')) return;
    try {
      await axios.delete(`/posts/${id}`);
      alert('삭제되었습니다.');
      refreshPosts();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const onSubmit = async (data: FormInputs) => {
    if (!confirm('게시글을 등록하시겠습니까?')) return;

    try {
      let imageUrl = '';

      if (data.file && data.file.length > 0) {
        const formData = new FormData();
        formData.append('file', data.file[0]);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'board_images');

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
        );
        imageUrl = uploadRes.data.secure_url;
      }

      await axios.post('/posts', {
        ...data,
        imageUrl: imageUrl,
        createdAt: new Date().toLocaleDateString(),
      });

      alert('등록 성공! 🎉');
      reset();
      setPreviewImage('');
      refreshPosts();
      setSearchParams({page: '1'}); // 등록 후 1페이지로 이동
    } catch (error) {
      console.error('등록 실패:', error);
      alert('에러가 발생했습니다.');
    }
  };

  // 🟢 데이터 슬라이싱 로직
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  // 전체 포스트를 역순(최신순)으로 보여주고 싶다면 아래 posts.slice를 [...posts].reverse().slice() 로 변경하세요.
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  //최신순 역순
  // const currentPosts = [...posts].reverse().slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber: number) => {
    setSearchParams({page: pageNumber.toString()});
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🛠️ 게시글 관리</h2>

      {/* 🟢 입력 폼 영역 (복구됨!) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">새 글 작성</h3>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          {/* 1. 차량 정보 (콤보박스) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BMW 시리즈</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                {...register('series', {
                  required: true,
                  onChange: () => setValue('model', ''),
                })}
              >
                <option value="">시리즈 선택</option>
                {Object.keys(bmwData).map((seriesKey) => (
                  <option key={seriesKey} value={seriesKey}>
                    {seriesKey}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">세부 모델</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100"
                {...register('model', {required: true})}
                disabled={!selectedSeries}
              >
                <option value="">{selectedSeries ? '모델 선택' : '시리즈를 먼저 선택하세요'}</option>
                {models &&
                  models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* 2. 연료 및 옵션 (라디오 & 체크박스) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">연료 타입</label>
              <div className="flex gap-4">
                {['가솔린', '디젤', '전기', '하이브리드'].map((fuel) => (
                  <label key={fuel} className="flex items-center gap-1 cursor-pointer text-sm">
                    <input
                      type="radio"
                      value={fuel}
                      {...register('fuel', {required: true})}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    {fuel}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">추가 옵션</label>
              <div className="flex flex-wrap gap-4">
                {['선루프', 'HUD', '레이저 라이트', 'M스포츠 패키지'].map((opt) => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      value={opt}
                      {...register('options')}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 제목 및 파일 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="제목을 입력하세요"
                {...register('title', {required: true})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지</label>
              <input
                type="file"
                accept="image/*"
                {...registerRest}
                ref={(e) => {
                  registerRef(e);
                  fileInputRef.current = e;
                }}
                onChange={(e) => {
                  registerRest.onChange(e);
                  handleImageChange(e);
                }}
                className="border border-gray-300 rounded px-3 py-1.5 bg-white text-sm"
              />
            </div>
          </div>

          {/* 이미지 미리보기 */}
          {previewImage && (
            <div className="relative w-40 h-40 border-2 border-gray-300 rounded-lg overflow-hidden">
              <img src={previewImage} alt="미리보기" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removePreviewImage}
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
              {...register('content', {required: true})}
            />
          </div>

          {/* 전송 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`self-end px-8 py-2.5 rounded text-white font-bold transition-colors shadow-sm ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? '업로드중...' : '등록하기'}
          </button>
        </form>
      </div>

      {/* 🔵 게시글 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-700">등록된 게시글 (총 {posts.length}개)</h3>
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
          <tbody className="divide-y divide-gray-100 text-sm">
            {currentPosts.length > 0 ? (
              currentPosts.map((post, index) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="p-4 text-center text-gray-500">{posts.length - (indexOfFirstPost + index)}</td>
                  <td className="p-4">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt="thumb" className="w-16 h-12 rounded object-cover border" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-bold text-blue-700">{post.series}</div>
                    <div className="text-gray-800 font-medium">{post.model}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="bg-gray-200 px-1.5 rounded mr-1">{post.fuel}</span>
                      {post.options?.length > 0 && `+ ${post.options.length} 옵션`}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <p className="font-bold text-gray-800 text-base mb-1">{post.title}</p>
                    <p className="text-gray-500 line-clamp-2">{post.content}</p>
                  </td>
                  <td className="p-4 text-gray-500">{post.createdAt}</td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition whitespace-nowrap"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400">
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 🟢 하단 페이지네이션 UI */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center py-6 gap-2 bg-white border-t">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>

            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded border flex items-center justify-center font-medium transition-colors
                  ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
