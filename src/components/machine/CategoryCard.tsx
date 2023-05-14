import { MouseEventHandler } from "react";

import { Category } from "../../interfaces/category.interface";

interface Props {
  category: Category;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function CategoryCard(props: Props) {
  const { category, onClick } = props;

  return (
    <button
      onClick={onClick}
      className="bg-white border rounded-md p-2 flex flex-col items-center gap-4"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/2367/2367626.png"
        alt=""
        className="w-20 h-20"
      />
      <h2 className="text-base font-[500]">{category.title}</h2>
    </button>
  );
}
