import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CategoryCard from "../../components/machine/CategoryCard";
import { Category } from "../../interfaces/category.interface";
import categoryService from "../../services/category.service";
import useMachineStore from "../../store/useMachineStore";

export default function MachineHomePage() {
  const navigate = useNavigate();
  const { machineId } = useParams();

  const loadStocks = useMachineStore((state) => state.loadStocks);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    const data = await categoryService.list();
    setCategories(data);
  };

  const onInit = async () => {
    if (!machineId) return;
    setIsLoading(true);
    await Promise.all([fetchCategories(), loadStocks(machineId)]);
    setIsLoading(false);
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <div className="bg-[white] h-full flex flex-col items-center pt-5">
      <h2 className="text-xl text-[black] font-[500] mb-5">เลือกหมวดหมู่</h2>
      {!isLoading ? (
        <div className="grid grid-cols-3 gap-4 w-full px-2">
          {categories.map((category: Category, i: number) => (
            <CategoryCard
              key={`category-card-${i}`}
              category={category}
              onClick={() => {
                navigate(
                  `/machines/${machineId}/products?categoryId=${category.id}`
                );
              }}
            />
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
