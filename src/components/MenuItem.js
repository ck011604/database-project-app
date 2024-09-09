const MenuItem = ({ item, onSelect }) => {
  if (!item) {
    return null;
  }

  return (
    <div className="item-box" onClick={() => onSelect(item)}>
      <div className="item-name"> {item.name} </div>
      <div className="item-price"> {item.price} </div>
    </div>
  );
};

export default MenuItem;
