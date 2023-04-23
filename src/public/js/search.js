const search_btn = document.querySelector('.search-btn');
const searchForm = document.querySelector('.app-search-form');
const searchInput = document.querySelector('.search-input');
const listProduct = document.querySelector('#list-product');
searchForm.addEventListener('submit', search);
searchInput.addEventListener('keyup', search);
async function search() {
    try {
        const data = {
            query: searchInput.value.trim(),
        };
        const response = await fetch('http://localhost:8000/admin/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result) {
            listProduct.innerHTML = '';
        }
        loadProducts(result);
    } catch (err) {
        console.log(err);
    }
}
function loadProducts(arr = []) {
    const result = arr.map((product, index) => {
        return `
        <tr>
        <td class="td_checkbox pl-5">
        <input class="form-check-input checkbox mb-3" type="checkbox" value="${
            product._id
        }"
            name="checkIDs[]" />
        </td>
        <td class="cell">${index + 1}</td>
        <td class="cell"><span class="truncate">${product.name}</span></td>
        <td class="cell">${product.price}</td>
        <td class="cell"><img class="list-img-admin" src="${
            product.image.url || `/images/${product.image}`
        } " alt="${product.image.public_id}">
        </td>
        <td class="cell">${product.standOut}</td>
        <td class="cell">
        <a class="btn btn-outline-info" href="/admin/${product._id}/edit">
            <i class="fa-solid fa-marker"></i>
            Sửa
        </a>
        <button id="btn-delete" type="button" class="btn btn-outline-danger" data-id="${
            product._id
        }"
            data-bs-toggle="modal" data-bs-target="#delele-product-modal">
            <i class="fa-solid fa-delete-left"></i>
            Xóa
        </button>
        </td>
        
    </tr>    
        `;
    });
    listProduct.innerHTML += result;
}
