import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CustomerService from "../../../services/CustomerService";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {IconDeviceFloppy, IconX} from '@tabler/icons-react'

const schema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, "nama tidak boleh kosong"),
  phone: zod
    .string()
    .min(1, "nomor telepon tidak boleh kosong")
    .regex(
      /^(\+62|0)(8[0-9]{2}[-.\s]?[0-9]{3,}-?[0-9]{3,}|\(0[0-9]{2}\)[-\s]?[0-9]{3,}-?[0-9]{3,}|\+62[-\s]?[0-9]{1,2}[-.\s]?[0-9]{3,}-?[0-9]{3,})$/,
      "nomor telepon yang diterima dalam Indonesia"
    ),
  username: zod.string().min(1, "username tidak boleh kosong"),
});

export default function CustomerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    reset,
    setValue,
  } = useForm({ mode: "onChange", resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const customerService = useMemo(() => CustomerService(), []);
  const { id } = useParams();

  const clearForm = () => {
    clearErrors();
    reset();
  };

  const handleBack = () => {
    clearForm();
    navigate("/customer");
  };

  const onSubmit = async (data) => {
    try {
      const response = await customerService.update(data);
      if (response && response.statusCode === 202 ) {
        clearForm();
      }
      navigate("/customer");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      const getCustomerById = async () => {
        try {
          const response = await customerService.getById(id);
          const currentCustomer = response.data;
          setValue("id", currentCustomer.customerId);
          setValue("name", currentCustomer.customerName);
          setValue("phone", currentCustomer.customerPhone);
          setValue("username", currentCustomer.customerUsername);
        } catch (error) {
          console.log(error);
        }
      };
      getCustomerById();
    }
  }, []);

  return (
    <div className="shadow-sm p-4 rounded-2">
      <h2 className="mb-4">Form Customer</h2>
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
        <div className="row-rows-cols-2">
          <div className="mb-3">
            <label htmlFor="phone" className="form-label required">
              Nomor Telepon
            </label>
            <input
              {...register("phone")}
              type="text"
              className={`form-control ${errors.phone && "is-invalid"}`}
              name="phone"
              id="phone"
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label required">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              className={`form-control ${errors.username && "is-invalid"}`}
              name="username"
              id="username"
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>
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
