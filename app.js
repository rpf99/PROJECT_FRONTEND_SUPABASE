const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');

const updateModal = document.querySelector("#update-modal");
const closeModalButton = document.querySelector('#close-modal');
const updateProductForm = document.querySelector('#update-product-form');


const getProductForm = document.querySelector("#get-product-form")
const getProductId = document.querySelector("#product_id")
const getProductDetails = document.querySelector("#product-details")



function openModal(product) {
  if (!product) return; // Garantia contra chamadas inválidas

  updateProductId.value = product.id;
  updateProductName.value = product.name;
  updateProductPrice.value = product.price;
  updateProductDescription.value = product.description;

  updateModal.style.display = 'block';
}

function closeModal() {
  updateModal.style.display = 'none';
}

closeModalButton.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
  if (event.target === updateModal) {
    closeModal();
  }
});


// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://136.248.93.139:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price}`;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => openModal(product)); 
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}


async function getProductById(product_id) {
  try {
    const response = await fetch(`http://136.248.93.139:3000/products/${product_id}`);
    if (!response.ok) {
      throw new Error('Produto não encontrado');
    }

    const product = await response.json()

    getProductDetails.innerHTML = `
        <h3> Detalhes </h3>
        <p><strong>Nome:</strong> ${product.name} </p>
        <p><strong>Preço:</strong> ${product.price} </p>
        <p><strong>Descrição:</strong> ${product.description} </p>
    `
  } catch (error) {
      getProductDetails.innerHTML = `<p>${error.message} </p>`
  }  
}



// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  await addProduct(name, price, description);
  addProductForm.reset();
  await fetchProducts();
});



getProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const productId = productIdInput.value;
  if (productId) {
    getProductById(productId);
  }  
})



//Event Listener to Update the Product
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductForm.elements['id'].value;
  const name = updateProductForm.elements['name'].value;
  const price = updateProductForm.elements['price'].value;
  const description = updateProductForm.elements['description'].value;

  // Envia a requisição PUT para atualizar o produto
  const response = await fetch('http://136.248.93.139:3000/products/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, price, description }),
  });

  // Verifica se a resposta foi bem-sucedida
  if (response.ok) {
    closeModal(); // Fecha o modal após a atualização
    fetchProducts(); // Atualiza a lista de produtos
  } else {
    alert('Erro ao atualizar o produto');
  }
});


// Function to add a new product
async function addProduct(name, price, description) {
  const response = await fetch('http://136.248.93.139:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to delete a new product
async function deleteProduct(id) {
  const response = await fetch('http://136.248.93.139:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify({id})
  });
  return response.json();
}

// Fetch all products on page load
//fetchProducts();

window.addEventListener('load', fetchProducts);
