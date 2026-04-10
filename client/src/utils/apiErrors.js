export const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || fallbackMessage;
