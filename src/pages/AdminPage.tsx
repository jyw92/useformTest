import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {useForm} from 'react-hook-form';

// ❌ import bmwData from '../data/bmw.json';  <-- 삭제됨

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
}

interface FormInputs {
  title: string;
  content: string;
  file: FileList;
  series: string;
  model: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  // 🟢 BMW 데이터를 서버에서 받아와 저장할 State 추가
  const [bmwData, setBmwData] = useState<BmwData>({});

  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 🟢 실시간 선택값 감시
  // "값이 들어간 상태"를 실시간으로 가져오는 것
  const selectedSeries = watch('series');

  // 🟢 선택된 시리즈의 모델 목록 (bmwData state에서 가져옴)
  const models = selectedSeries ? bmwData[selectedSeries] : [];

  // 🟢 데이터 불러오기 (게시글 + BMW 차종 데이터)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promise.all을 사용하여 두 요청을 병렬로 처리 (더 빠름)
        const [postsRes, bmwRes] = await Promise.all([
          axios.get('/posts'),
          axios.get('/bmw'), // 🟢 BMW 데이터 요청
        ]);

        setPosts(postsRes.data);
        setBmwData(bmwRes.data); // 🟢 받아온 BMW 데이터를 state에 저장
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      }
    };

    fetchData();
  }, []);

  // 게시글 목록만 새로고침하는 함수
  const refreshPosts = async () => {
    try {
      const res = await axios.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('게시글 로딩 실패:', err);
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

  // 🗑️ 삭제 핸들러 함수
  const handleDelete = async (id: string) => {
    // 1. 실수로 누르는 것을 방지하기 위해 확인창 띄우기
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

    try {
      // 2. 서버에 삭제 요청 (ID를 URL 뒤에 붙여서 보냄)
      await axios.delete(`/posts/${id}`);

      alert('삭제되었습니다.');

      // 3. 목록 새로고침 (화면에서 지워진 것 반영)
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
        title: data.title,
        content: data.content,
        imageUrl: imageUrl,
        createdAt: new Date().toLocaleDateString(),
        series: data.series,
        model: data.model,
      });

      alert('등록 성공! 🎉');
      reset();
      setPreviewImage('');
      refreshPosts();
    } catch (error) {
      console.error('등록 실패:', error);
      alert('에러가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🛠️ 게시글 관리</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">새 글 작성</h3>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">BMW 시리즈</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                {...register('series', {
                  required: true,
                  onChange: () => setValue('model', ''), // 시리즈 변경 시 모델 초기화
                })}
              >
                <option value="">시리즈 선택</option>
                {/* 🟢 bmwData State의 키값들로 옵션 생성 */}
                {Object.keys(bmwData).map((seriesKey) => (
                  <option key={seriesKey} value={seriesKey}>
                    {seriesKey}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">세부 모델</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100"
                {...register('model', {required: true})}
                disabled={!selectedSeries}
              >
                <option value="">{selectedSeries ? '모델 선택' : '시리즈를 먼저 선택하세요'}</option>
                {/* 🟢 선택된 시리즈에 해당하는 모델들만 렌더링 */}
                {models &&
                  models.map((modelName) => (
                    <option key={modelName} value={modelName}>
                      {modelName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="border border-gray-300 rounded px-3 py-1.5 bg-gray-50 text-sm"
              />
            </div>
          </div>

          {previewImage && (
            <div className="relative w-40 h-40 border-2 border-gray-300 rounded-lg overflow-hidden">
              <img src={previewImage} alt="미리보기" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removePreviewImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              >
                ✕
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="내용을 입력하세요"
              {...register('content', {required: true})}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`self-end px-6 py-2 rounded text-white font-bold transition-colors ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? '업로드중...' : '등록하기'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">등록된 게시글</h3>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4 w-16 text-center">No</th>
              <th className="p-4 w-24">썸네일</th>
              <th className="p-4">차종 / 제목</th>
              <th className="p-4 w-32">작성일</th>
              <th className="p-4 w-20 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-center text-gray-500">{index + 1}</td>
                  <td className="p-4">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt="thumb" className="w-12 h-12 rounded object-cover border" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-blue-600 mb-0.5">
                      {post.series} &gt; {post.model}
                    </div>
                    <p className="font-bold text-gray-800">{post.title}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">{post.content}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{post.createdAt}</td>
                  <td className="p-4 text-center">
                    <button
                      className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100 transition whitespace-nowrap"
                      onClick={() => handleDelete(post.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400">
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
