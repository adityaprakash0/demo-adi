export const formatDate = (value) => {
  if (!value) {
    return 'Not provided';
  }

  return new Date(value).toLocaleDateString();
};

