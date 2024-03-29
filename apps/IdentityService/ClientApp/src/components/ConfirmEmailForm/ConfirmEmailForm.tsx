import { yupResolver } from "@hookform/resolvers/yup";
import { classNames } from "@identity-service/core";
import { Button, Heading } from "@identity-service/ui";
import { memo } from "react";
import { useForm } from "react-hook-form";

import { verifyEmailMutation } from "api/mutations";
import InputField from "components/InputField";
import { ReactComponent as Email } from "icons/email-icon.svg";
import { BASE_URL } from "utils/secrets";
import { confirmEmailSchema } from "utils/validationSchemas";

import css from "./ConfirmEmailForm.module.scss";
import {
  ConfirmEmailFormData,
  ConfirmEmailFormProps,
} from "./ConfirmEmailForm.type";

const ConfirmEmailForm = ({ className, returnUrl }: ConfirmEmailFormProps) => {
  const defaultValues = {
    code: "",
  };

  const { register, handleSubmit, formState } = useForm<ConfirmEmailFormData>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(confirmEmailSchema),
  });

  const { isSubmitting, isValid } = formState;

  const submit = async ({ code }: ConfirmEmailFormData) => {
    try {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("emailToken");

      if (!userId || !token) {
        throw new Error("User ID or token was not found");
      }

      const postData = {
        userId,
        token,
        code: parseInt(code, 10),
      };

      await verifyEmailMutation(postData);

      window.location.replace(BASE_URL + returnUrl);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={classNames(css.ConfirmEmailForm, className)}>
      <form className={css.form} onSubmit={handleSubmit(submit)}>
        <Email className={css.icon} />
        <Heading className={css.heading}>Check your email</Heading>
        <InputField {...register("code")} autoComplete="off" />
        <div className={css.buttonWrapper}>
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            loading={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export { ConfirmEmailForm };

export default memo(ConfirmEmailForm);
