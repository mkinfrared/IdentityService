import { classNames } from "@identity-service/core";
import { Card, Spinner } from "@identity-service/ui";
import { Suspense, lazy, memo } from "react";

import { useReturnUrl } from "hooks";

import css from "./Main.module.scss";
import { MainProps } from "./Main.type";

const ConfirmEmail = lazy(
  () =>
    import(
      /* webpackChunkName: "ConfirmEmail" */
      /* webpackPrefetch: true */
      "components/ConfirmEmailForm"
    ),
);

const LoginForm = lazy(
  () =>
    import(
      /* webpackChunkName: "LoginForm" */
      /* webpackPrefetch: true */
      "components/LoginForm"
    ),
);

const RegisterForm = lazy(
  () =>
    import(
      /* webpackChunkName: "RegisterForm" */
      /* webpackPrefetch: true */
      "components/RegisterForm"
    ),
);

const Main = ({ className, path }: MainProps) => {
  const returnUrl = useReturnUrl();

  let child: JSX.Element;

  switch (path) {
    case "login":
      child = <LoginForm className={css.formContainer} returnUrl={returnUrl} />;

      break;
    case "register":
      child = (
        <RegisterForm className={css.formContainer} returnUrl={returnUrl} />
      );

      break;
    case "confirmEmail":
      child = (
        <ConfirmEmail className={css.formContainer} returnUrl={returnUrl} />
      );

      break;
    default:
      child = <LoginForm className={css.formContainer} returnUrl={returnUrl} />;
  }

  return (
    <div className={classNames(css.Main, className)}>
      <Card className={css.card}>
        <Suspense
          fallback={<Spinner className={css.spinner} type="infinity" />}
        >
          {child}
        </Suspense>
      </Card>
    </div>
  );
};

export { Main };

export default memo(Main);

/* webpackInclude: /\.json$/ */
/* webpackExclude: /\.noimport\.json$/ */
/* webpackChunkName: "my-chunk-name" */
/* webpackMode: "lazy" */
/* webpackPrefetch: true */
/* webpackPreload: true */
