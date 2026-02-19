import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';

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

export default function AdminPostDetail() {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [bmwData, setBmwData] = useState<BmwData>({});

  const [isEditing, setIsEditing] = useState(false);
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
  const selectedSeries = watch('series');
  const models = selectedSeries ? bmwData[selectedSeries] : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, bmwRes] = await Promise.all([axios.get(`/posts/${id}`), axios.get('/bmw')]);
        setPost(postRes.data);
        setBmwData(bmwRes.data);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        alert('존재하지 않거나 삭제된 게시글입니다.');
        navigate('/admin');
      }
    };
    if (id) fetchData();
  }, [id, navigate]);

  const handleEditClick = () => {
    if (!post) return;
    setIsEditing(true);
    reset({
      title: post.title,
      content: post.content,
      series: post.series,
      model: post.model,
      fuel: post.fuel,
      options: post.options || [],
    });
    setPreviewImage(post.imageUrl || '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (previewImage && !previewImage.startsWith('http')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const removePreviewImage = () => {
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    resetField('file');
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/posts/${id}`);
      alert('삭제되었습니다.');
      navigate('/admin');
    } catch (err) {
      console.error('삭제 중 오류가 발생했습니다.', err);
    }
  };

  const onSubmit = async (data: FormInputs) => {
    if (!confirm('게시글을 수정하시겠습니까?')) return;
    try {
      let finalImageUrl = post?.imageUrl || '';

      if (data.file && data.file.length > 0) {
        const formData = new FormData();
        formData.append('file', data.file[0]);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'board_images');

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
        );
        finalImageUrl = uploadRes.data.secure_url;
      }

      const updatedData = {
        ...post,
        title: data.title,
        content: data.content,
        series: data.series,
        model: data.model,
        fuel: data.fuel,
        options: data.options || [],
        imageUrl: finalImageUrl,
      };

      await axios.put(`/posts/${id}`, updatedData);
      alert('수정되었습니다! ✨');

      setPost(updatedData as Post);
      setIsEditing(false);
    } catch (error) {
      console.error('수정 중 오류가 발생했습니다.', error);
    }
  };

  if (!post) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-gray-500 font-bold text-lg">
        데이터를 불러오는 중입니다... 🔄
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button
        onClick={() => navigate('/admin')}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
      >
        ← 목록으로 돌아가기
      </button>

      {/* 📖 읽기 모드 (상세보기) */}
      {!isEditing && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            <div>
              <div className="text-sm text-blue-600 font-bold mb-1">
                {post.series} &gt; {post.model}{' '}
                <span className="text-gray-400 font-normal ml-2">| {post.createdAt}</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{post.title}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEditClick}
                className="px-5 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600 transition"
              >
                삭제
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt="차량 이미지"
                  className="w-full rounded-xl border object-cover shadow-sm"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-medium">
                  이미지가 없습니다
                </div>
              )}
            </div>
            <div className="md:w-1/2 flex flex-col gap-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-700 mb-3 text-lg border-b pb-2">차량 제원 및 옵션</p>
                <div className="flex flex-col gap-2 text-gray-700">
                  <p>
                    <span className="inline-block w-16 text-gray-500 font-medium">연료:</span> {post.fuel}
                  </p>
                  <p>
                    <span className="inline-block w-16 text-gray-500 font-medium">옵션:</span>{' '}
                    {post.options?.length > 0 ? post.options.join(', ') : '선택된 옵션 없음'}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2 text-lg">게시글 내용</p>
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 min-h-[150px]">
                  {post.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ 수정 모드 (폼) */}
      {isEditing && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-400">
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <h3 className="text-xl font-bold text-gray-800">✏️ 게시글 수정</h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-800 font-medium underline"
            >
              수정 취소
            </button>
          </div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BMW 시리즈</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  {...register('series', {required: true, onChange: () => setValue('model', '')})}
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
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-100"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">연료 타입</label>
                <div className="flex gap-4">
                  {['가솔린', '디젤', '전기', '하이브리드'].map((fuel) => (
                    <label key={fuel} className="flex items-center gap-1 cursor-pointer text-sm">
                      <input
                        type="radio"
                        value={fuel}
                        {...register('fuel', {required: true})}
                        className="text-green-600 focus:ring-green-500"
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
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="제목을 입력하세요"
                  {...register('title', {required: true})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지 (변경 시에만 선택)</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 h-32 resize-none outline-none focus:ring-2 focus:ring-green-500"
                placeholder="내용을 입력하세요"
                {...register('content', {required: true})}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`self-end px-8 py-3 rounded text-white font-bold transition-colors shadow-sm ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isSubmitting ? '수정 처리중...' : '수정 완료하기'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
