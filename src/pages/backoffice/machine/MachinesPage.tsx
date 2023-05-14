import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { showErrorDialog } from "../../../helpers/showErrorDialog";
import { Machine } from "../../../interfaces/macine.interface";
import machineService from "../../../services/machine.service";

export default function MachinesPage() {
  const navigate = useNavigate();

  const [machines, setMachines] = useState<Machine[]>([]);

  const onInit = async () => {
    try {
      Swal.showLoading();
      const data = await machineService.list();
      setMachines(data);
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
          to="/admin/machines/create"
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
            <th>เครื่อง</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine: Machine, i: number) => (
            <tr key={`row-${i}`}>
              <td>{i + 1}</td>
              <td>{machine.title}</td>
              <td>
                <div className="flex flex-row">
                  <button
                    className="btn btn-primary btn-sm rounded-md"
                    type="button"
                    onClick={() =>
                      navigate(`/admin/machines/${machine.id}/edit`)
                    }
                  >
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
