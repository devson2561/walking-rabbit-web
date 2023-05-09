import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CategoryCard from "../../components/machine/CategoryCard";
import { Category } from "../../interfaces/category.interface";
import categoryService from "../../services/category.service";

export default function MachineHomePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const data = await categoryService.list();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-[white] h-full flex flex-col items-center pt-5">
      <h2 className="text-xl text-[black] font-[500] mb-5">เลือกหมวดหมู่</h2>
      <div className="grid grid-cols-3 gap-4 w-full px-2">
        {categories.map((category: Category, i: number) => (
          <CategoryCard
            key={`category-card-${i}`}
            category={category}
            onClick={() => {
              navigate(`/machines/${id}/products?categoryId=${category.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}
