import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";

import {
    validateUsername,
    validatePassword,
    validateEmail,
} from "utils/validators";

/**
 * Form for creating a new admin user.
 * 
 * @param {{onSubmit: Function, onCancel: Function}} props - Component props
 * @prop {Function} onSubmit - Function to be called after submitting the form
 * @prop {Function} onCancel - Function to be called after cancelling the form
 * @returns {JSX.Element} - Form component
 */
const CreateAdminForm = ({ onSubmit, onCancel }) => {
    return (
        <Formik
            initialValues={{
                username: "",
                email: "",
                full_name: "",
                password: "",
                confirmPassword: "",
            }}

            validationSchema={Yup.object({
                username: Yup.string()
                    .test(
                        "valid-username",
                        "Некорректный логин",
                        validateUsername
                    )
                    .required("Обязательное поле"),
                email: Yup.string()
                    .test(
                        "valid-email",
                        "Некорректный email",
                        validateEmail
                    )
                    .required("Обязательное поле"),
                full_name: Yup.string()
                    .required("Обязательное поле"),
                password: Yup.string()
                    .test(
                        "valid-password",
                        "Слабый пароль",
                        validatePassword
                    )
                    .required("Обязательное поле"),
                confirmPassword: Yup.string()
                    .oneOf(
                        [Yup.ref("password"), null],
                        "Пароли должны совпадать"
                    )
                    .required("Обязательное поле"),
            })}

            onSubmit={onSubmit}
        >

            {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="auth-form">

                    <div className="modal-form-group">
                        <label htmlFor="username">
                            Логин
                        </label>
                        <Field
                            type="text"
                            name="username"
                            id="username"
                            className="form-input"
                        />
                        <ErrorMessage
                            name="username"
                            component="div"
                            className="error-message"
                        />
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="email">
                            Email
                        </label>
                        <Field
                            type="email"
                            name="email"
                            id="email"
                            className="form-input"
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="error-message"
                        />
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="full_name">
                            Полное имя
                        </label>
                        <Field
                            type="text"
                            name="full_name"
                            id="full_name"
                            className="form-input"
                        />
                        <ErrorMessage
                            name="full_name"
                            component="div"
                            className="error-message"
                        />
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="password">
                            Пароль
                        </label>
                        <Field
                            type="password"
                            name="password"
                            id="password"
                            className="form-input"
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="error-message"
                        />
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="confirmPassword">
                            Подтвердите пароль
                        </label>
                        <Field
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="form-input"
                        />
                        <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="error-message"
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="modal-btn cancel"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="modal-btn submit"
                        >
                            {isSubmitting ? "Создание..." : "Создать"}
                        </button>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default CreateAdminForm;
