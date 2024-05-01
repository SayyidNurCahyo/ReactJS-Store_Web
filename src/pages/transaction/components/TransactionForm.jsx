import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import TransactionService from "../../../services/TransactionService";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { showErrorToast, showSuccessToast } from "../../../utils/ToastUtil";
import { useState } from "react";
import { useQuery } from "react-query";
import CustomerService from "../../../services/CustomerService";
import SearchDropdown from "./SearchDropdown";

const schema = zod.object({
  id: zod.string().optional(),
  date: zod.string().refine((tanggal) => {
    const tgl = new Date(tanggal);
    return !isNaN(tgl) && tgl <= new Date();
  }, "masukan tanggal tidak boleh lebih dari tanggal saat ini"),
  customer: zod.string().min(1, "nama customer tidak boleh kosong"),
});

export default function TransactionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    reset,
    setValue,
    trigger,
    getValues,
  } = useForm({ mode: "onChange", resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const transactionService = useMemo(() => TransactionService(), []);
  const customerService = useMemo(() => CustomerService(), []);
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      return await customerService.getAll();
    },
  });

  const clearForm = () => {
    clearErrors();
    reset();
  };

  const handleBack = () => {
    clearForm();
    navigate("/transaction");
  };

  const onSubmit = async (data) => {
    try {
      if (data.id) {
        const response = await transactionService.update(data);
        if (response && response.statusCode === 202) {
          clearForm();
          showSuccessToast(response.message);
        }
      } else {
        const response = await transactionService.create(data);
        if (response && response.statusCode === 201) {
          clearForm();
          showSuccessToast(response.message);
        }
      }
      navigate("/transaction");
    } catch (err) {
      showErrorToast(err);
    }
  };

  useEffect(() => {
    if (id) {
      const getTransactionById = async () => {
        try {
          const response = await transactionService.getById(id);
          const currentTransaction = response.data;
          setValue("id", currentTransaction.transactionId);
          setValue("name", currentTransaction.transactionName);
          trigger();
        } catch (error) {
          console.log(error);
        }
      };
      getTransactionById();
    }
  }, [id, setValue, transactionService, trigger]);

  return (
    <div className="shadow-sm p-4 rounded-2">
      <h2 className="mb-4">Form Transaksi</h2>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="date" className="form-label required">
            Tanggal Transaksi
          </label>
          <input
            {...register("date")}
            type="date"
            className={`form-control ${errors.date && "is-invalid"}`}
            id="date"
            name="date"
          />
          {errors.date && (
            <div className="invalid-feedback">{errors.date.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="customer" className="form-label required">
            Nama Customer
          </label>
          {data && (
            <SearchDropdown
              options={data.data}
              label="customerName"
              id="customerId"
              selectedVal={getValues("customer")}
              handleChange={(value) => {
                setValue("customer", value);
                trigger("customer");
              }}
            />
          )}
          <input
            {...register("customer")}
            type="text"
            className={`form-control ${errors.customer && "is-invalid"}`}
            name="customer"
            id="customer"
            // onChange={handleSearchCustomer}
          />
          {errors.customer && (
            <div className="invalid-feedback">{errors.customer.message}</div>
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
