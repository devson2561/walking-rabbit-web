import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { showErrorDialog } from "../../../helpers/showErrorDialog";
import { Beverage } from "../../../interfaces/beverage.interface";
import beverageService from "../../../services/beverage.service";

export default function BeveragesPage() {
  const [beverages, setBeverages] = useState<Beverage[]>([]);

  const onInit = async () => {
    try {
      Swal.showLoading();
      const data = await beverageService.list();
      setBeverages(data);
      Swal.close();
    } catch (error) {
      Swal.close();
      showErrorDialog(error);
    }
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="text-lg">Beverages</div>
        <Link
          to="/admin/beverages/create"
          className="btn btn-primary min-w-10 btn-sm"
        >
          Create
        </Link>
      </div>
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>สินค้า</th>
            <th>หมวดหมู่</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {beverages.map((beverage: Beverage, i: number) => (
            <tr key={`row-${i}`}>
              <td>{i + 1}</td>
              <td>{beverage.title}</td>
              <td>{beverage.category?.title}</td>
              <td>
                <div className="flex flex-row">
                  <button className="btn btn-primary btn-sm rounded-md">
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
