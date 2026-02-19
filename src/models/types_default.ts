// 1. 공통되는 속성만 따로 모아둡니다.
export interface BasePostData {
  title: string;
  content: string;
  series: string;
  model: string;
  fuel: string;
  options: string[];
}

// 2. Base를 상속받고 서버 데이터용 속성을 추가합니다.
export interface Post extends BasePostData {
  id: string;
  imageUrl: string;
  createdAt: string;
}

// 3. Base를 상속받고 입력 폼용 속성을 추가합니다.
export interface FormInputs extends BasePostData {
  file: FileList;
}
