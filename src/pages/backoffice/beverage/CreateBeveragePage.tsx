import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";

import { showErrorDialog } from "../../../helpers/showErrorDialog";
import { CreateBeverage } from "../../../interfaces/beverage.interface";
import { BeverageConfig } from "../../../interfaces/beverage-config.interface";
import { BeverageIngredient } from "../../../interfaces/beverage-ingredient.interface";
import { Category } from "../../../interfaces/category.interface";
import { Ingredient } from "../../../interfaces/ingredient.interface";
import beverageService from "../../../services/beverage.service";
import beverageConfigService from "../../../services/beverage-config.service";
import categoryService from "../../../services/category.service";
import ingredientService from "../../../services/ingredient.service";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("กรุณากรอกชื่อสินค้า"),
  category_id: Yup.string().required("กรุณาเลือกหมวดหมู่"),
});

export default function CreateBeveragePage() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [beverageConfigs, setBeverageConfigs] = useState<BeverageConfig[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedIngredients, setSelectedIngredients] = useState<
    readonly Ingredient[]
  >([]);

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm(formOptions);

  const fetchIngredients = async () => {
    const data = await ingredientService.list();
    setIngredients(data);
  };

  const fetchBeverageConfigs = async () => {
    const data = await beverageConfigService.list();
    setBeverageConfigs(data);
  };

  const fetchCategories = async () => {
    const data = await categoryService.list();
    setCategories(data);
  };

  const onInit = async () => {
    Swal.showLoading();
    await Promise.all([
      fetchIngredients(),
      fetchBeverageConfigs(),
      fetchCategories(),
    ]);
    Swal.close();
  };

  useEffect(() => {
    onInit();
  }, []);

  const onSubmit = async (values: any) => {
    const { usages, title, category_id } = values;
    const ingredients: BeverageIngredient[] = selectedIngredients.map(
      (s: Ingredient) => {
        const usage: number = usages[s.id];
        return {
          ingredient_id: s.id,
          usage,
        };
      }
    );

    let configs: string[] = [];

    for (const key in values.configs) {
      const value = values.configs[key];
      if (value) {
        configs = [...configs, key];
      }
    }

    const body = {
      title,
      category_id,
      configs,
      ingredients,
    } as CreateBeverage;

    Swal.showLoading();
    try {
      await beverageService.create(body);
      Swal.close();
      Swal.fire("สำเร็จ", "เพิ่มสินค้าสำเร็จ", "success");
      navigate(-1);
    } catch (error) {
      Swal.close();
      showErrorDialog(error);
    }
  };

  const groupedBeverageConfigs = beverageConfigs.reduce(
    (groups: any, item: BeverageConfig) => {
      const group = groups[item.key] || [];
      return {
        ...groups,
        [item.key]: [...group, item],
      };
    },
    {}
  );

  const beverageConfigKeys = Object.keys(groupedBeverageConfigs);

  return (
    <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row justify-between items-center">
        <div className="text-lg">เพิ่มสินค้า</div>
        <button className="btn btn-primary min-w-10 btn-sm" type="submit">
          Save
        </button>
      </div>

      {/* title */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          {/* title */}
          <div className="form-control mb-4 w-full">
            <label
              className="block lato pb-2 text-[#1F2B3E] text-sm"
              htmlFor="name"
            >
              ชื่อสินค้า
            </label>
            <input
              type="text"
              placeholder="ชื่อสินค้า"
              className="input lato input-bordered w-full input-sm"
              {...register("title")}
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.title?.message?.toString()}
              </span>
            </label>
          </div>
          {/* category */}
          <div className="form-control mb-4 w-full">
            <label
              className="block lato pb-2 text-[#1F2B3E] text-sm"
              htmlFor="name"
            >
              หมวดหมู่
            </label>
            <Controller
              control={control}
              name="category_id"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  placeholder="เลือกหมวดหมู่"
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  options={categories}
                  getOptionLabel={(o) => o.title}
                  getOptionValue={(o) => o.id}
                  value={categories.find((c) => c.id === value)}
                  onChange={(val) => onChange(val?.id)}
                />
              )}
            />

            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.category_id?.message?.toString()}
              </span>
            </label>
          </div>
        </div>
      </div>
      {/* ingredients */}
      <div className="flex flex-col bg-white p-2 gap-2">
        <h2>ส่วนผสม</h2>
        <Select
          onChange={(v) => {
            setSelectedIngredients(v);
          }}
          value={selectedIngredients}
          placeholder="เลือกส่วนผสม"
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          className="mb-4"
          options={ingredients}
          getOptionLabel={(o) => o.title}
          getOptionValue={(o) => o.id}
          isMulti
        />
        <table className="table">
          <thead>
            <tr>
              <th>ส่วนผสม</th>
              <th>ปริมาณ / แก้ว</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {selectedIngredients.map((d, i) => {
              return (
                <tr key={`selected-ingredient-${i}`}>
                  <td width="50%">{d.title}</td>
                  <td>
                    <input
                      className="input input-sm input-bordered"
                      type="number"
                      placeholder={`ปริมาณที่ใช้ต่อแก้ว (${d.unit})`}
                      required
                      {...register(`usages.${d.id}`)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        setSelectedIngredients(
                          selectedIngredients.filter((s) => s.id !== d.id)
                        );
                      }}
                    >
                      ลบออก
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* configs */}
      <div className="flex flex-col bg-white p-2 gap-4">
        <h2>ตัวเลือก</h2>

        {beverageConfigKeys.map((key: string, i: number) => {
          const configs = groupedBeverageConfigs[key];
          return (
            <div
              key={`beverage-config-group-${i}`}
              className="flex flex-col mb-4 gap-2"
            >
              <div className="text-sm">{key}</div>
              <div className="grid grid-cols-4 gap-4">
                {configs.map((config: BeverageConfig, ci: number) => (
                  <div
                    className="flex flex-row items-center gap-2 "
                    key={`beverage-config-group-${i}-${ci}`}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary rounded-sm"
                      {...register(`configs.${config.id}`, {
                        value: false,
                      })}
                    />
                    <div className="text-xs">{config.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}
