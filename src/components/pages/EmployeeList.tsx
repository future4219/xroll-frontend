import { EmployeeListContainer } from
"@/components/features/employee/EmployeeList/EmployeeListContainer";

// components/pages内では、実際の画面1つに対応するコンポーネントを定義する。
// 今回はEmployeeListContainerをそのまま表示するだけのものとなっているが、
// ロジックまで全て完全に分離していると考えられるコンポーネントであれば、
// pageコンポーネント内で複数コンポーネントを呼び出しても良い。
export function EmployeeList() {
  return <EmployeeListContainer />;
}
