<script lang="ts">
  import { cart } from '$lib/stores/cart';
  import type { CartItem } from '$lib/stores/cart';
  import { derived } from 'svelte/store';

  type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
  };

  const products: Product[] = [
    { id: '1', name: 'Watercolor Set', price: 499, image: '/images/watercolor.jpg', description: 'Portable watercolor set for beginners and pros.' },
    { id: '2', name: 'Paint Brushes', price: 249, image: '/images/brushes.jpg', description: 'High-quality brushes for acrylic and oil painting.' },
    { id: '3', name: 'Canvas Board', price: 299, image: '/images/canvas.jpg', description: 'Premium canvas board for painting projects.' },
    { id: '4', name: 'Sketch Pad', price: 199, image: '/images/sketchpad.jpg', description: 'Acid-free sketch pad for dry media.' },
    { id: '5', name: 'Acrylic Paint Set', price: 899, image: '/images/acrylic.jpg', description: 'Vibrant acrylics for mixed media artwork.' },
    { id: '6', name: 'Charcoal Sticks', price: 150, image: '/images/charcoal.jpg', description: 'Professional charcoal for expressive drawing.' },
    { id: '7', name: 'Kneaded Eraser', price: 99, image: '/images/eraser.jpg', description: 'Moldable eraser for graphite and charcoal.' },
    { id: '8', name: 'Round Brush Set', price: 350, image: '/images/roundbrush.jpg', description: 'Fine brushes for watercolor and gouache.' },
    { id: '9', name: 'Strathmore Paper', price: 399, image: '/images/strathmore.jpg', description: 'Heavyweight paper for professional results.' },
    { id: '10', name: 'Oil Paint Starter Kit', price: 1200, image: '/images/oilpaint.jpg', description: 'Complete set of oil paints for beginners.' },
    { id: '11', name: 'Palette Knives', price: 299, image: '/images/paletteknives.jpg', description: 'Durable palette knives for mixing and texturing paint.' },
    { id: '12', name: 'Easel Stand', price: 1500, image: '/images/easel.jpg', description: 'Adjustable wooden easel for studio and outdoor painting.' },
    { id: '13', name: 'Gouache Paint Set', price: 799, image: '/images/gouache.jpg', description: 'Opaque gouache paints for vibrant illustrations.' },
    { id: '14', name: 'Ink Pen Set', price: 450, image: '/images/inkpens.jpg', description: 'Fine ink pens for line art and calligraphy.' },
    { id: '15', name: 'Pastel Colors', price: 600, image: '/images/pastels.jpg', description: 'Soft pastels for blending and shading.' }
  ];

  type Page = 'home' | 'checkout' | 'confirm' | 'logout';
  let currentPage: Page = 'home';

  let searchQuery = '';
  $: filteredProducts = products.filter((p: Product) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let quantities: Record<string, number> = {};

  function addToCartWithQuantity(product: Product) {
    const qty = quantities[product.id] || 1;
    cart.update((items: CartItem[]) => {
      const existing = items.find((i: CartItem) => i.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        items.push({ ...product, qty });
      }
      return [...items];
    });
    quantities[product.id] = 1;
  }

  function removeFromCart(id: string) {
    cart.update((items: CartItem[]) => items.filter((i: CartItem) => i.id !== id));
  }

  const total = derived(cart, ($cart: CartItem[]) =>
    $cart.reduce((sum: number, item: CartItem) => sum + item.price * item.qty, 0)
  );
</script>

<div class="flex min-h-screen w-full">
  <!-- Sidebar -->
  <aside class="w-64 bg-gradient-to-b from-purple-700 via-pink-600 to-indigo-600 text-white flex flex-col shadow-lg fixed h-screen">
    <div class="text-2xl font-bold p-6 text-center tracking-wide">ARTVENTORY</div>

    <!-- Search bar -->
    <div class="px-4 mb-4">
      <input
        type="text"
        placeholder="🔍 Search products..."
        bind:value={searchQuery}
        class="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>

    <nav class="flex-1 px-4 space-y-4">
      <a href="/kiosk" on:click={() => currentPage = 'home'}
        class="w-full block px-4 py-3 rounded-xl shadow-md font-semibold transition flex items-center gap-2
               bg-white text-gray-900 hover:shadow-lg
               {currentPage === 'home' ? 'border-l-4 border-yellow-400 bg-yellow-100 text-blue-600 animate-slideIn' : ''}">
        🏠 Home
      </a>
      <a href="/kiosk/checkout" on:click={() => currentPage = 'checkout'}
        class="w-full block px-4 py-3 rounded-xl shadow-md font-semibold transition flex items-center gap-2
               bg-white text-gray-900 hover:shadow-lg
               {currentPage === 'checkout' ? 'border-l-4 border-yellow-400 bg-yellow-100 text-blue-600 animate-slideIn' : ''}">
        💳 Checkout
      </a>
      <a href="/kiosk/confirm" on:click={() => currentPage = 'confirm'}
        class="w-full block px-4 py-3 rounded-xl shadow-md font-semibold transition flex items-center gap-2
               bg-white text-gray-900 hover:shadow-lg
               {currentPage === 'confirm' ? 'border-l-4 border-yellow-400 bg-yellow-100 text-blue-600 animate-slideIn' : ''}">
        ✅ Confirm
      </a>
      <a href="/login" on:click={() => currentPage = 'logout'}
        class="w-full block px-4 py-3 rounded-xl shadow-md font-semibold transition flex items-center gap-2
               bg-white text-gray-900 hover:shadow-lg
               {currentPage === 'logout' ? 'border-l-4 border-yellow-400 bg-yellow-100 text-blue-600 animate-slideIn' : ''}">
        🚪 Logout
      </a>
    </nav>
  </aside>

  <!-- Main Content + Cart -->
  <main class="flex-1 ml-64 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-8 min-h-screen overflow-y-auto flex gap-6">
    <!-- Products -->
    <div class="flex-1">
      <h1 class="text-3xl font-extrabold text-white mb-6">🎨 Welcome to Artventory Kiosk</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {#each filteredProducts as product, index (product.id)}
          <div class="bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out"
               style="animation: fadeIn 0.5s ease-out forwards; animation-delay: {index * 100}ms">
            <img src={product.image} alt={product.name} class="w-full h-40 object-cover rounded mb-3" />
            <h3 class="text-lg font-bold mt-2 text-gray-900">{product.name}</h3>
            <p class="text-sm text-gray-600 mt-2">{product.description}</p>
            <div class="flex justify-between items-center mt-4 gap-2">
              <span class="font-bold text-lg text-pink-600">₱{product.price}</span>
              <input type="number" min="1" bind:value={quantities[product.id]} class="w-16 border rounded px-2 py-1 text-center" placeholder="1" />
              <button class="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded-full 
                             hover:scale-105 active:scale-95 transition-transform duration-200 ease-in-out"
                                            on:click={() => addToCartWithQuantity(product)}>
                Add
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Cart Sidebar -->
    <div class="w-80 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-8 self-start">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">🛒 Cart</h2>
      {#if $cart.length === 0}
        <p class="text-gray-500 text-sm">No items yet.</p>
      {:else}
        <ul class="space-y-2">
          {#each $cart as item (item.id)}
            <li class="flex justify-between items-center border-b pb-2">
              <div>
                <p class="font-medium">{item.name}</p>
                <p class="text-xs text-gray-500">₱{item.price} × {item.qty}</p>
              </div>
              <button
                on:click={() => removeFromCart(item.id)}
                class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">
                ✕
              </button>
            </li>
          {/each}
        </ul>
        <div class="mt-4 border-t pt-2">
          <p class="font-semibold">Total: ₱{$total}</p>
        </div>

        <!-- Checkout button -->
        <div class="mt-4">
          <a
            href="/kiosk/checkout"
            on:click={() => currentPage = 'checkout'}
            class="w-full block text-center px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            💳 Proceed to Checkout
          </a>
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  /* Inline animations so you don’t need tailwind.config.js */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { transform: translateX(-5px); opacity: 0.8; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
</style>
