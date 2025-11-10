(() => {
  const TAX_RATE = 0.05;
  const menuGrid = document.getElementById("menu-grid");
  const menuSearch = document.getElementById("menu-search");
  const manageMenuBtn = document.getElementById("manage-menu-btn");
  const viewSalesBtn = document.getElementById("view-sales-btn");
  const payNowBtn = document.getElementById("pay-now-btn");
  const printBillBtn = document.getElementById("print-bill-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const cartItemsList = document.getElementById("cart-items");
  const cartEmptyState = document.getElementById("cart-empty-state");
  const subtotalAmount = document.getElementById("subtotal-amount");
  const taxAmount = document.getElementById("tax-amount");
  const totalAmount = document.getElementById("total-amount");

  const menuModal = document.getElementById("menu-modal");
  const salesModal = document.getElementById("sales-modal");
  const paymentModal = document.getElementById("payment-modal");

  const menuForm = document.getElementById("menu-modal")?.querySelector("form");
  const menuItemName = document.getElementById("menu-item-name");
  const menuItemPrice = document.getElementById("menu-item-price");
  const menuItemCategory = document.getElementById("menu-item-category");
  const menuItemImage = document.getElementById("menu-item-image");
  const saveMenuItemBtn = document.getElementById("save-menu-item-btn");
  const resetMenuFormBtn = document.getElementById("reset-menu-form-btn");
  const menuItemsList = document.getElementById("menu-items-list");

  const totalOrdersEl = document.getElementById("total-orders");
  const totalRevenueEl = document.getElementById("total-revenue");
  const averageTicketEl = document.getElementById("average-ticket");
  const exportSalesBtn = document.getElementById("export-sales-btn");
  const clearSalesBtn = document.getElementById("clear-sales-btn");
  const salesTableBody = document.querySelector("#sales-table tbody");

  const completePaymentBtn = document.createElement("button");
  completePaymentBtn.id = "complete-payment-btn";
  completePaymentBtn.type = "button";
  completePaymentBtn.className = "btn primary";
  completePaymentBtn.textContent = "Payment Received";

  const paymentModalDialog = paymentModal?.querySelector(".modal__dialog");
  if (paymentModalDialog && !paymentModalDialog.querySelector("#complete-payment-btn")) {
    const actionsWrapper = document.createElement("div");
    actionsWrapper.className = "modal__actions modal__actions--center";
    actionsWrapper.appendChild(completePaymentBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "btn ghost";
    cancelBtn.dataset.closeModal = "true";
    actionsWrapper.appendChild(cancelBtn);

    paymentModalDialog.appendChild(actionsWrapper);
  }

  const STORAGE_KEYS = {
    menu: "bakery:menu",
    cart: "bakery:cart",
    sales: "bakery:sales",
  };

  const storage = {
    available: (() => {
      try {
        const testKey = "__bakery_test__";
        window.localStorage.setItem(testKey, "ok");
        window.localStorage.removeItem(testKey);
        return true;
      } catch (error) {
        console.warn("LocalStorage unavailable, state will not persist.", error);
        return false;
      }
    })(),
    read(key, fallback) {
      const fallbackValue = resolveFallback(fallback);
      if (!this.available) return cloneValue(fallbackValue);
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return cloneValue(fallbackValue);
        return JSON.parse(raw);
      } catch (error) {
        console.warn(`Failed to read ${key} from storage`, error);
        return cloneValue(fallbackValue);
      }
    },
    write(key, value) {
      if (!this.available) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to write ${key} to storage`, error);
      }
    },
    remove(key) {
      if (!this.available) return;
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key} from storage`, error);
      }
    },
  };

  const BASE_MENU = [
    {
      name: "White Bread",
      price: 40,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Whole Wheat Bread",
      price: 45,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/571017/pexels-photo-571017.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Multigrain Bread",
      price: 55,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/590750/pexels-photo-590750.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Garlic Bread",
      price: 70,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Dinner Rolls",
      price: 60,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Brioche",
      price: 95,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/302680/pexels-photo-302680.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Focaccia",
      price: 110,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/4109999/pexels-photo-4109999.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Ciabatta",
      price: 100,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/6287528/pexels-photo-6287528.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Bagels",
      price: 85,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/4109971/pexels-photo-4109971.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Butter Croissant",
      price: 75,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Chocolate Croissant",
      price: 85,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Sandwich Loaf",
      price: 65,
      category: "Breads",
      image:
        "https://images.pexels.com/photos/1359327/pexels-photo-1359327.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Sponge Cake",
      price: 350,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/1998638/pexels-photo-1998638.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Butter Cake",
      price: 380,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/291433/pexels-photo-291433.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Pound Cake",
      price: 320,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/461060/pexels-photo-461060.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Fruit Cake",
      price: 420,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Chocolate Cake",
      price: 550,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/4109991/pexels-photo-4109991.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Black Forest Cake",
      price: 600,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/4110005/pexels-photo-4110005.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Red Velvet Cake",
      price: 620,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/821052/pexels-photo-821052.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Pineapple Cake",
      price: 480,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/263169/pexels-photo-263169.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Cheesecake",
      price: 650,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Cupcakes",
      price: 180,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/45202/pexels-photo-45202.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Assorted Muffins",
      price: 220,
      category: "Cakes",
      image:
        "https://images.pexels.com/photos/14105/pexels-photo-14105.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Butter Cookies",
      price: 160,
      category: "Cookies & Biscuits",
      image:
        "https://images.pexels.com/photos/896923/pexels-photo-896923.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Chocolate Chip Cookies",
      price: 180,
      category: "Cookies & Biscuits",
      image:
        "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Oatmeal Cookies",
      price: 170,
      category: "Cookies & Biscuits",
      image:
        "https://images.pexels.com/photos/4109994/pexels-photo-4109994.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Shortbread",
      price: 150,
      category: "Cookies & Biscuits",
      image:
        "https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Coconut Macaroons",
      price: 160,
      category: "Cookies & Biscuits",
      image:
        "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Nankhatai",
      price: 140,
      category: "Cookies & Biscuits",
      image:
        "https://images.pexels.com/photos/5946611/pexels-photo-5946611.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Digestive Biscuits",
      price: 130,
      category: "Cookies & Biscuits",
      image:
        "https://images.pexels.com/photos/4110118/pexels-photo-4110118.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Cream Pastries",
      price: 210,
      category: "Pastries & Puffs",
      image:
        "https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Danish Pastries",
      price: 230,
      category: "Pastries & Puffs",
      image:
        "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Eclairs",
      price: 180,
      category: "Pastries & Puffs",
      image:
        "https://images.pexels.com/photos/5946627/pexels-photo-5946627.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Apple Turnovers",
      price: 200,
      category: "Pastries & Puffs",
      image:
        "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Veg Puffs",
      price: 60,
      category: "Pastries & Puffs",
      image:
        "https://images.pexels.com/photos/4191613/pexels-photo-4191613.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Egg Puffs",
      price: 65,
      category: "Pastries & Puffs",
      image:
        "https://images.pexels.com/photos/4040293/pexels-photo-4040293.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Chicken Puffs",
      price: 75,
      category: "Pastries & Puffs",
      image:
        "https://images.pexels.com/photos/5419600/pexels-photo-5419600.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Paneer Puffs",
      price: 70,
      category: "Pastries & Puffs",
      image:
        "https://images.pexels.com/photos/1799126/pexels-photo-1799126.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Brownies",
      price: 220,
      category: "Desserts & Sweets",
      image:
        "https://images.pexels.com/photos/4109997/pexels-photo-4109997.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Donuts",
      price: 180,
      category: "Desserts & Sweets",
      image:
        "https://images.pexels.com/photos/1026126/pexels-photo-1026126.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Fruit Tarts",
      price: 240,
      category: "Desserts & Sweets",
      image:
        "https://images.pexels.com/photos/46174/sweet-cake-tart-raspberry-46174.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Chocolate Mousse Cups",
      price: 260,
      category: "Desserts & Sweets",
      image:
        "https://images.pexels.com/photos/141635/pexels-photo-141635.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Caramel Custard",
      price: 200,
      category: "Desserts & Sweets",
      image:
        "https://images.pexels.com/photos/4946697/pexels-photo-4946697.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Swiss Rolls",
      price: 210,
      category: "Desserts & Sweets",
      image:
        "https://images.pexels.com/photos/4109993/pexels-photo-4109993.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Jam Rolls",
      price: 190,
      category: "Desserts & Sweets",
      image:
        "https://images.pexels.com/photos/64208/pexels-photo-64208.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Veg Sandwich",
      price: 120,
      category: "Savory Items",
      image:
        "https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Egg Sandwich",
      price: 130,
      category: "Savory Items",
      image:
        "https://images.pexels.com/photos/551991/pexels-photo-551991.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Chicken Sandwich",
      price: 150,
      category: "Savory Items",
      image:
        "https://images.pexels.com/photos/660282/pexels-photo-660282.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Paneer Sandwich",
      price: 140,
      category: "Savory Items",
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Classic Burger",
      price: 170,
      category: "Savory Items",
      image:
        "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Hot Dog",
      price: 160,
      category: "Savory Items",
      image:
        "https://images.pexels.com/photos/750074/pexels-photo-750074.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Pizza Slice",
      price: 110,
      category: "Savory Items",
      image:
        "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Garlic Breadsticks",
      price: 90,
      category: "Savory Items",
      image:
        "https://images.pexels.com/photos/7889402/pexels-photo-7889402.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Masala Tea",
      price: 40,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Green Tea",
      price: 40,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Lemon Tea",
      price: 45,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/3323685/pexels-photo-3323685.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Black Coffee",
      price: 60,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/34085/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Cappuccino",
      price: 90,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/302901/pexels-photo-302901.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Cold Coffee",
      price: 100,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Chocolate Milkshake",
      price: 120,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/372917/pexels-photo-372917.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Strawberry Milkshake",
      price: 120,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/414555/pexels-photo-414555.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Vanilla Milkshake",
      price: 115,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/5931/food-milkshake-sweet-cold.jpg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Fresh Orange Juice",
      price: 100,
      category: "Beverages",
      image:
        "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Vegetable Patties",
      price: 55,
      category: "Others",
      image:
        "https://images.pexels.com/photos/1234537/pexels-photo-1234537.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Samosas",
      price: 50,
      category: "Others",
      image:
        "https://images.pexels.com/photos/5946616/pexels-photo-5946616.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Quiche",
      price: 180,
      category: "Others",
      image:
        "https://images.pexels.com/photos/5907970/pexels-photo-5907970.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Puff Pastry Snacks",
      price: 95,
      category: "Others",
      image:
        "https://images.pexels.com/photos/5665663/pexels-photo-5665663.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Bread Toast Packs",
      price: 65,
      category: "Others",
      image:
        "https://images.pexels.com/photos/461062/pexels-photo-461062.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const state = {
    menu: createSampleMenu(),
    cart: [],
    sales: [],
    editingItemId: null,
    menuFilter: "",
  };

  function createSampleMenu() {
    return BASE_MENU.map((item) => ({
      ...item,
      id: createId(),
    }));
  }

  function resolveFallback(fallback) {
    return typeof fallback === "function" ? fallback() : fallback;
  }

  function cloneValue(value) {
    if (value === null || typeof value !== "object") {
      return value;
    }
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      console.warn("Failed to clone value, returning original.", error);
      return value;
    }
  }

  function restoreStateFromStorage() {
    state.menu = storage.read(STORAGE_KEYS.menu, () => createSampleMenu());
    if (!Array.isArray(state.menu) || !state.menu.length) {
      state.menu = createSampleMenu();
      saveMenu();
    }
    state.cart = storage.read(STORAGE_KEYS.cart, []);
    if (!Array.isArray(state.cart)) {
      state.cart = [];
      saveCart();
    }
    state.sales = storage.read(STORAGE_KEYS.sales, []);
    if (!Array.isArray(state.sales)) {
      state.sales = [];
      saveSales();
    }
  }

  function saveMenu() {
    storage.write(STORAGE_KEYS.menu, state.menu);
  }

  function saveCart() {
    storage.write(STORAGE_KEYS.cart, state.cart);
  }

  function saveSales() {
    storage.write(STORAGE_KEYS.sales, state.sales);
  }

  restoreStateFromStorage();
  ensureSampleMenu();

  function createId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
  }

  function ensureSampleMenu() {
    const existingNames = new Set(
      state.menu.map((item) => item.name.trim().toLowerCase())
    );
    let updated = false;
    BASE_MENU.forEach((item) => {
      const key = item.name.trim().toLowerCase();
      if (!existingNames.has(key)) {
        state.menu.push({
          ...item,
          id: createId(),
        });
        updated = true;
      }
    });
    if (updated) {
      saveMenu();
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  }

  function bindEvents() {
    manageMenuBtn?.addEventListener("click", () => openMenuModal());
    viewSalesBtn?.addEventListener("click", () => openSalesModal());
    payNowBtn?.addEventListener("click", () => openPaymentModal());
    printBillBtn?.addEventListener("click", () => printBill());
    clearCartBtn?.addEventListener("click", () => clearCartWithConfirmation());
    menuSearch?.addEventListener("input", (event) =>
      handleMenuSearch(event.target.value || "")
    );

    menuForm?.addEventListener("submit", handleMenuFormSubmit);
    resetMenuFormBtn?.addEventListener("click", () => resetMenuForm());

    menuItemsList?.addEventListener("click", handleMenuListClick);
    cartItemsList?.addEventListener("click", handleCartClick);

    paymentModal
      ?.querySelectorAll("[data-close-modal]")
      .forEach((btn) =>
        btn.addEventListener("click", () => paymentModal.close())
      );

    menuModal
      ?.querySelectorAll("[data-close-modal]")
      .forEach((btn) => btn.addEventListener("click", () => menuModal.close()));

    salesModal
      ?.querySelectorAll("[data-close-modal]")
      .forEach((btn) => btn.addEventListener("click", () => salesModal.close()));

    completePaymentBtn.addEventListener("click", () => completePayment());

    exportSalesBtn?.addEventListener("click", () => exportSales());
    clearSalesBtn?.addEventListener("click", () => clearSalesHistory());
  }

  function openMenuModal() {
    if (!menuModal) return;
    resetMenuForm();
    renderMenuList();
    menuModal.showModal();
  }

  function openSalesModal() {
    if (!salesModal) return;
    renderSalesSummary();
    renderSalesTable();
    salesModal.showModal();
  }

  function openPaymentModal() {
    if (!paymentModal) return;
    if (!state.cart.length) {
      alert("Add items to the cart before initiating payment.");
      return;
    }
    paymentModal.showModal();
  }

  function handleMenuSearch(value) {
    state.menuFilter = value.toLowerCase();
    renderMenu();
  }

  function handleMenuFormSubmit(event) {
    event.preventDefault();
    const name = (menuItemName?.value || "").trim();
    const price = parseFloat(menuItemPrice?.value || "0");
    const category = (menuItemCategory?.value || "").trim();
    const image = (menuItemImage?.value || "").trim();

    if (!name || Number.isNaN(price) || price <= 0) {
      alert("Please provide a valid name and price for the item.");
      return;
    }

    const itemData = {
      id: state.editingItemId || createId(),
      name,
      price,
      category: category || "General",
      image:
        image ||
        "https://images.pexels.com/photos/45202/pexels-photo-45202.jpeg?auto=compress&cs=tinysrgb&w=400",
    };

    if (state.editingItemId) {
      const index = state.menu.findIndex((item) => item.id === state.editingItemId);
      if (index !== -1) {
        state.menu[index] = itemData;
      }
      const cartItem = state.cart.find((cartEntry) => cartEntry.id === itemData.id);
      if (cartItem) {
        cartItem.name = itemData.name;
        cartItem.price = itemData.price;
        saveCart();
      }
      alert("Menu item updated.");
    } else {
      state.menu.unshift(itemData);
      alert("Menu item added.");
    }

    state.editingItemId = null;
    saveMenu();
    resetMenuForm();
    renderMenu();
    renderMenuList();
  }

  function handleMenuListClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const listItem = target.closest(".modal__list-item");
    if (!listItem) return;
    const itemId = listItem.dataset.id;
    if (!itemId) return;

    if (target.dataset.action === "edit") {
      startEditingMenuItem(itemId);
    }
    if (target.dataset.action === "delete") {
      deleteMenuItem(itemId);
    }
  }

  function startEditingMenuItem(itemId) {
    const item = state.menu.find((entry) => entry.id === itemId);
    if (!item) return;
    state.editingItemId = itemId;
    if (menuItemName) menuItemName.value = item.name;
    if (menuItemPrice) menuItemPrice.value = String(item.price);
    if (menuItemCategory) menuItemCategory.value = item.category || "";
    if (menuItemImage) menuItemImage.value = item.image || "";
    if (saveMenuItemBtn) saveMenuItemBtn.textContent = "Update Item";
  }

  function deleteMenuItem(itemId) {
    const item = state.menu.find((entry) => entry.id === itemId);
    if (!item) return;
    const confirmed = confirm(`Delete ${item.name} from the menu?`);
    if (!confirmed) return;
    state.menu = state.menu.filter((entry) => entry.id !== itemId);
    state.cart = state.cart.filter((cartItem) => cartItem.id !== itemId);
    saveMenu();
    saveCart();
    renderMenu();
    renderMenuList();
    renderCart();
  }

  function resetMenuForm() {
    menuForm?.reset();
    state.editingItemId = null;
    if (saveMenuItemBtn) saveMenuItemBtn.textContent = "Save Item";
  }

  function renderMenu() {
    if (!menuGrid) return;
    menuGrid.innerHTML = "";
    const filtered = state.menu.filter((item) => {
      if (!state.menuFilter) return true;
      const haystack = `${item.name} ${item.category}`.toLowerCase();
      return haystack.includes(state.menuFilter);
    });

    if (!filtered.length) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "menu__empty-state";
      emptyMsg.textContent = "No items match your search. Try adjusting the query.";
      menuGrid.appendChild(emptyMsg);
      return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach((item) => {
      const card = document.createElement("article");
      card.className = "menu-card";
      card.dataset.id = item.id;
      card.innerHTML = `
        <img class="menu-card__image" src="${item.image}" alt="${item.name}" />
        <div class="menu-card__body">
          <div class="menu-card__category">${item.category || "General"}</div>
          <div class="menu-card__title">${item.name}</div>
          <div class="menu-card__price">${formatCurrency(item.price)}</div>
        </div>
      `;
      card.addEventListener("click", () => addItemToCart(item.id));
      fragment.appendChild(card);
    });

    menuGrid.appendChild(fragment);
  }

  function renderMenuList() {
    if (!menuItemsList) return;
    menuItemsList.innerHTML = "";
    if (!state.menu.length) {
      const empty = document.createElement("li");
      empty.textContent = "Menu is empty. Add a new item using the form.";
      menuItemsList.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    state.menu.forEach((item) => {
      const li = document.createElement("li");
      li.className = "modal__list-item";
      li.dataset.id = item.id;
      li.innerHTML = `
        <span>
          <strong>${item.name}</strong>
          <small>${formatCurrency(item.price)} • ${item.category || "General"}</small>
        </span>
        <div class="modal__list-buttons">
          <button type="button" data-action="edit">Edit</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      `;
      fragment.appendChild(li);
    });

    menuItemsList.appendChild(fragment);
  }

  function addItemToCart(itemId) {
    const menuItem = state.menu.find((item) => item.id === itemId);
    if (!menuItem) return;
    const existing = state.cart.find((entry) => entry.id === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
      });
    }
    saveCart();
    renderCart();
  }

  function handleCartClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const listItem = target.closest(".billing__item");
    if (!listItem) return;
    const itemId = listItem.dataset.id;
    if (!itemId) return;

    if (target.dataset.action === "increment") {
      updateCartItemQuantity(itemId, 1);
    }
    if (target.dataset.action === "decrement") {
      updateCartItemQuantity(itemId, -1);
    }
    if (target.dataset.action === "remove") {
      removeCartItem(itemId);
    }
  }

  function updateCartItemQuantity(itemId, delta) {
    const item = state.cart.find((entry) => entry.id === itemId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter((entry) => entry.id !== itemId);
    }
    saveCart();
    renderCart();
  }

  function removeCartItem(itemId) {
    state.cart = state.cart.filter((entry) => entry.id !== itemId);
    saveCart();
    renderCart();
  }

  function renderCart() {
    if (!cartItemsList || !cartEmptyState) return;
    cartItemsList.innerHTML = "";
    if (!state.cart.length) {
      cartEmptyState.hidden = false;
    } else {
      cartEmptyState.hidden = true;
      const fragment = document.createDocumentFragment();
      state.cart.forEach((item) => {
        const li = document.createElement("li");
        li.className = "billing__item";
        li.dataset.id = item.id;
        const lineTotal = item.price * item.quantity;
        li.innerHTML = `
          <div>
            <div class="billing__item-title">${item.name}</div>
            <div class="billing__item-meta">${formatCurrency(item.price)} × ${
          item.quantity
        }</div>
          </div>
          <div class="billing__item-controls">
            <strong>${formatCurrency(lineTotal)}</strong>
            <div class="billing__item-actions">
              <button type="button" data-action="decrement">−</button>
              <button type="button" data-action="increment">+</button>
              <button type="button" data-action="remove">×</button>
            </div>
          </div>
        `;
        fragment.appendChild(li);
      });
      cartItemsList.appendChild(fragment);
    }

    updateBillingSummary();
  }

  function calculateTotals() {
    const subtotal = state.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }

  function updateBillingSummary() {
    const { subtotal, tax, total } = calculateTotals();
    if (subtotalAmount) subtotalAmount.textContent = formatCurrency(subtotal);
    if (taxAmount) taxAmount.textContent = formatCurrency(tax);
    if (totalAmount) totalAmount.textContent = formatCurrency(total);
  }

  function clearCartWithConfirmation() {
    if (!state.cart.length) return;
    const confirmed = confirm("Clear all items from the cart?");
    if (!confirmed) return;
    clearCart();
  }

  function clearCart() {
    state.cart = [];
    saveCart();
    renderCart();
  }

  function completePayment() {
    if (!state.cart.length) {
      alert("Cart is empty. Add items before completing payment.");
      return;
    }

    const totals = calculateTotals();
    const saleRecord = {
      id: createId(),
      timestamp: new Date().toISOString(),
      items: state.cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
    };
    state.sales.unshift(saleRecord);
    saveSales();
    renderSalesSummary();
    renderSalesTable();
    paymentModal?.close();
    alert("Payment recorded. Cart cleared.");
    clearCart();
  }

  function renderSalesSummary() {
    if (!state.sales.length) {
      totalOrdersEl && (totalOrdersEl.textContent = "0");
      totalRevenueEl && (totalRevenueEl.textContent = formatCurrency(0));
      averageTicketEl && (averageTicketEl.textContent = formatCurrency(0));
      return;
    }
    const totalOrders = state.sales.length;
    const revenue = state.sales.reduce((sum, sale) => sum + sale.total, 0);
    const average = revenue / totalOrders;
    if (totalOrdersEl) totalOrdersEl.textContent = String(totalOrders);
    if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(revenue);
    if (averageTicketEl) averageTicketEl.textContent = formatCurrency(average);
  }

  function renderSalesTable() {
    if (!salesTableBody) return;
    salesTableBody.innerHTML = "";
    if (!state.sales.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.textContent = "No sales recorded yet.";
      row.appendChild(cell);
      salesTableBody.appendChild(row);
      return;
    }

    const fragment = document.createDocumentFragment();
    state.sales.forEach((sale, index) => {
      const row = document.createElement("tr");
      const itemsSummary = sale.items
        .map((item) => `${item.quantity}× ${item.name}`)
        .join(", ");
      const date = new Date(sale.timestamp);
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${date.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}</td>
        <td>${itemsSummary}</td>
        <td>${formatCurrency(sale.total)}</td>
      `;
      fragment.appendChild(row);
    });
    salesTableBody.appendChild(fragment);
  }

  function exportSales() {
    if (!state.sales.length) {
      alert("No sales to export yet.");
      return;
    }
    const headers = ["Order#", "Date", "Items", "Subtotal", "Tax", "Total"];
    const rows = state.sales.map((sale, index) => {
      const date = new Date(sale.timestamp).toLocaleString("en-IN");
      const items = sale.items
        .map((item) => `${item.quantity}x ${item.name}`)
        .join("; ");
      return [
        index + 1,
        date,
        items,
        sale.subtotal.toFixed(2),
        sale.tax.toFixed(2),
        sale.total.toFixed(2),
      ];
    });
    const csvContent = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bakery-sales-${Date.now()}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  }

  function csvEscape(value) {
    const stringValue = String(value ?? "");
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  function clearSalesHistory() {
    if (!state.sales.length) return;
    const confirmed = confirm(
      "Clear the entire sales history? This action cannot be undone."
    );
    if (!confirmed) return;
    state.sales = [];
    saveSales();
    renderSalesSummary();
    renderSalesTable();
  }

  function printBill() {
    if (!state.cart.length) {
      alert("Add items to the cart before printing a bill.");
      return;
    }
    const { subtotal, tax, total } = calculateTotals();
    const billWindow = window.open("", "PRINT", "width=540,height=720");
    if (!billWindow) {
      alert("Popup blocked. Allow popups to print the bill.");
      return;
    }

    const itemsMarkup = state.cart
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(item.price * item.quantity)}</td>
        </tr>
      `
      )
      .join("");

    billWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Bakery Bangalore Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #2f2a26; }
            h1 { text-align: center; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            th, td { border: 1px solid #c7b299; padding: 8px; text-align: left; font-size: 14px; }
            tfoot td { font-weight: 600; }
            .totals { margin-top: 16px; float: right; width: 240px; }
            .totals div { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .totals div:last-child { font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>Bakery Bangalore</h1>
          <p>Date: ${new Date().toLocaleString("en-IN")}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsMarkup}
            </tbody>
          </table>
          <div class="totals">
            <div><span>Subtotal:</span><span>${formatCurrency(subtotal)}</span></div>
            <div><span>Tax (${(TAX_RATE * 100).toFixed(0)}%):</span><span>${formatCurrency(
      tax
    )}</span></div>
            <div><span>Grand Total:</span><span>${formatCurrency(total)}</span></div>
          </div>
          <p style="margin-top: 40px; text-align: center;">Thank you for shopping with us!</p>
        </body>
      </html>
    `);

    billWindow.document.close();
    billWindow.focus();
    billWindow.print();
  }

  function init() {
    bindEvents();
    renderMenu();
    renderCart();
    renderSalesSummary();
    renderSalesTable();
  }

  init();
})();

