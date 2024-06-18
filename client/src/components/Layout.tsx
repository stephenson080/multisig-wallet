import Header from "./Header";
import SideBar from "./SideBar";

type Props = {
  children: any;
};

export function Layout(props: Props) {
  return (
    <div className="font-muli">
      <div className="flex w-full">
        <SideBar />
        <div className="flex flex-col w-5/6 ">
          <Header />
          {props.children}
        </div>
      </div>
    </div>
  );
}
