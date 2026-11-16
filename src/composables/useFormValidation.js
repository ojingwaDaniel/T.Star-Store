import { reactive } from "vue";

// rules = { field: [rule, rule] }; the first failing rule sets the message.
export function useFormValidation(rules) {
  const errors = reactive({});

  function validateField(field, form) {
    for (const rule of rules[field] || []) {
      const msg = rule(form[field], form);
      if (msg) {
        errors[field] = msg;
        return false;
      }
    }
    errors[field] = "";
    return true;
  }

  function validate(form) {
    let ok = true;
    for (const field of Object.keys(rules))
      if (!validateField(field, form)) ok = false;
    return ok;
  }

  // Laravel 422: { message, errors: { 'customer.email': ['...'] } }
  function setServerErrors(apiError) {
    for (const [key, val] of Object.entries(apiError?.errors || {})) {
      errors[key.replace(/^(customer|delivery)\./, "")] = Array.isArray(val)
        ? val[0]
        : val;
    }
  }

  const reset = () => Object.keys(errors).forEach((k) => delete errors[k]);

  return { errors, validate, validateField, setServerErrors, reset };
}
