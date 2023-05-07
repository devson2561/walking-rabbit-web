import { Machine } from "../../interfaces/macine.interface";

interface Props {
  machine: Machine;
}

const imgUrl =
  "https://positioningmag.com/wp-content/uploads/2021/12/TAO-BIN-01.jpg";

export default function MachineCard(props: Props) {
  const { machine } = props;
  return (
    <button className="bg-white border flex flex-row p-2 gap-2">
      <img src={imgUrl} alt="" className="w-14 h-14 object-cover" />
      <div className="flex-1 flex flex-col items-start">
        <h2>{machine.title}</h2>
      </div>
    </button>
  );
}
