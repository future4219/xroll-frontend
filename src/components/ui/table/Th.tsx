import { ReactNode } from "react"

type Props = {
    className?: string;
    children:   ReactNode;
};

export function Th({ className, children }: Props) {
  return <th className={`${className} py-3 pl-6 pr-2`}>{children}</th>;
}
