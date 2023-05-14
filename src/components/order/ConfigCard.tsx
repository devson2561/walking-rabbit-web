import { BeverageConfig } from "../../interfaces/beverage-config.interface";

interface Props {
  configs: BeverageConfig[];
  selectedConfigs: BeverageConfig[];
  configKey: string;
  onClick: (config: BeverageConfig) => void;
}

export default function ConfigCard(props: Props) {
  const { configs, configKey, onClick, selectedConfigs } = props;

  const selectedConfigsIds = selectedConfigs.map((s: BeverageConfig) => s.id);

  return (
    <div className="card bg-white border border-black rounded-md w-full p-2 gap-2">
      <h2 className="mb-2">{configKey}</h2>
      <div className="flex flex-row justify-end gap-2">
        {configs.map((config: BeverageConfig, i: number) => {
          const isActive = selectedConfigsIds.includes(config.id);
          return (
            <button
              className={`border border-primary p-1 px-2 text-sm rounded-xl ${
                isActive ? "border-primary bg-primary text-white" : ""
              }`}
              key={`${configKey}-option-${i}`}
              onClick={() => onClick(config)}
            >
              {config.value}{" "}
              {config.additional_price ? (
                <span className="text-[green]">{`+${config.additional_price}`}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
