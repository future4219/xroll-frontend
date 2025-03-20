import { ReactNode} from "react";

type Props = {
    className?: string;
    children:   ReactNode;
};

export function Tr({ className, children }: Props) {
    return (
        <tr className={`${className} border-b border-zinc-200 text-left`}>
            {children}
        </tr>
    );
}
