import { ArrowLeft } from "iconoir-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ConfigCard from "../../components/order/ConfigCard";
import ConfirmOrderModal from "../../components/order/ConfirmOrderModal";
import { Beverage } from "../../interfaces/beverage.interface";
import { BeverageConfig } from "../../interfaces/beverage-config.interface";
import beverageService from "../../services/beverage.service";
import orderService from "../../services/order.service";
import useMachineStore from "../../store/useMachineStore";
import { getUniqueStrings } from "../../utils/getUniqueStrings";

export default function ConfigOrderPage() {
  const navigate = useNavigate();
  const { productId, machineId } = useParams();

  const loadStocks = useMachineStore((state) => state.loadStocks);

  const [beverage, setBeverage] = useState<Beverage | undefined>(undefined);
  const [selectedConfigs, setSelectedConfigs] = useState<BeverageConfig[]>([]);
  const [isConfirmOrderVisible, setIsConfirmOrderVisible] = useState(false);

  const configs = beverage?.configs ?? [];

  const configKeys = getUniqueStrings(configs.map((r) => r.key));

  const fetchBeverage = async () => {
    if (!productId) return;

    const data = await beverageService.get(productId);
    setBeverage(data);
  };

  useEffect(() => {
    fetchBeverage();
  }, []);

  useEffect(() => {
    for (const key of configKeys) {
      const defaultConfig = configs.find((c) => c.key === key && c.is_default);
      if (defaultConfig) {
        onSelectConfig(defaultConfig);
      }
    }
  }, [configs]);

  const goBack = () => {
    navigate(-1);
  };

  const onSelectConfig = (config: BeverageConfig) => {
    if (config.is_multiple) {
      const configs: string[] = selectedConfigs
        .filter((c) => c.key === config.key)
        .map((c) => c.id);

      if (configs.includes(config.id)) {
        const newConfigs = selectedConfigs.filter((s) => s.id !== config.id);
        setSelectedConfigs(newConfigs);
      } else {
        setSelectedConfigs([...selectedConfigs, config]);
      }
    } else {
      const configs = selectedConfigs.filter((c) => c.key !== config.key);
      const newConfigs = [...configs, config];
      setSelectedConfigs(newConfigs);
    }
  };

  const onConfirmOrder = async () => {
    setIsConfirmOrderVisible(false);
    if (!beverage) return;

    const body = {
      beverage_id: beverage.id,
      machine_id: machineId,
      configs: selectedConfigs.map((c) => c.id),
    };

    const order = await orderService.create(body);

    loadStocks(machineId!);

    navigate(`/machines/${machineId}/orders/${order.id}/processing`);
  };

  return (
    <div className="bg-[white] h-full flex flex-col items-center pt-5 relative">
      <div className="flex flex-row items-center pr-[50px] w-full mb-5  px-4">
        <div className="w-[50px]">
          <button onClick={goBack}>
            <ArrowLeft />
          </button>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-xl text-[black] font-[500] mb-0">
            สั่งเครื่องดื่ม
          </h2>
        </div>
      </div>
      {beverage ? (
        <>
          <div className="flex flex-col items-center gap-2 w-full">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2367/2367626.png"
              alt=""
              className="w-20 h-20 mb-2"
            />
            <div className="text-lg">{beverage?.title}</div>
            <div className="w-full max-w-md flex flex-col gap-4 mb-4">
              {configKeys.map((configKey: any, i: number) => {
                return (
                  <ConfigCard
                    key={`config-group-${i}`}
                    configKey={configKey}
                    configs={configs.filter((c) => c.key === configKey)}
                    onClick={onSelectConfig}
                    selectedConfigs={selectedConfigs.filter(
                      (c) => c.key === configKey
                    )}
                  />
                );
              })}
            </div>

            <button
              className="btn bg-primary rounded-full w-full max-w-xs"
              onClick={() => setIsConfirmOrderVisible(true)}
            >
              ยืนยันออเดอร์
            </button>
          </div>
          <ConfirmOrderModal
            visible={isConfirmOrderVisible}
            onClose={() => setIsConfirmOrderVisible(false)}
            onConfirm={onConfirmOrder}
            configs={selectedConfigs}
            beverage={beverage}
          />
        </>
      ) : null}
    </div>
  );
}
