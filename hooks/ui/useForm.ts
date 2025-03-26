"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";

export interface FormFieldContextValue<
  TFieldValues extends Record<string, unknown> = Record<string, unknown>
> {
  name: keyof TFieldValues;
  id: string;
}

/**
 * Hook for accessing form field context within Form components
 */
export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField must be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);
const FormItemContext = React.createContext<{ id: string }>({ id: "" });

export { FormFieldContext, FormItemContext };
