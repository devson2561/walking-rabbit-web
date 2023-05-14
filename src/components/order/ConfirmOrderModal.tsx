import { Cancel } from "iconoir-react";

import { Beverage } from "../../interfaces/beverage.interface";
import { BeverageConfig } from "../../interfaces/beverage-config.interface";
import PriceRow from "./PriceRow";

interface Props {
  visible: boolean;
  beverage: Beverage;
  configs: BeverageConfig[];
  onClose?: () => void;
  onConfirm?: () => void;
}

export default function ConfirmOrderModal(props: Props) {
  const { visible, configs, beverage, onClose, onConfirm } = props;

  if (!visible) return null;

  const totalPrice =
    beverage.price +
    configs.reduce((total, current) => total + current.additional_price, 0);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-4 py-6 w-full max-w-sm flex flex-col items-center gap-2 relative">
        <div className="absolute top-0 right-0 m-2">
          <button onClick={onClose}>
            <Cancel />
          </button>
        </div>
        <img src="/logo.png" alt="" className="h-24" />
        <h2 className="text-lg mb-4">ยืนยันคำสั่งซื้อ</h2>
        <div className="flex flex-col gap-1 w-full mb-4">
          <PriceRow
            title={beverage.title}
            value={beverage.price.toLocaleString()}
          />
          {configs
            .filter((c) => c.additional_price > 0)
            .map((config: BeverageConfig, i: number) => (
              <PriceRow
                key={`config-price-${i}`}
                title={config.value}
                value={config.additional_price.toLocaleString()}
              />
            ))}

          <PriceRow
            title="ราคารวม"
            value={totalPrice.toLocaleString()}
            titleClass="text-lg"
            valueClass="text-lg"
          />
        </div>
        <button
          className="btn bg-primary rounded-full w-full max-w-xs"
          onClick={onConfirm}
        >
          ยืนยันออเดอร์
        </button>
      </div>
    </div>
  );
}
