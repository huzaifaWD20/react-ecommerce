// sampleData.js
const hotProducts = [
    {
      id: 1,
      name: 'Arduino Uno',
      description: 'A microcontroller board based on the ATmega328P.',
      price: '$25.99',
      image: '/src/assets/images/bannermens.png', // Update with your image path
      rating: 4,
      reviews: [
        { user: 'John Doe', comment: 'Great product!', rating: 4 },
        { user: 'Jane Smith', comment: 'Good value for money.', rating: 5 },
      ],
    },
    {
      id: 2,
      name: 'Raspberry Pi 4',
      description: 'A small, affordable computer that you can use for programming.',
      price: '$45.99',
      image: '/src/assets/images/bannerkids.png',
      rating: 4,
      reviews: [
        { user: 'John Doe', comment: 'Great product!', rating: 4 },
        { user: 'Jane Smith', comment: 'Good value for money.', rating: 5 },
      ],
    },
    // Add more hot products as needed
  ];
  
  const latestProducts = [
    {
      id: 3,
      name: 'ESP8266 WiFi Module',
      description: 'A low-cost Wi-Fi microchip with full TCP/IP stack.',
      price: '$6.50',
      image: '/src/assets/images/product_1.png',
      rating: 4,
      reviews: [
        { user: 'John Doe', comment: 'Great product!', rating: 4 },
        { user: 'Jane Smith', comment: 'Good value for money.', rating: 5 },
      ],
    },
    {
      id: 4,
      name: 'DC Motor',
      description: 'A DC motor is any of a class of rotary electrical motors that converts direct current electrical energy into mechanical energy.',
      price: '$10.00',
      image: '/src/assets/images/product_2.png',
      rating: 4,
      reviews: [
        { user: 'John Doe', comment: 'Great product!', rating: 4 },
        { user: 'Jane Smith', comment: 'Good value for money.', rating: 5 },
      ],
    },
    // Add more latest products as needed
  ];
  
  const featuredProducts = [
    {
      id: 5,
      name: 'Breadboard',
      description: 'A breadboard is a construction base for prototyping of electronics.',
      price: '$4.50',
      image: '/src/assets/images/product_3.png',
      rating: 4,
      reviews: [
        { user: 'John Doe', comment: 'Great product!', rating: 4 },
        { user: 'Jane Smith', comment: 'Good value for money.', rating: 5 },
      ],
    },
    {
      id: 6,
      name: 'Jumper Wires',
      description: 'Jumper wires are simple wires that have connector pins at each end.',
      price: '$2.99',
      image: '/src/assets/images/product_4.png',
      rating: 4,
      reviews: [
        { user: 'John Doe', comment: 'Great product!', rating: 4 },
        { user: 'Jane Smith', comment: 'Good value for money.', rating: 5 },
      ],
    },
    // Add more featured products as needed
  ];
  
  export { hotProducts, latestProducts, featuredProducts };
  