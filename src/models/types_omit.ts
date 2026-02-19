// 🟢 타입 정의
export type BmwData = {
  [key: string]: string[];
};
//BmwData의 예시
// const myBmwInfo: BmwData = {
//   sedan: ['3 Series', '5 Series', '7 Series'],
//   suv: ['X1', 'X3', 'X5', 'X7'],
//   electric: ['i4', 'iX', 'i7'],
//   colors: ['Alpine White', 'Black Sapphire', 'Phytonic Blue'],
// };

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  series: string;
  model: string;
  fuel: string; //라디오값
  options: string[]; //체크박스 배열타입
}

export interface FormInputs extends Omit<Post, 'id' | 'imageUrl' | 'createdAt'> {
  file: FileList;
}

// interface FormInputs {
//   title: string;
//   content: string;
//   file: FileList;
//   series: string;
//   model: string;
//   fuel: string;
//   options: string[];
// }
