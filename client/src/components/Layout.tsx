import Header from "./Header";
import SideBar from "./SideBar";

type Props = {
    children: any
}

export function Layout(props: Props){
    return <div className="font-muli">
    <div className="flex w-full">
      <SideBar />
      <div className="flex flex-col w-5/6 ">
        <Header />
        {props.children}
        {/* <div className="flex w-full h-full bg-white">
          <div className="flex flex-col w-full overflow-y-auto px-5 py-5">
            <table className="w-full text-left text-sm text-slate-500  rtl:text-right">
              <thead className="bg-blue-50 text-xs uppercase ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount&nbsp;($)
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Recipient
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Approvals
                  </th>
                  <th scope="col" className="px-6 py-3">
                    sent
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Approve
                  </th>
                </tr>
              </thead>
              <tbody>
                {transfers?.length > 0 &&
                  transfers.map((e: any, i: any) => (
                    <tr
                      key={i}
                      className="border-b bg-white-50 hover:bg-blue-50 cursor-pointer"
                    >
                      <td
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium"
                      >
                        {Number(e.id) + 1}
                      </td>
                      <td className="px-6 py-4">{formatEther(e.amount)}</td>
                      <td className="px-6 py-4">{e.to}</td>
                      <td className="px-6 py-4">{e.approvals}</td>
                      <td className="px-6 py-4">
                        {e.sent ? "true" : "false"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setisLoading(true);
                            formik.setFieldValue("id", e?.id);
                            formik.handleSubmit();
                          }}
                          className="text-nowrap rounded-lg mt-6 w-full px-3 py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
                        >
                          {isLoading ? "processing..." : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </div>
  </div>
}