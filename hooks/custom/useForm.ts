import { useCallback, useEffect, useMemo, useState } from "react";

export type useFormProps<T extends {}> = {
  initialState: T;
  optionalFields?: (keyof T)[];
};

export default function useForm<T extends {}>({
  initialState,
  optionalFields,
}: useFormProps<T>) {
  const [formData, setFormData] = useState(initialState);

  let errObj: any = useMemo(() => {
    return {};
  }, []);

  let compulsoryFields: any = useMemo(() => {
    return {};
  }, []);

  useEffect(() => {
    Object.keys(formData)
      .filter((v) => !optionalFields?.includes(v as keyof T))
      .forEach((v) => {
        compulsoryFields[v] = (formData as any)[v];
      });
  }, [compulsoryFields, formData, optionalFields]);

  useEffect(() => {
    Object.keys(initialState as any)?.forEach((key) => {
      errObj[key] = false;
    });
  }, [initialState, errObj]);

  const [formErrors, setFormErrors] = useState(errObj);

  const toggleError = useCallback((key: keyof T) => {
    setFormErrors((p: any) => ({ ...p, [key]: !p[key] }));
  }, []);

  const updateForm = useCallback(
    (key: keyof T, value: any) => {
      setFormData((p) => ({ ...p, [key]: value }));
      formErrors[key] && toggleError(key);
    },
    [formErrors, toggleError]
  );

  const formIsValid = useMemo(() => {
    return Object.values(compulsoryFields as object).every((v) => {
      return v > "";
    });
  }, [compulsoryFields]);
  return { formData, updateForm, formIsValid, formErrors, toggleError };
}
