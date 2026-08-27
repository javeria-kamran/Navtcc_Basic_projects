import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/CartSlice';

// Plant Data
const plantsData = {
  'Indoor Plants': [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 34.99,
      image: '/images/monstera.jpg',
      category: 'Indoor Plants',
    },
    {
      id: 2,
      name: 'Snake Plant',
      price: 24.99,
      image: '/images/snake-plant.jpg',
      category: 'Indoor Plants',
    },
    {
      id: 3,
      name: 'Peace Lily',
      price: 29.99,
      image: '/images/peace-lily.jpg',
      category: 'Indoor Plants',
    },
    {
      id: 4,
      name: 'Fiddle Leaf Fig',
      price: 49.99,
      image: '/images/fiddle-leaf.jpg',
      category: 'Indoor Plants',
    },
    {
      id: 5,
      name: 'Pothos',
      price: 19.99,
      image: '/images/pothos.jpg',
      category: 'Indoor Plants',
    },
    {
      id: 6,
      name: 'Spider Plant',
      price: 22.99,
      image: '/images/spider-plant.jpg',
      category: 'Indoor Plants',
    },
  ],
  'Succulents & Cacti': [
    {
      id: 7,
      name: 'Aloe Vera',
      price: 15.99,
      image: '/images/aloe-vera.jpg',
      category: 'Succulents & Cacti',
    },
    {
      id: 8,
      name: 'Jade Plant',
      price: 18.99,
      image: '/images/jade-plant.jpg',
      category: 'Succulents & Cacti',
    },
    {
      id: 9,
      name: 'Echeveria',
      price: 12.99,
      image: '/images/echeveria.jpg',
      category: 'Succulents & Cacti',
    },
    {
      id: 10,
      name: 'Barrel Cactus',
      price: 21.99,
      image: '/images/barrel-cactus.jpg',
      category: 'Succulents & Cacti',
    },
    {
      id: 11,
      name: 'String of Pearls',
      price: 16.99,
      image: '/images/string-of-pearls.jpg',
      category: 'Succulents & Cacti',
    },
    {
      id: 12,
      name: 'Pencil Cactus',
      price: 19.99,
      image: '/images/pencil-cactus.jpg',
      category: 'Succulents & Cacti',
    },
  ],
  'Flowering Plants': [
    {
      id: 13,
      name: 'Orchid',
      price: 39.99,
      image: '/images/orchid.jpg',
      category: 'Flowering Plants',
    },
    {
      id: 14,
      name: 'Anthurium',
      price: 32.99,
      image: '/images/anthurium.jpg',
      category: 'Flowering Plants',
    },
    {
      id: 15,
      name: 'African Violet',
      price: 14.99,
      image: '/images/african-violet.jpg',
      category: 'Flowering Plants',
    },
    {
      id: 16,
      name: 'Bromeliad',
      price: 28.99,
      image: '/images/bromeliad.jpg',
      category: 'Flowering Plants',
    },
    {
      id: 17,
      name: 'Kalanchoe',
      price: 17.99,
      image: '/images/kalanchoe.jpg',
      category: 'Flowering Plants',
    },
    {
      id: 18,
      name: 'Christmas Cactus',
      price: 23.99,
      image: '/images/christmas-cactus.jpg',
      category: 'Flowering Plants',
    },
  ],
};

const ProductList = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [addedItems, setAddedItems] = useState(new Set());

  const handleAddToCart = (plant) => {
    dispatch(addToCart(plant));
    setAddedItems((prev) => new Set(prev).add(plant.id));
  };

  const isItemInCart = (plantId) => {
    return cartItems.some((item) => item.id === plantId);
  };

  return (
    <div className="product-list-container">
      <h1 style={{ color: '#2d4a2d', marginBottom: '2rem' }}>
        🌿 Our Plant Collection
      </h1>

      {Object.entries(plantsData).map(([category, plants]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="products-grid">
            {plants.map((plant) => {
              const isAdded = addedItems.has(plant.id) || isItemInCart(plant.id);
              return (
                <div key={plant.id} className="product-card">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/250x200/4caf50/ffffff?text=🌿';
                    }}
                  />
                  <div className="product-info">
                    <h3 className="product-name">{plant.name}</h3>
                    <p className="product-price">${plant.price.toFixed(2)}</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(plant)}
                      disabled={isAdded}
                    >
                      {isAdded ? 'Added to Cart ✅' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
