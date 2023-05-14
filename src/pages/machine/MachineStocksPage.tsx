import { ArrowLeft } from "iconoir-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MachineStock } from "../../interfaces/machine-stock.interface";
import useMachineStore from "../../store/useMachineStore";

export default function MachineStocksPage() {
  const navigate = useNavigate();
  const { machineId } = useParams();

  const loadStocks = useMachineStore((state) => state.loadStocks);
  const stocks = useMachineStore((state) => state.stocks);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onInit = async () => {
    if (!machineId) return;
    setIsLoading(true);
    await Promise.all([loadStocks(machineId)]);
    setIsLoading(false);
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <div className="bg-[white] h-full flex flex-col items-center pt-5">
      <div className="flex flex-row items-center pr-[50px] w-full mb-5 px-4">
        <div className="w-[50px]">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-xl text-[black] font-[500] mb-0">สต๊อก</h2>
        </div>
      </div>
      {!isLoading ? (
        <div className="flex flex-col gap-4 w-full px-2">
          {stocks.map((stock: MachineStock) => (
            <div className="flex flex-col w-full px-6" key={stock.id}>
              <h2>{`${
                stock.ingredient?.title
              } (${stock.stock.toLocaleString()} / ${stock.capacity.toLocaleString()} ${
                stock.ingredient?.unit
              })`}</h2>
              <progress
                className="progress w-full"
                value={stock.stock}
                max={stock.capacity}
              ></progress>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center ">
          <h2 className="text-xl">Loading...</h2>
        </div>
      )}
    </div>
  );
}
