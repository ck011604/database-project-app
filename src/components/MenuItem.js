import "../css/MenuItem.css"

const MenuItem = ({ item, onSelect }) => {
  if (!item) {
    return null;
  }

  return (
    <div className="item-box" onClick={() => onSelect(item)}>
      <img src={`/menu_images/${item.image}`} alt={item.name} className="item-image" />
      <div className="item-name"> {item.name} </div>
      <div className="item-price"> ${item.price} </div>
    </div>
  );
};

export default MenuItem;
