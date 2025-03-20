import { EmployeeListPresenter } from
"@/components/features/employee/EmployeeList/EmployeeListPresenter";
import { Employee } from "@/entities/employee/entity"
// なんらかのアプリ固有のドメイン知識に関連するコンポーネントは、components/features配下に配置する。

// Containerではロジックを実装するため、
// まずはpresenterを呼び出すだけのコンポーネントとして定義しておく。
export function EmployeeListContainer() {
  const employees: Employee[] = [
    {
      employeeId: "1",
      name: "山田太郎",
      age: 20,
      myNumber: {
        myNumber: "123456789111",
        expirationDate: new Date(),
      },
      familyMembers: [
        {
          familyMemberId: "1",
          name: "山田花子",
          relation: "配偶者",
          age: 20,
        },
      ],
      clubs: [
        {
          clubId: "1",
          name: "サッカー部",
        },
        {
          clubId: "2",
          name: "登山部",
        },
      ],
    },
    {
      employeeId: "2",
      name: "田中太郎",
      age: 30,
      myNumber: {
        myNumber: "123456789222",
        expirationDate: new Date(),
      },
      familyMembers: [
        {
          familyMemberId: "2",
          name: "田中花子",
          relation: "配偶者",
          age: 20,
        },
        {
          familyMemberId: "3",
          name: "田中次郎",
          relation: "子供",
          age: 3,
        },
      ],
      clubs: [
        {
          clubId: "1",
          name: "サッカー部",
        },
      ],
    },
    {
      employeeId: "3",
      name: "鈴木太郎",
      age: 20,
      myNumber: {
        myNumber: "123456789333",
        expirationDate: new Date(),
      },
      familyMembers: [],
      clubs: [],
    },
  ];
  return <EmployeeListPresenter employees={employees} />;
}
