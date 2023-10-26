const orders = [
  {
    id: 0,
    price: 300,
    created_at: "08.07.22 — 11:40",
    shop: {
      id: 1,
      title: "Black star burger",
      image: "/images/black-star.png",
      backgroundImage: "/images/shop5.jpeg",
    },
    status: "new",
    products: [
      {
        id: 0,
        img: "/images/product1.jpg",
        price: 12,
        translation: {
          locale: "en",
          title: "California with sesame",
        },
      },
      {
        id: 1,
        img: "/images/product2.jpg",
        price: 22,
        translation: {
          locale: "en",
          title: "Philadelphia roll",
        },
      },
    ],
  },
  {
    id: 1,
    price: 120,
    created_at: "08.07.22 — 11:40",
    shop: {
      id: 2,
      title: "Just Wing It. by Fresco Inc",
      image: "/images/yaponamama.png",
      backgroundImage: "/images/shop7.jpeg",
    },
    status: "accepted",
    products: [
      {
        id: 2,
        img: "/images/product3.jpg",
        price: 11,
        translation: {
          locale: "en",
          title: "Set sunman 43 pcs",
        },
      },
      {
        id: 3,
        img: "/images/product4.jpg",
        price: 32,
        translation: {
          locale: "en",
          title: "Set Kitana 90 pcs",
        },
      },
    ],
  },
];

export default orders;
