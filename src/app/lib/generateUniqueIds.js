const generateUniqueIds = (items) => {
  return items.map((item, index) => ({
    ...item,
    id: item.id || `id-${index}-${Math.random().toString(36).substr(2, 9)}`,
  }));
};

export default generateUniqueIds;
