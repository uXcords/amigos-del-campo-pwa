import { useState } from "react";
import "./App.css";
import logo from "./assets/logo/logo-amigos-del-campo-png.jpg";

// ======================================================
// CARGAR TODAS LAS IMÁGENES
// ======================================================

const fruitImages = import.meta.glob(
  "./assets/frutas/*.{jpg,jpeg,png,JPG,JPEG,PNG}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

// ======================================================
// NORMALIZAR NOMBRES
// ======================================================

const normalizeName = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.(jpg|jpeg|png)$/i, "")
    .replace(/[^a-z0-9_]/g, "");
};

// ======================================================
// OBTENER TODAS LAS FOTOS DE UNA FRUTA
// ======================================================

const getFruitImages = (fruitName, imageName = null) => {
  const targetName = normalizeName(
    imageName || fruitName
  );

  const matches = Object.entries(fruitImages)
    .filter(([path]) => {
      const fileName = path.split("/").pop();

      const normalizedFileName =
        normalizeName(fileName);

      return (
        normalizedFileName === targetName ||
        normalizedFileName.startsWith(
          `${targetName}_`
        )
      );
    })
    .map(([path, imageUrl]) => ({
      path,
      imageUrl,
      fileName: path.split("/").pop(),
    }));

  // ====================================================
  // ORDENAR FOTOS
  // ====================================================

  matches.sort((a, b) => {
    const numberA = parseInt(
      a.fileName.match(/_(\d+)\./)?.[1] || "0"
    );

    const numberB = parseInt(
      b.fileName.match(/_(\d+)\./)?.[1] || "0"
    );

    return numberA - numberB;
  });

  return matches.map(
    (item) => item.imageUrl
  );
};

// ======================================================
// PRODUCTOS
// ======================================================

const products = [
  {
    id: 1,
    name: "Aguaymanto",
    category: "Frutas",
  },
  {
    id: 2,
    name: "Carambola",
    category: "Frutas",
  },
  {
    id: 3,
    name: "Chirimoya",
    category: "Frutas",
  },
  {
    id: 4,
    name: "Granada",
    category: "Frutas",
  },
  {
    id: 5,
    name: "Granadilla",
    category: "Frutas",
  },
  {
    id: 6,
    name: "Mango",
    category: "Frutas",
  },
  {
    id: 7,
    name: "Piña",
    category: "Frutas",
  },
  {
    id: 8,
    name: "Plátano",
    category: "Frutas",
  },
  {
    id: 9,
    name: "Sandía",
    category: "Frutas",
  },
  {
    id: 10,
    name: "Palta",
    category: "Frutas",
  },
  {
    id: 11,
    name: "Lúcuma",
    category: "Frutas",
  },
  {
    id: 12,
    name: "Naranja",
    category: "Frutas",
  },
  {
    id: 13,
    name: "Fresa",
    imageName: "fresas",
    category: "Frutas",
  },
  {
    id: 14,
    name: "Uva Verde",
    imageName: "uva_verde",
    category: "Frutas",
  },
  {
    id: 15,
    name: "Uva Morada",
    imageName: "uva_morada",
    category: "Frutas",
  },
  {
    id: 16,
    name: "Durazno",
    category: "Frutas",
  },
  {
    id: 17,
    name: "Kiwi",
    category: "Frutas",
  },
  {
    id: 18,
    name: "Mandarina",
    category: "Frutas",
  },
  {
    id: 19,
    name: "Pepino",
    category: "Frutas",
  },
  {
    id: 20,
    name: "Tuna",
    category: "Frutas",
  },
  {
    id: 21,
    name: "Pitahaya",
    category: "Frutas",
  },
  {
    id: 22,
    name: "Aguaymanto",
    category: "Frutas",
    imageNumber: 2,
  },
];

// ======================================================
// APP
// ======================================================

function App() {
  const [search, setSearch] = useState("");

  // ====================================================
  // CARRITO
  // ====================================================

  const [cartItems, setCartItems] = useState([]);

  // ====================================================
  // ABRIR / CERRAR CARRITO
  // ====================================================

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // ====================================================
  // CATEGORÍA
  // ====================================================

  const [activeCategory, setActiveCategory] =
    useState("Frutas");

  // ====================================================
  // ESTADO DEL CARRUSEL
  // ====================================================

  const [carouselIndexes, setCarouselIndexes] =
    useState({});

  // ====================================================
  // CAMBIAR IMAGEN
  // ====================================================

  const changeImage = (
    productId,
    direction,
    total
  ) => {
    setCarouselIndexes((current) => {
      const currentIndex =
        current[productId] || 0;

      let newIndex =
        currentIndex + direction;

      if (newIndex < 0) {
        newIndex = total - 1;
      }

      if (newIndex >= total) {
        newIndex = 0;
      }

      return {
        ...current,
        [productId]: newIndex,
      };
    });
  };

  // ====================================================
  // SELECCIONAR IMAGEN
  // ====================================================

  const selectImage = (
    productId,
    index
  ) => {
    setCarouselIndexes((current) => ({
      ...current,
      [productId]: index,
    }));
  };

  // ====================================================
  // FILTRAR PRODUCTOS
  // ====================================================

  const filteredProducts = products.filter(
    (product) => {
      const productName = product.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const searchText = search
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const matchesSearch =
        productName.includes(searchText);

      const matchesCategory =
        activeCategory === "Todas" ||
        activeCategory === product.category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // ====================================================
  // AGREGAR AL CARRITO
  // ====================================================

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const alreadyExists =
        currentItems.some(
          (item) => item.id === product.id
        );

      if (alreadyExists) {
        return currentItems;
      }

      return [
        ...currentItems,
        product,
      ];
    });
  };

  // ====================================================
  // ELIMINAR DEL CARRITO
  // ====================================================

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );
  };

  // ====================================================
  // VERIFICAR SI ESTÁ EN CARRITO
  // ====================================================

  const isInCart = (productId) => {
    return cartItems.some(
      (item) => item.id === productId
    );
  };

  // ====================================================
  // ENVIAR CANASTA POR WHATSAPP
  // ====================================================

  const sendToWhatsApp = () => {
    if (cartItems.length === 0) {
      return;
    }

    const phoneNumber =
      "51954751553";

    const productList = cartItems
      .map(
        (product, index) =>
          `${index + 1}. ${product.name}`
      )
      .join("\n");

    const message =
      `Hola, Amigos del Campo 👋🌱\n\n` +
      `Quiero consultar por los siguientes productos:\n\n` +
      `${productList}\n\n` +
      `Total de productos: ${cartItems.length}\n\n` +
      `¿Me pueden indicar disponibilidad y precio?`;

    const whatsappUrl =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ====================================================
  // CATEGORÍAS
  // ====================================================

  const categories = [
    {
      name: "Frutas",
      icon: "🍎",
    },
    {
      name: "Verduras",
      icon: "🥬",
    },
  ];

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="app">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="header">

        <div className="brand">

          <img
            src={logo}
            alt="Amigos del Campo"
            className="logo"
          />

          <div className="brand-text">

            <h1>
              Amigos del Campo
            </h1>

            <span>
              Lo fresco de nuestra tierra
            </span>

          </div>

        </div>

        <button
          className="cart-button"
          aria-label="Abrir carrito"
          onClick={() =>
            setIsCartOpen(true)
          }
        >

          🛒

          {cartItems.length > 0 && (
            <span className="cart-badge">
              {cartItems.length}
            </span>
          )}

        </button>

      </header>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-tag">
            🌱 FRESCURA NATURAL
          </span>

          <h2>
            Lo fresco de nuestra tierra,
            <strong>
              {" "}para tu hogar.
            </strong>
          </h2>

          <p>
            Frutas y verduras seleccionadas
            directamente del campo.
          </p>

          <button
            className="hero-button"
            onClick={() => {
              document
                .querySelector(
                  ".products-section"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Ver productos →
          </button>

        </div>

      </section>

      {/* ==================================================
          BUSCADOR
      ================================================== */}

      <section className="search-section">

        <div className="search-box">

          <span>
            🔎
          </span>

          <input
            type="text"
            placeholder="¿Qué fruta estás buscando?"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              className="clear-search"
              onClick={() =>
                setSearch("")
              }
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}

        </div>

      </section>

      {/* ==================================================
          CATEGORÍAS
      ================================================== */}

      <section className="section">

        <div className="section-title">

          <h2>
            Categorías
          </h2>

          <button
            onClick={() => {
              setActiveCategory("Todas");
              setSearch("");
            }}
          >
            Ver todas
          </button>

        </div>

        <div className="categories">

          {categories.map(
            (category) => (

              <button
                key={category.name}
                className={`category ${
                  activeCategory ===
                  category.name
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setActiveCategory(
                    category.name
                  );

                  setSearch("");
                }}
              >

                <div>
                  {category.icon}
                </div>

                <span>
                  {category.name}
                </span>

              </button>

            )
          )}

        </div>

      </section>

      {/* ==================================================
          PRODUCTOS
      ================================================== */}

      <section
        className="section products-section"
      >

        <div className="section-title">

          <div>

            <span className="small-title">
              SELECCIÓN DEL CAMPO
            </span>

            <h2>
              Productos frescos
            </h2>

          </div>

          <button
            onClick={() => {
              setActiveCategory("Todas");
              setSearch("");
            }}
          >
            Ver todos
          </button>

        </div>

        <div className="products">

          {filteredProducts.length > 0 ? (

            filteredProducts.map(
              (product) => {

                let images =
                  getFruitImages(
                    product.name,
                    product.imageName
                  );

                // ==========================================
                // AGUAYMANTO #22
                // ==========================================

                if (
                  product.id === 22 &&
                  images.length > 1
                ) {
                  images = [
                    images[1],
                    ...images.filter(
                      (_, index) =>
                        index !== 1
                    ),
                  ];
                }

                const totalImages =
                  images.length;

                const currentIndex =
                  carouselIndexes[
                    product.id
                  ] || 0;

                const currentImage =
                  images[currentIndex];

                const selected =
                  isInCart(product.id);

                return (

                  <article
                    className={`product-card ${
                      selected
                        ? "product-selected"
                        : ""
                    }`}
                    key={product.id}
                  >

                    <div className="product-image">

                      <span className="fresh-label">
                        Fresco
                      </span>

                      {currentImage ? (

                        <>

                          <img
                            src={currentImage}
                            alt={
                              product.name
                            }
                            className="fruit-image"
                          />

                          {totalImages > 1 && (

                            <button
                              className="carousel-arrow carousel-arrow-left"
                              onClick={() =>
                                changeImage(
                                  product.id,
                                  -1,
                                  totalImages
                                )
                              }
                              aria-label="Imagen anterior"
                            >
                              ‹
                            </button>

                          )}

                          {totalImages > 1 && (

                            <button
                              className="carousel-arrow carousel-arrow-right"
                              onClick={() =>
                                changeImage(
                                  product.id,
                                  1,
                                  totalImages
                                )
                              }
                              aria-label="Imagen siguiente"
                            >
                              ›
                            </button>

                          )}

                          {totalImages > 1 && (

                            <div className="carousel-dots">

                              {images.map(
                                (_, index) => (

                                  <button
                                    key={index}
                                    className={`carousel-dot ${
                                      index ===
                                      currentIndex
                                        ? "active"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      selectImage(
                                        product.id,
                                        index
                                      )
                                    }
                                    aria-label={`Ver imagen ${
                                      index + 1
                                    }`}
                                  />

                                )
                              )}

                            </div>

                          )}

                        </>

                      ) : (

                        <div className="image-placeholder">
                          🍃
                        </div>

                      )}

                    </div>

                    <div className="product-info">

                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <div className="product-bottom">

                        <span className="availability">

                          {selected
                            ? "Seleccionado"
                            : "Disponible"}

                        </span>

                        <button
                          className={`add-button ${
                            selected
                              ? "added"
                              : ""
                          }`}
                          onClick={() =>
                            addToCart(product)
                          }
                          aria-label={`Agregar ${product.name}`}
                        >

                          {selected
                            ? "✓"
                            : "+"}

                        </button>

                      </div>

                    </div>

                  </article>

                );
              }
            )

          ) : (

            <div className="no-results">

              <span>
                🍃
              </span>

              <h3>
                No encontramos ese producto
              </h3>

              <p>
                Prueba buscando otra fruta
                o verdura.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory(
                    "Frutas"
                  );
                }}
              >
                Ver productos
              </button>

            </div>

          )}

        </div>

      </section>

      {/* ==================================================
          PROMOCIÓN
      ================================================== */}

      <section
        className="promotion"
        onClick={() =>
          setIsCartOpen(true)
        }
      >

        <div className="promotion-icon">
          🧺
        </div>

        <div>

          <span>
            PARA TU HOGAR
          </span>

          <h3>
            Arma tu canasta
          </h3>

          <p>
            Elige tus productos favoritos.
          </p>

        </div>

        <button>
          →
        </button>

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="footer">

        <img
          src={logo}
          alt="Amigos del Campo"
        />

        <h3>
          Amigos del Campo
        </h3>

        <p>
          Lo fresco de nuestra tierra
          para tu hogar.
        </p>

        <div className="footer-links">

          <span>
            Inicio
          </span>

          <span>
            Productos
          </span>

          <span>
            Nosotros
          </span>

          <span>
            Contacto
          </span>

        </div>

        <small>
          © 2026 Amigos del Campo
        </small>

        <div className="developer-signature">
          uX_Xe
        </div>

      </footer>

      {/* ==================================================
          NAVEGACIÓN MÓVIL
      ================================================== */}

      <nav className="bottom-nav">

        <button className="nav-item active">

          <span>
            🏠
          </span>

          <small>
            Inicio
          </small>

        </button>

        <button
          className="nav-item"
          onClick={() => {
            document
              .querySelector(
                ".products-section"
              )
              ?.scrollIntoView({
                behavior: "smooth",
              });
          }}
        >

          <span>
            🍎
          </span>

          <small>
            Productos
          </small>

        </button>

        <button
          className="nav-item"
          onClick={() =>
            setIsCartOpen(true)
          }
        >

          <span>
            🛒
          </span>

          <small>
            Carrito
          </small>

          {cartItems.length > 0 && (
            <b>
              {cartItems.length}
            </b>
          )}

        </button>

        <button className="nav-item">

          <span>
            👤
          </span>

          <small>
            Perfil
          </small>

        </button>

      </nav>

      {/* ==================================================
          MODAL DEL CARRITO
      ================================================== */}

      {isCartOpen && (

        <div
          className="cart-overlay"
          onClick={() =>
            setIsCartOpen(false)
          }
        >

          <div
            className="cart-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==========================================
                CABECERA
            ========================================== */}

            <div className="cart-modal-header">

              <div>

                <span className="cart-small-title">
                  🧺 TU CANASTA
                </span>

                <h2>
                  Productos seleccionados
                </h2>

              </div>

              <button
                className="cart-close"
                onClick={() =>
                  setIsCartOpen(false)
                }
                aria-label="Cerrar carrito"
              >
                ✕
              </button>

            </div>

            {/* ==========================================
                CONTENIDO
            ========================================== */}

            <div className="cart-content">

              {cartItems.length > 0 ? (

                <>

                  <div className="cart-summary">

                    <div>
                      <span className="cart-summary-label">
                        Productos seleccionados
                      </span>
                    </div>

                    <strong className="cart-summary-count">
                      {cartItems.length}
                    </strong>

                  </div>

                  {/* ====================================
                      PRODUCTOS
                  ==================================== */}

                  <div className="cart-products">

                    {cartItems.map(
                      (product) => {

                        let images =
                          getFruitImages(
                            product.name,
                            product.imageName
                          );

                        // =================================
                        // AGUAYMANTO #22
                        // =================================

                        if (
                          product.id === 22 &&
                          images.length > 1
                        ) {
                          images = [
                            images[1],
                            ...images.filter(
                              (_, index) =>
                                index !== 1
                            ),
                          ];
                        }

                        const cartImage =
                          images[0];

                        return (

                          <div
                            className="cart-product"
                            key={product.id}
                          >

                            {/* FOTO */}

                            <div className="cart-product-image">

                              {cartImage ? (

                                <img
                                  src={cartImage}
                                  alt={
                                    product.name
                                  }
                                />

                              ) : (

                                <div>
                                  🍃
                                </div>

                              )}

                            </div>

                            {/* INFORMACIÓN */}

                            <div className="cart-product-info">

                              <span>
                                {product.category}
                              </span>

                              <h3>
                                {product.name}
                              </h3>

                              <p>
                                Producto seleccionado
                              </p>

                            </div>

                            {/* ELIMINAR */}

                            <button
                              className="cart-remove"
                              onClick={() =>
                                removeFromCart(
                                  product.id
                                )
                              }
                              aria-label={`Eliminar ${product.name}`}
                            >
                              ✕
                            </button>

                          </div>

                        );
                      }
                    )}

                  </div>

                </>

              ) : (

                <div className="cart-empty">

                  <div className="cart-empty-icon">
                    🧺
                  </div>

                  <h3>
                    Tu canasta está vacía
                  </h3>

                  <p>
                    Selecciona tus frutas
                    favoritas para comenzar.
                  </p>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);

                      document
                        .querySelector(
                          ".products-section"
                        )
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                  >
                    Ver productos
                  </button>

                </div>

              )}

            </div>

            {/* ==========================================
                PIE DEL CARRITO
            ========================================== */}

            {cartItems.length > 0 && (

              <div className="cart-modal-footer">

                <div className="cart-total">

                  <span>
                    Total de productos
                  </span>

                  <strong>
                    {cartItems.length}
                  </strong>

                </div>

                {/* ======================================
                    WHATSAPP
                ====================================== */}

                <button
                  className="whatsapp-button"
                  onClick={sendToWhatsApp}
                >

                  <span className="whatsapp-icon">
                    ☎
                  </span>

                  <span className="whatsapp-text">
                    Pedir por WhatsApp
                  </span>

                </button>

                {/* ======================================
                    SEGUIR SELECCIONANDO
                ====================================== */}

                <button
                  className="cart-continue"
                  onClick={() =>
                    setIsCartOpen(false)
                  }
                >
                  Seguir seleccionando
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;