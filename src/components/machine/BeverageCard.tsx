import { MouseEventHandler } from "react";

import { Beverage } from "../../interfaces/beverage.interface";
import useMachineStore from "../../store/useMachineStore";

interface Props {
  beverage: Beverage;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function BeverageCard(props: Props) {
  const { beverage, onClick } = props;
  const stocks = useMachineStore((state) => state.stocks);
  const { ingredients } = beverage;

  let isOutOfStock = false;
  if (ingredients) {
    for (const ingredient of ingredients) {
      const stock = stocks.find(
        (s) => s.ingredient_id === ingredient.ingredient_id
      );
      if (!stock || stock.stock < ingredient.usage) {
        isOutOfStock = true;
      }
    }
  }

  return (
    <button
      onClick={isOutOfStock ? () => undefined : onClick}
      className="bg-white border rounded-md p-2 flex flex-col items-center gap-4 relative"
    >
      <div className="flex flex-col items-center pt-4 gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2367/2367626.png"
          alt=""
          className="w-20 h-20"
        />
        <h2 className="text-xs font-[500] text-center">{beverage.title}</h2>
      </div>
      <div className="absolute top-0 right-0 p-1">
        <div className="text-xs">฿ {beverage.price ?? "ฟรี"}</div>
      </div>
      {isOutOfStock ? (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] flex flex-col justify-center items-center">
          <h2 className="text-[red] text-xl">หมด</h2>
        </div>
      ) : null}
    </button>
  );
}
