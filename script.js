// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Handling decrement and increment buttons
  const decrementButton = document.getElementById("decrement");
  const incrementButton = document.getElementById("increment");
  const countElement = document.getElementById("count");

  let count = parseInt(countElement.textContent);

  decrementButton.addEventListener("click", function () {
    if (count > 1) {
      count--;
      countElement.textContent = count;
    }
  });

  incrementButton.addEventListener("click", function () {
    count++;
    countElement.textContent = count;
  });
});

// API URL for fetching product data
const apiUrl =
  "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";

// Asynchronous function to fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Data received:", data);

    // Call the function to update the product details with the fetched data
    updateProductDetails(data.product);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the function to fetch data when the script is executed
fetchData();

// Function to update the HTML content with product data
function updateProductDetails(productData) {
  // Update heading and vendor
  const headingContainer = document.querySelector(".heading-container");
  headingContainer.querySelector("span").textContent = productData.vendor;
  headingContainer.querySelector("h1").textContent = productData.title;

  // Update prices
  const priceContainer = document.querySelector(".price-container");
  priceContainer.querySelector("h1").textContent = productData.price + ".00";

  // Function to extract numeric value from a price string
  const extractNumericValue = (priceString) => {
    // Remove non-numeric characters like $ except for dots (.) if present
    return parseFloat(priceString.replace(/[^0-9.]/g, ""));
  };

  // Extract and calculate discount percentage
  const currentPrice = extractNumericValue(productData.price);
  const oldPrice = extractNumericValue(productData.compare_at_price);
  const discountPercentage = ((oldPrice - currentPrice) / oldPrice) * 100;

  // Update discount information
  priceContainer.querySelector("span").textContent =
    discountPercentage.toFixed(0) + "% Off";
  priceContainer.querySelector("p").textContent =
    productData.compare_at_price + ".00";

  // Update colors
  const colorsBar = document.querySelector(".colors-bar");
  colorsBar.innerHTML = "";
  productData.options
    .find((option) => option.name === "Color")
    .values.forEach((color) => {
      const colorOption = document.createElement("div");
      colorOption.className = "color-option";
      colorOption.style.backgroundColor = Object.values(color)[0];
      colorsBar.appendChild(colorOption);
    });

  // Update sizes
  const sizeSelector = document.querySelector(".size-selector");
  sizeSelector.innerHTML = "";
  productData.options
    .find((option) => option.name === "Size")
    .values.forEach((size) => {
      const radioButton = document.createElement("div");
      radioButton.className = "radio-button";
      radioButton.innerHTML = `
            <input type="radio" id="${size.toLowerCase()}" name="size" />
            <label for="${size.toLowerCase()}">${size}</label>
          `;
      sizeSelector.appendChild(radioButton);
    });

  // Update product description
  const descriptionContainer = document.querySelector(".description-container");
  descriptionContainer.querySelector("p").innerHTML = productData.description;
}

// Event handler to change the main product image based on the clicked small image
function changeProductImage(event) {
  // Remove the 'active-image' class from all small images
  const smallImages = document.querySelectorAll(".small-image");
  smallImages.forEach((image) => image.classList.remove("active-image"));

  if (event.target.classList.contains("small-image")) {
    // Add the 'active-image' class to the clicked image
    event.target.classList.add("active-image");

    // Update the main product image source
    const mainProductImage = document.getElementById("mainProductImage");
    mainProductImage.src = event.target.src;
  }

  // Change the style of the clicked color-option div
  // Handling color options
}
