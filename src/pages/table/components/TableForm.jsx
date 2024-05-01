import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import TableService from "../../../services/TableService";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { showErrorToast, showSuccessToast } from "../../../utils/ToastUtil";

const schema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, "meja tidak boleh kosong"),
});

export default function TableForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    reset,
    setValue,
  } = useForm({ mode: "onChange", resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const tableService = useMemo(() => TableService(), []);
  const { id } = useParams();

  const clearForm = () => {
    clearErrors();
    reset();
  };

  const handleBack = () => {
    clearForm();
    navigate("/table");
  };

  const onSubmit = async (data) => {
    try {
      if (data.id) {
        const response = await tableService.update(data);
        if (response && response.statusCode === 202) {
          clearForm();
          showSuccessToast(response.message);
        }
      } else {
        const response = await tableService.create(data);
        if (response && response.statusCode === 201) {
          clearForm();
          showSuccessToast(response.message);
        }
      }
      navigate("/table");
    } catch (err) {
      showErrorToast(err);
    }
  };

  useEffect(() => {
    if (id) {
      const getTableById = async () => {
        try {
          const response = await tableService.getById(id);
          const currentTable = response.data;
          setValue("id", currentTable.tableId);
          setValue("name", currentTable.tableName);
        } catch (error) {
          console.log(error);
        }
      };
      getTableById();
    }
  }, []);

  return (
    <div className="shadow-sm p-4 rounded-2">
      <h2 className="mb-4">Form Meja</h2>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="name" className="form-label required">
            Nama
          </label>
          <input
            {...register("name")}
            type="text"
            className={`form-control ${errors.name && "is-invalid"}`}
            name="name"
            id="name"
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>
        <div className="d-flex gap-2">
          <button
            type="submit"
            disabled={!isValid}
            className="d-flex align-items-center btn btn-primary"
          >
            <i className="me-2">
              <IconDeviceFloppy />
            </i>
            Simpan
          </button>
          <button
            onClick={handleBack}
            type="button"
            className="d-flex align-items-center btn btn-danger text-white"
          >
            <i className="me-2">
              <IconX />
            </i>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
