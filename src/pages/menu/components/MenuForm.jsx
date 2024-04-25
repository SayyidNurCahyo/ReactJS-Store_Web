import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import MenuService from "../../../services/MenuService";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { showErrorToast, showSuccessToast } from "../../../utils/ToastUtil";
import { useState } from "react";
import { useRef } from "react";

const schema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, "nama menu tidak boleh kosong"),
  price: zod
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "harga harus berupa angka")
    .transform((val) => parseInt(val))
    .refine((val) => val >= 0, "harga harus lebih dari 0"),
  image: zod.any().refine((files) => {
    if (files.length === 0) return true;
    return ["image/png", "imgae/jpg", "image/jpeg"].includes(files[0].type);
  }, "format gambar tidak sesuai"),
});

export default function MenuForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    reset,
    setValue,
    trigger,
  } = useForm({ mode: "onChange", resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const menuService = useMemo(() => MenuService(), []);
  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState([
    "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw",
  ]);
  const scrollable = useRef(null);

  const clearForm = () => {
    clearErrors();
    reset();
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    const urlImage = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImage(urlImage);
  };

  const handleBack = () => {
    clearForm();
    navigate("/menu");
  };

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      if (data.id) {
        const menu = {
          id: data.id,
          name: data.name,
          price: data.price,
        };
        form.append("menu", JSON.stringify(menu));
        form.append("image", data.image);
        const response = await menuService.update(form);
        if (response && response.statusCode === 202) {
          clearForm();
          showSuccessToast(response.message);
        }
      } else {
        const menu = {
          name: data.name,
          price: data.price,
        };
        form.append("menu", JSON.stringify(menu));
        for (let index = 0; index < Array.from(data.image).length; index++) {
          form.append("image", data.image[index]);
        }
        console.log(Array.from(data.image).length);
        console.log(form.get('image'));
        const response = await menuService.create(form);
        if (response && response.statusCode === 201) {
          clearForm();
          showSuccessToast(response.message);
        }
      }
      navigate("/menu");
    } catch (err) {
      showErrorToast(err);
    }
  };

  useEffect(() => {
    if (id) {
      const getMenuById = async () => {
        try {
          const response = await menuService.getById(id);
          const currentMenu = response.data;
          setValue("id", currentMenu.menuId);
          setValue("name", currentMenu.menuName);
          setValue("price", currentMenu.menuPrice);
          setPreviewImage(currentMenu.imageResponses.url);
          trigger();
        } catch (error) {
          console.log(error);
        }
      };
      getMenuById();
    }
  }, []);

  return (
    <div className="shadow-sm p-4 rounded-2">
      <h2 className="mb-4">Form Menu</h2>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="name" className="form-label required">
            Menu
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
            <label htmlFor="price" className="form-label required">
              Harga
            </label>
            <input
              {...register("price")}
              type="number"
              className={`form-control ${errors.price && "is-invalid"}`}
              name="price"
              id="price"
            />
            {errors.price && (
              <div className="invalid-feedback">{errors.price.message}</div>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            <span className="required">Gambar</span>
            <br />
            <div className="d-flex overflow-auto" ref={scrollable}>
              {previewImage.map((image, index) => (
                <img
                  className="img-thumbnail img-fluid m-1"
                  width={200}
                  height={200}
                  src={image}
                  alt="menu"
                  key={index}
                />
              ))}
              <div
                className="d-flex align-items-center mt-5"
                style={{ cursor: "pointer" }}
              ></div>
            </div>
          </label>
          <input
            {...register("image", {
              onChange: handleImageChange,
            })}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg"
            className={`form-control ${errors.image && "is-invalid"}`}
            name="image"
            id="image"
          />
          {errors.image && (
            <div className="invalid-feedback">{errors.image.message}</div>
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
