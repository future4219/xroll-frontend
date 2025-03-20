import { Th } from "@/components/ui/table/Th";
import { Tr } from "@/components/ui/table/Tr";
import { Employee } from "@/entities/employee/entity"

type Props = {
  employees: Employee[];
}

export function EmployeeListPresenter({ employees }: Props) {
  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold">従業員リスト</h2>
      <div className="mt-4 bg-white">
        <table className="w-full rounded-md">
          <thead className="rounded-t-md">
            <Tr className="rounded-t-md bg-zinc-100">
              <Th className="rounded-tl-md">
                <span>名前</span>
              </Th>
              <Th>
                <span>年齢</span>
              </Th>
              <Th>
                <span>マイナンバー</span>
              </Th>
              <Th>
                <span>家族構成</span>
              </Th>
              <Th className="rounded-tr-md">
                <span>所属クラブ</span>
              </Th>
            </Tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              // keyの設定を忘れないこと
              // 常にブラウザのconsoleを開いておき、確認し続けること
              // consoleを開いておけば警告が出るので、それを見て対応すること
              <Tr className="hover:bg-zinc-50" key={employee.employeeId}>
                <td className="py-3 pl-6 pr-2">{employee.name}</td>
                <td className="py-3 pl-6 pr-2">{employee.age}</td>
                <td className="py-3 pl-6 pr-2">{employee.myNumber.myNumber}</td>
                <td className="py-3 pl-6 pr-2">
                  {employee.familyMembers.map((familyMember) => (
                    <p key={familyMember.familyMemberId}>
                      {familyMember.name} {familyMember.relation}{" "}
                      {familyMember.age}歳
                    </p>
                  ))}
                </td>
                <td className="py-3 pl-6 pr-2">
                  {employee.clubs.map((club) => (
                    // 多対多の関係にあるデータはkeyがオブジェクトのid単体だと不十分である
                    // 以下のように複合させる必要がある
                    <p key={`${employee.employeeId}-${club.clubId}`}>
                      {club.name}
                    </p>
                  ))}
                </td>
              </Tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
