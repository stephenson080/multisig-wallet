type Props = {
  approvals: string[];
};
export function ApprovalsList(props: Props) {
  if (props.approvals.length > 0) {
    return (
      <div className="flex flex-col ml-5">
        <h2 className="mb-2 text-m font-semibold">Wallet Approvers</h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
          {props.approvals.map((a, i) => {
            return <li className="text-sm" key={i}>{a}</li>;
          })}
        </ul>
      </div>
    );
  }
}
