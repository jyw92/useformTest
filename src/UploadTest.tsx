// const onSubmit = async (data: FormInputs) => {
//   if (!confirm('게시글을 등록하시겠습니까?')) return;
//   // 1. [체크] 사용자가 파일을 선택했는지 확인
//   console.log('--- 1. 파일 선택 확인 ---');
//   console.log('data.file:', data.file); // FileList 객체 (배열처럼 생김)
//   console.log('data.file[0]:', data.file[0]); // 실제 파일 하나 (File 객체)

//   // 1.  이미지가 있다면 Cloudinary에 업로드
//   if (data.file && data.file.length > 0) {
//     // 2. [포장] FormData(택배박스) 만들기
//     const formData = new FormData();

//     // 박스에 'file'이라는 이름으로 파일 넣기
//     formData.append('file', data.file[0]);
//     formData.append('upload_preset', 'duddnd_preset');

//     // 🚨 주의: formData는 그냥 console.log(formData) 하면 빈 껍데기만 보입니다!
//     // 아래처럼 반복문으로 꺼내봐야 내용물이 보입니다.
//     console.log('--- 2. FormData(택배박스) 내부 확인 ---');
//     for (let [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//       // 출력 예시 -> file: File객체, upload_preset: "unsigned_preset"
//     }
//   }

//   try {
//     // 3. [발송] Cloudinary 서버로 택배 보내기
//     console.log('--- 3. Cloudinary로 전송 시작... ---');

//     const cloudName = 'dffwporwa';
//     const uploadRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
//     // 4. [도착] 서버가 준 응답(영수증) 확인
//     console.log('--- 4. 서버 응답 도착! ---');
//     console.log('전체 응답(uploadRes):', uploadRes);
//     console.log('응답 데이터(data):', uploadRes.data);

//     // ✨ 제일 중요한 건 이거! (이미지 주소)
//     const imageUrl = uploadRes.data.secure_url;
//     console.log('✅ 최종 이미지 주소(imageUrl):', imageUrl);

//     // 이후 로직...
//     // savePost(imageUrl);
//   } catch (error) {
//     console.error('❌ 업로드 실패:', error);
//   }
// };
