type Props = {
  onClose: () => void;
  children: any;
  show: boolean;
  title: string;
};
export function Modal(props: Props) {
  if (!props.show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto h-full max-h-full">
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {props.title}
            </h3>
            <button
              onClick={props.onClose}
              className="text-gray-400 bg-transparent  hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
