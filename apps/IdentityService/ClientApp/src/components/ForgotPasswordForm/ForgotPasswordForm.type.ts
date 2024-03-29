export type ForgotPasswordFormProps = {
  /**
   * a string that will be applied as a css class to parent element
   */
  className?: string;
  returnUrl: string;
};

export type ForgotPasswordFormContainerProps = Omit<
  ForgotPasswordFormProps,
  "returnUrl"
>;
