import { useMemo } from "react";
import * as zod from "zod";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const schema = zod.object({
  username: zod.string().min(1, "username tidak boleh kosong"),
  password: zod.string().min(1, "password tidak boleh kosong").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,'password harus 8 karakter, 1 uppercase-lowercase-angka'),
  name: zod.string().min(1, "nama tidak boleh kosong"),
  phone: zod.string().min(1, "nomor telepon tidak boleh kosong").regex(/^(\+62|0)(8[0-9]{2}[-.\s]?[0-9]{3,}-?[0-9]{3,}|\(0[0-9]{2}\)[-\s]?[0-9]{3,}-?[0-9]{3,}|\+62[-\s]?[0-9]{1,2}[-.\s]?[0-9]{3,}-?[0-9]{3,})$/, 'nomor telepon yang diterima dalam Indonesia'),
});

export default function Login() {
  const authService = useMemo(() => AuthService(), []);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange", resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await authService.registerAdmin(data);
      if (response && response.statusCode === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const checkToken = async () => {
        if (await authService.validateToken()) {
          navigate("/");
        }
      };
      checkToken();
    }
  }, [authService, navigate]);

  return (
    <>
      <div className="container-fluid p-0">
        <div className="row g-0 justify-content-center">
          <div className="col-xxl-3 col-lg-4 col-md-8 shadow-lg rounded-4">
            <div className="d-flex p-4">
              <div className="w-100">
                <div className="d-flex flex-column h-100">
                  <div className="auth-content my-auto">
                    <div className="text-center">
                      <img
                        src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?w=740&t=st=1713681533~exp=1713682133~hmac=15eae02373e6f0fde868cfd2463e45fcb96c8f60530e85e12d847169858fc4fc"
                        alt="logo-ui"
                        width="400px"
                        className="mb-3"
                      />
                      <h3 className="mb-0">Warung Makan Bahari</h3>
                    </div>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-4 pt-2"
                    >
                      <div className="mb-3">
                        <label htmlFor="username">Username</label>
                        <input
                          {...register("username")}
                          type="text"
                          name="username"
                          id="username"
                          className={`form-control ${
                            errors.username && "is-invalid"
                          }`}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                          {...register("password")}
                          type="password"
                          name="password"
                          id="password"
                          className={`form-control ${
                            errors.password && "is-invalid"
                          }`}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="name">Nama</label>
                        <input
                          {...register("name")}
                          type="text"
                          name="name"
                          id="name"
                          className={`form-control ${
                            errors.name && "is-invalid"
                          }`}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone">Nomor Telepon</label>
                        <input
                          {...register("phone")}
                          type="text"
                          name="phone"
                          id="phone"
                          className={`form-control ${
                            errors.phone && "is-invalid"
                          }`}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">
                            {errors.phone.message}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 text-center">
                        <button
                          disabled={!isValid}
                          type="submit"
                          className="btn btn-primary w-100 waves-effect waves-light bg-info"
                        >
                          Register
                        </button>
                      </div>
                      <hr className="mt-4" />
                      <div className="text-center">
                        <div className="text-muted mb-2">
                          ~ Sudah Punya Akun? ~
                        </div>
                        <Link to="/login"><a
                          className="btn btn-outline-primary w-100 waves-effect waves-light mt-2 bg-info text-white"
                        >
                          Login
                        </a></Link>
                      </div>
                    </form>
                  </div>
                  <div className="mt-4 mt-md-5 text-center">
                    <p className="mb-0">© Warung Makan Bahari</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
