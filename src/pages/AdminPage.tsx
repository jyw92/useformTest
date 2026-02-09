import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';

// 1. 게시글 데이터 타입 정의
interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

// 2. 폼 입력 데이터 타입
interface FormInputs {
  title: string;
  content: string;
  file: FileList;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  // 폼 관리 훅
  const {
    register,
    handleSubmit,
    reset,
    formState: {isSubmitting},
  } = useForm<FormInputs>();

  // ✅ 데이터 불러오기 (GET)
  // ✅ [수정] useEffect 내부에서 직접 정의
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts?_sort=createdAt&_order=desc');
        setPosts(res.data);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      }
    };

    fetchPosts();
  }, []); // 빈 배열: 컴포넌트 마운트 시 1번만 실행

  // ✅ 수동 새로고침용 함수 (등록/삭제 후 호출)
  const refreshPosts = async () => {
    try {
      const res = await axios.get('/posts?_sort=createdAt&_order=desc');
      setPosts(res.data);
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
    }
  };

  // ✅ 게시글 등록 (Upload -> Save)
  const onSubmit = async (data: FormInputs) => {
    if (!confirm('게시글을 등록하시겠습니까?')) return;

    try {
      let imageUrl = '';

      // 1. 이미지가 있다면 Cloudinary에 업로드
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

      // 2. JSON Server에 게시글 정보 저장
      await axios.post('/posts', {
        title: data.title,
        content: data.content,
        imageUrl: imageUrl,
        createdAt: new Date().toLocaleDateString(),
      });

      alert('등록 성공! 🎉');
      reset();
      refreshPosts(); // ✅ 목록 다시 불러오기
    } catch (err) {
      console.error('등록 실패:', err);
      alert('에러가 발생했습니다.');
    }
  };

  // ✅ 게시글 삭제 (DELETE)
  const onDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/posts/${id}`);
      alert('삭제되었습니다.');
      refreshPosts(); // ✅ 목록 갱신
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🛠️ 게시글 관리</h2>

      {/* 🟢 글쓰기 폼 영역 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">새 글 작성</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                {...register('title', {required: true})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지</label>
              <input
                type="file"
                accept="image/*"
                {...register('file')}
                className="border border-gray-300 rounded px-3 py-1.5 bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              {...register('content', {required: true})}
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="내용을 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`self-end px-6 py-2 rounded text-white font-bold transition-colors ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? '업로드 중...' : '등록하기'}
          </button>
        </form>
      </div>

      {/* 🔵 게시글 목록 (테이블) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">등록된 게시글 ({posts.length})</h3>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4 w-16 text-center">No</th>
              <th className="p-4 w-24">썸네일</th>
              <th className="p-4">제목 / 내용</th>
              <th className="p-4 w-32">작성일</th>
              <th className="p-4 w-20 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400">
                  등록된 게시글이 없습니다. 위에서 등록해보세요!
                </td>
              </tr>
            ) : (
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
                    <p className="font-bold text-gray-800">{post.title}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">{post.content}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{post.createdAt}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onDelete(post.id)}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100 transition"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
