type Props = {
    children: any
}
export function Empty(props: Props){
    return <div className="flex justify-center items-center w-full h-50">
        {props.children}
    </div>
}