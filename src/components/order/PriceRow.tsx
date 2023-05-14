interface PriceRowProps {
  title: string;
  value: string;
  titleClass?: string;
  valueClass?: string;
}

export default function PriceRow(props: PriceRowProps) {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className={` ${props.titleClass ?? "text-sm"}`}>{props.title}</div>
      <div className={` ${props.valueClass ?? "text-sm"}`}>฿ {props.value}</div>
    </div>
  );
}
