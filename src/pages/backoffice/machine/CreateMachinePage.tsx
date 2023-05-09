import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Map, {
  GeolocateControl,
  Marker,
  Popup,
  ViewStateChangeEvent,
} from "react-map-gl";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
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
import beverageService from "../../../services/beverage.service";
import ingredientService from "../../../services/ingredient.service";
import machineService from "../../../services/machine.service";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("กรุณากรอกชื่อสินค้า"),
  lat: Yup.string().required("กรุณากรอก"),
  lng: Yup.string().required("กรุณากรอก"),
});

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGV2c29uMjU2MSIsImEiOiJjbGhjOWtjdnMwdTVqM3JwY2U4aGp4ODh4In0.0SJusQqlWyCm7NLeeT6YxA";
const imgUrl =
  "https://positioningmag.com/wp-content/uploads/2021/12/TAO-BIN-01.jpg";

export default function CreateMachinePage() {
  const navigate = useNavigate();
  const [viewport, setViewport] = useState({
    longitude: 100.523186,
    latitude: 13.736717,
    zoom: 12,
  });

  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [beverageIngredients, setBeverageIngredients] = useState<
    BeverageIngredient[]
  >([]);

  const [selectedBeverages, setSelectedBeverages] = useState<
    readonly Beverage[]
  >([]);

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    watch,
  } = useForm(formOptions);

  const lat = watch("lat");
  const lng = watch("lng");

  const fetchBeverages = async () => {
    const data = await beverageService.list();
    setBeverages(data);
  };

  const onInit = async () => {
    Swal.showLoading();
    await Promise.all([fetchBeverages()]);
    Swal.close();
  };

  const fetchIngredients = async () => {
    const data = await beverageService.listIngredients(
      selectedBeverages.map((s) => s.id)
    );
    setBeverageIngredients(data);
  };

  useEffect(() => {
    onInit();

    setValue("lng", 100.523186);
    setValue("lat", 13.736717);
  }, []);

  useEffect(() => {
    setViewport({
      latitude: lat,
      longitude: lng,
      zoom: 12,
    });
  }, [lat, lng]);

  useEffect(() => {
    fetchIngredients();
  }, [selectedBeverages]);

  const onSubmit = async (values: any) => {
    const { capacity, stock, title, lat, lng } = values;

    const stocks = beverageIngredients.map((bi: BeverageIngredient) => {
      return {
        ingredient_id: bi.ingredient_id,
        stock: stock[bi.ingredient_id],
        capacity: capacity[bi.ingredient_id],
      };
    });

    const body = {
      title,
      location: [lat, lng],
      stocks,
      beverages: selectedBeverages.map((b) => b.id),
    };

    Swal.showLoading();
    try {
      await machineService.create(body);
      Swal.close();
      Swal.fire("สำเร็จ", "เพิ่มสินค้าสำเร็จ", "success");
      navigate(-1);
    } catch (error) {
      Swal.close();
      showErrorDialog(error);
    }
  };

  return (
    <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row justify-between items-center">
        <div className="text-lg">เพิ่มสินค้า</div>
        <button className="btn btn-primary min-w-10 btn-sm" type="submit">
          Save
        </button>
      </div>

      <div className="flex flex-col w-full  ">
        {/* title */}
        <div className="form-control mb-4 w-full">
          <label
            className="block lato pb-2 text-[#1F2B3E] text-sm"
            htmlFor="name"
          >
            ชื่อ/สถานที่ ตั้งเครื่อง
          </label>
          <input
            type="text"
            placeholder="ระบุ ชื่อ หรือ สถานที่ ตั้งเครื่อง"
            className="input lato input-bordered w-full input-sm"
            {...register("title")}
          />
          <label className="label">
            <span className="label-text-alt text-error">
              {errors?.title?.message?.toString()}
            </span>
          </label>
        </div>

        {/* location */}
        <div className="grid grid-cols-2 gap-4">
          {/* lat */}
          <div className="form-control mb-4 w-full">
            <label
              className="block lato pb-2 text-[#1F2B3E] text-sm"
              htmlFor="name"
            >
              Latitude
            </label>
            <input
              type="number"
              step="any"
              placeholder="ระบุ latitude"
              className="input lato input-bordered w-full input-sm"
              {...register("lat")}
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.lat?.message?.toString()}
              </span>
            </label>
          </div>
          {/* lng */}
          <div className="form-control mb-4 w-full">
            <label
              className="block lato pb-2 text-[#1F2B3E] text-sm"
              htmlFor="name"
            >
              Longitude
            </label>
            <input
              type="number"
              step="any"
              placeholder="ระบุ longitude"
              className="input lato input-bordered w-full input-sm"
              {...register("lng")}
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.lng?.message?.toString()}
              </span>
            </label>
          </div>
        </div>
        {/* map */}
        <div className="w-full h-[500px] bg-[rgba(0,0,0,0.4)] mb-4">
          <Map
            {...viewport}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={viewport}
            mapStyle="mapbox://styles/mapbox/light-v11"
            onDrag={(map: ViewStateChangeEvent) => {
              const {
                viewState: { latitude, longitude, zoom },
              } = map;
              setViewport({
                latitude,
                longitude,
                zoom,
              });
              setValue("lat", latitude);
              setValue("lng", longitude);
            }}
          >
            {lat && lng ? (
              <Marker longitude={+lng} latitude={+lat} anchor="bottom" />
            ) : (
              <div>Test</div>
            )}
          </Map>
        </div>

        {/* products */}
        <div className="form-control mb-4 w-full">
          <label
            className="block lato pb-2 text-[#1F2B3E] text-sm"
            htmlFor="name"
          >
            สินค้า
          </label>
          <Select
            onChange={(v) => {
              setSelectedBeverages(v);
            }}
            value={selectedBeverages}
            placeholder="เลือกสินค้า"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            className="mb-4"
            options={beverages}
            getOptionLabel={(o) => o.title}
            getOptionValue={(o) => o.id}
            isMulti
          />
          <label className="label">
            <span className="label-text-alt text-error">
              {errors?.title?.message?.toString()}
            </span>
          </label>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-[20%]">วัตถุดิบ</th>
              <th className="w-[40%]">จำนวนบรรจุสูงสุด</th>
              <th className="w-[40%]">จำนวนคงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {beverageIngredients.map((b: BeverageIngredient, i: number) => (
              <tr key={`beverage-ingredient-${i}`}>
                <td>{b.ingredient?.title}</td>
                <td>
                  <input
                    type="number"
                    placeholder={`ระบุจำนวนบรรจุสูงสุด ที่บรรจุในตู้ (${b.ingredient?.unit})`}
                    className="input-sm input input-bordered w-full"
                    {...register(`capacity.${b.ingredient_id}`)}
                  />
                </td>
                <td>
                  <div className="flex flex-row gap-4">
                    <Controller
                      name={`stock.${b.ingredient_id}`}
                      control={control}
                      defaultValue={[0, 10]}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <div className="text-base text-primary">
                            {value ?? 0}%
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            className="range range-primary range-sm flex-1"
                            onChange={(e) => {
                              onChange(e.target.value);
                            }}
                            value={value}
                          />
                        </>
                      )}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
