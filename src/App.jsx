import { useState } from "react";


function App() {

  const [items, setItems] = useState([])

  function handleAddItems(item) {
    setItems((items) => [...items, item])
  }

  function handleDeleteItem(id) {
    setItems(items => items.filter(item => item.id !== id))
  }

  function handleToggle(id) {
    setItems(items => items.map(item => item.id === id ? { ...item, packed: !item.packed } : item))
  }

  function clearItems(){
    setItems([])
  }
  return (
    <div>
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList item={items} onDeleteItems={handleDeleteItem} onToggleItems={handleToggle} onClearList = {clearItems}/>
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return (
    <h1>🌴Far Away👜</h1>
  )

}
function Form({ onAddItems }) {

  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState(null)
  function handleSubmit(e) {
    e.preventDefault()
    if (!description) return
    // if(quantity<=0) return
    const newItem = { description, quantity, packed: false, id: Date.now() }
    onAddItems(newItem)
    setDescription("")
    setQuantity(null)
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      {/* <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select> */}

      <input type="number"  value={quantity} min="0" max="100" onChange={(e) => setQuantity(Number(e.target.value))} />
      <input type="text" placeholder="items..." value={description} onChange={(e) => setDescription(e.target.value)} />
      <button>ADD</button>
    </form>
  )

}
function PackingList({ item, onDeleteItems, onToggleItems,onClearList }) {
  const [sortBy, setSortBy] = useState("input")

  let sortedItems;
  if (sortBy === "input") sortedItems = item

  if (sortBy === "description") sortedItems = item.slice().sort((a, b) => a.description.localeCompare(b.description))

  if (sortBy === "packed") sortedItems = item.slice().sort((a, b) => Number(a.packed) - Number(b.packed))

  if (sortBy === "quantity") sortedItems = item.slice().sort((a, b) => Number(a.quantity) > Number(b.quantity) ? 1 : -1)


  return (
    <div className="list">
      <ul >
        {
          sortedItems.map(item => <Item item={item} key={item.id} onDeleteItems={onDeleteItems} onToggleItems={onToggleItems} />)
        }
      </ul>
      <div className="action">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by Input</option>
          <option value="description">Sort by Description</option>
          <option value="packed">Sort by packed status</option>
          <option value="quantity">Sort by packed quantity</option>
        </select>
        <button onClick={onClearList}>Clear List</button>
      </div>
    </div>
  )
}

function Item({ item, onDeleteItems, onToggleItems }) {
  return (
    <li>
      <input type="checkbox" value={item.packed} onChange={() => onToggleItems(item.id)} />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item.id)}>❌</button>
    </li>
  )
}
function Stats({ items }) {
  if (!items.length) {
    return (<footer className="stats">
      <em>
        Start packing items.
      </em>
    </footer>)
  }
  const numItem = items.length
  const packedItems = items.filter(item => item.packed).length
  const percentage = packedItems / numItem * 100
  return (
    <footer className="stats">
      <em>
        {percentage === 100 ? "You are ready to go" : `You have ${numItem} items on your list , and you already packed ${packedItems} (${percentage}%)`}

      </em>
    </footer>
  )
}
export default App;
