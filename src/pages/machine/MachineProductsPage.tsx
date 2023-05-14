import { ArrowLeft } from "iconoir-react";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import BeverageCard from "../../components/machine/BeverageCard";
import { Beverage } from "../../interfaces/beverage.interface";
import machineService from "../../services/machine.service";

export default function MachineProductsPage() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [beverages, setBeverages] = useState<Beverage[]>([]);

  const fetchBeverages = async () => {
    if (!machineId) return;

    const data = await machineService.listBeverages(machineId, categoryId);
    setBeverages(data);
  };

  useEffect(() => {
    fetchBeverages();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-[white] h-full flex flex-col items-center pt-5">
      <div className="flex flex-row items-center pr-[50px] w-full mb-5  px-4">
        <div className="w-[50px]">
          <button onClick={goBack}>
            <ArrowLeft />
          </button>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-xl text-[black] font-[500] mb-0">
            เลือกเครื่องดื่ม
          </h2>
        </div>
      </div>
      {beverages.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 w-full px-2">
          {beverages.map((beverage: Beverage, i: number) => (
            <BeverageCard
              key={`beverage-card-${i}`}
              beverage={beverage}
              onClick={() => {
                navigate(`/machines/${machineId}/products/${beverage.id}`);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center border w-full h-full">
          <div className="text-lg">ไม่พบสินค้าในหมวดหมู่ที่คุณเลือก</div>
        </div>
      )}
    </div>
  );
}
