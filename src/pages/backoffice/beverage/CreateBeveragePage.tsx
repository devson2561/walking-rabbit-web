import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";

import { showErrorDialog } from "../../../helpers/showErrorDialog";
import {
  Beverage,
  CreateBeverage,
} from "../../../interfaces/beverage.interface";
import { BeverageConfig } from "../../../interfaces/beverage-config.interface";
import { BeverageIngredient } from "../../../interfaces/beverage-ingredient.interface";
import { Category } from "../../../interfaces/category.interface";
import { Ingredient } from "../../../interfaces/ingredient.interface";
import { Process } from "../../../interfaces/process.interface";
import beverageService from "../../../services/beverage.service";
import beverageConfigService from "../../../services/beverage-config.service";
import categoryService from "../../../services/category.service";
import ingredientService from "../../../services/ingredient.service";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("กรุณากรอกชื่อสินค้า"),
  price: Yup.string().required("กรุณากรอกราคา"),
  category_id: Yup.string().required("กรุณาเลือกหมวดหมู่"),
});

export default function CreateBeveragePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm(formOptions);

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [beverageConfigs, setBeverageConfigs] = useState<BeverageConfig[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetchMasterSuccess, setIsFetchMasterSuccess] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [processType, setProcessType] = useState<String>("define");

  const [selectedIngredients, setSelectedIngredients] = useState<
    readonly Ingredient[]
  >([]);

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

  const fetchIngredients = async (): Promise<void> => {
    const data = await ingredientService.list();
    setIngredients(data);
  };

  const fetchBeverageConfigs = async (): Promise<void> => {
    const data = await beverageConfigService.list();
    setBeverageConfigs(data);
  };

  const fetchCategories = async (): Promise<void> => {
    const data = await categoryService.list();
    setCategories(data);
  };

  const fetchBeverage = async (): Promise<void> => {
    if (!id) return;

    Swal.showLoading();
    try {
      const data = await beverageService.get(id);

      setValue("title", data.title);
      setValue("price", data.price);
      setValue("category_id", data.category_id);

      const ingredientsIds = data.ingredients.map((d) => d.ingredient_id);

      const selectedIngredients = ingredients.filter((d) =>
        ingredientsIds.includes(d.id)
      );

      setSelectedIngredients(selectedIngredients);

      for (const index in selectedIngredients) {
        const ingredient = selectedIngredients[index];
        const selectedIngredient = data.ingredients.find(
          (i) => i.ingredient_id === ingredient.id
        );

        setValue(`usages.${ingredient.id}`, selectedIngredient?.usage);
      }

      for (const key of beverageConfigKeys) {
        const config = data.configs.find((c) => c.key === key);
        if (config) {
          setValue(`configs.${config.id}`, true);
        }
      }

      if (data.processes && data.processes.length > 0) {
        const processes = data.processes.map((d) => ({ ...d, id: uuidv4() }));
        setProcesses(processes);

        for (const process of processes) {
          setValue(`process-titles.${process.id}`, process.title);
          setValue(`process-durations.${process.id}`, process.duration);
        }
        setProcessType("define");
      }

      Swal.close();
    } catch (error) {
      Swal.close();
      showErrorDialog(error);
      return;
    }
  };

  const onInit = async () => {
    Swal.showLoading();

    await Promise.all([
      fetchIngredients(),
      fetchBeverageConfigs(),
      fetchCategories(),
    ]);

    setIsFetchMasterSuccess(true);

    if (!id) {
      Swal.close();
    }
  };

  useEffect(() => {
    onInit();
  }, []);

  useEffect(() => {
    if (isFetchMasterSuccess && id) {
      fetchBeverage();
    }
  }, [isFetchMasterSuccess]);

  const onSubmit = async (values: any) => {
    const { usages, title, price, category_id } = values;
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
      price: +price,
      configs,
      ingredients,
      processes: processes.map((p: Process, i: number) => {
        if (!p.id) return null;
        const duration = values[`process-durations`][p.id!];
        const title = values[`process-titles`][p.id!];

        return { ...p, index: i, duration, title };
      }),
    } as CreateBeverage;

    Swal.showLoading();
    try {
      if (id) {
        await beverageService.update(id, body);
      } else {
        await beverageService.create(body);
      }
      Swal.close();
      Swal.fire("สำเร็จ", "เพิ่มสินค้าสำเร็จ", "success");
      navigate(-1);
    } catch (error) {
      Swal.close();
      showErrorDialog(error);
    }
  };

  useEffect(() => {
    if (processType === "define" && processes.length === 0) {
      setProcesses([{ title: "", duration: undefined, id: uuidv4() }]);
    }
  }, [processType]);

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
              className="block  pb-2 text-[#1F2B3E] text-sm"
              htmlFor="name"
            >
              ชื่อสินค้า
            </label>
            <input
              type="text"
              placeholder="ชื่อสินค้า"
              className="input  input-bordered w-full input-sm"
              {...register("title")}
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.title?.message?.toString()}
              </span>
            </label>
          </div>

          {/* price */}
          <div className="form-control mb-4 w-full">
            <label
              className="block  pb-2 text-[#1F2B3E] text-sm"
              htmlFor="name"
            >
              ราคา (บาท)
            </label>
            <input
              type="text"
              placeholder="ระบุราคาสินค้า ใส่ 0 ถ้าอยากให้กินฟรี"
              className="input  input-bordered w-full input-sm"
              {...register("price")}
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.price?.message?.toString()}
              </span>
            </label>
          </div>

          {/* category */}
          <div className="form-control mb-4 w-full">
            <label
              className="block  pb-2 text-[#1F2B3E] text-sm"
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
      {/* process*/}
      <div className="flex flex-col bg-white p-2 gap-4">
        <h2>ขั้นตอนการทำงาน</h2>

        <div className="flex flex-row gap-6">
          <div className="flex flex-row gap-2 items-center">
            <input
              className="radio radio-primary"
              type="radio"
              value="undefine"
              name="processType"
              onChange={(e) => setProcessType(e.target.value)}
            />
            <div className="text-sm">อัตโนมัติ</div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <input
              className="radio radio-primary"
              type="radio"
              value="define"
              name="processType"
              onChange={(e) => setProcessType(e.target.value)}
            />
            <div className="text-sm">กำหนดค่า</div>
          </div>
        </div>

        {processType === "define" ? (
          <>
            <div className="flex flex-col mb-4 gap-2">
              {processes.map((process: Process) => (
                <div
                  className="flex flex-row items-center gap-2 border max-w-lg"
                  key={`process-configs-${process.id}`}
                >
                  <input
                    key={`process-titles-${process.id}`}
                    type="text"
                    className="input input-bordered w-full input-sm flex-3"
                    placeholder="ชื่อขั้นตอน"
                    {...register(`process-titles.${process.id}`, {
                      required: "กรุณากรอก",
                    })}
                  />
                  <input
                    type="number"
                    className="input input-bordered w-full input-sm flex-2"
                    placeholder="เวลา (วินาที)"
                    {...register(`process-durations.${process.id}`, {
                      required: "กรุณากรอก",
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => {
                      setProcesses(
                        processes.filter((p: Process) => p.id !== process.id)
                      );
                    }}
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary w-full max-w-md btn-sm"
              onClick={() => {
                setProcesses([
                  ...processes,
                  { title: undefined, duration: undefined, id: uuidv4() },
                ]);
              }}
            >
              เพิ่ม
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}
