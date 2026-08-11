import { ref, watch } from "vue";

// A text field plus its error message, where editing clears the error. Both
// the host and the join form need exactly this.
export function useFormField(initialValue = "") {
  const value = ref(initialValue);
  const error = ref("");

  watch(value, () => {
    error.value = "";
  });

  return { value, error };
}
