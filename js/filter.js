// Filter functionality for donanimlar.html page
document.addEventListener('DOMContentLoaded', function() {
    // Get all checkboxes
    const ekrankartiCheckbox = document.getElementById('ekrankarti-filter');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const anakartCheckbox = checkboxes[1];
    const fanCheckbox = checkboxes[2];
    const islemciCheckbox = checkboxes[3];
    const kasaCheckbox = checkboxes[4];
    const psuCheckbox = checkboxes[5];
    const ramCheckbox = checkboxes[6];
    const ssdCheckbox = checkboxes[7];

    // Get all product elements
    const allProducts = document.querySelectorAll('.ekrankartları');
    
    // Function to get product category based on image path
    function getProductCategory(productElement) {
        const img = productElement.querySelector('img');
        if (img) {
            const src = img.src.toLowerCase();
            
            if (src.includes('ekran kartları') || src.includes('ekrankartları')) {
                return 'ekrankartı';
            } else if (src.includes('anakart')) {
                return 'anakart';
            } else if (src.includes('islemci') || src.includes('işlemci')) {
                return 'işlemci';
            } else if (src.includes('ram')) {
                return 'ram';
            } else if (src.includes('ssd')) {
                return 'ssd';
            } else if (src.includes('psu')) {
                return 'psu';
            } else if (src.includes('kasa')) {
                return 'kasa';
            } else if (src.includes('fan')) {
                return 'fan';
            }
        }
        return 'other';
    }
    
    // Function to filter products based on category
    function filterProducts(category) {
        allProducts.forEach(product => {
            if (category) {
                const productCategory = getProductCategory(product);
                if (productCategory === category.toLowerCase()) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            } else {
                product.style.display = 'block';
            }
        });
    }
    
    // Function to reset all checkboxes
    function resetCheckboxes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox !== ekrankartiCheckbox && 
                checkbox !== anakartCheckbox && 
                checkbox !== fanCheckbox && 
                checkbox !== islemciCheckbox && 
                checkbox !== kasaCheckbox && 
                checkbox !== psuCheckbox && 
                checkbox !== ramCheckbox && 
                checkbox !== ssdCheckbox) {
                checkbox.checked = false;
            }
        });
    }
    
    // Add event listeners to checkboxes
    if (ekrankartiCheckbox) {
        ekrankartiCheckbox.addEventListener('change', function() {
            if (this.checked) {
                resetCheckboxes();
                this.checked = true;
                filterProducts('ekrankartı'); // Filter for ekrankartı products
            } else {
                filterProducts(''); // Show all products
            }
        });
    }
    
    if (anakartCheckbox) {
        anakartCheckbox.addEventListener('change', function() {
            if (this.checked) {
                resetCheckboxes();
                this.checked = true;
                filterProducts('anakart'); // Filter for anakart products
            } else {
                filterProducts(''); // Show all products
            }
        });
    }
    
    if (islemciCheckbox) {
        islemciCheckbox.addEventListener('change', function() {
            if (this.checked) {
                resetCheckboxes();
                this.checked = true;
                filterProducts('işlemci'); // Filter for işlemci products
            } else {
                filterProducts(''); // Show all products
            }
        });
    }
    
    if (ramCheckbox) {
        ramCheckbox.addEventListener('change', function() {
            if (this.checked) {
                resetCheckboxes();
                this.checked = true;
                filterProducts('ram'); // Filter for ram products
            } else {
                filterProducts(''); // Show all products
            }
        });
    }
    
    if (ssdCheckbox) {
        ssdCheckbox.addEventListener('change', function() {
            if (this.checked) {
                resetCheckboxes();
                this.checked = true;
                filterProducts('ssd'); // Filter for ssd products
            } else {
                filterProducts(''); // Show all products
            }
        });
    }
    
    if (psuCheckbox) {
        psuCheckbox.addEventListener('change', function() {
            if (this.checked) {
                resetCheckboxes();
                this.checked = true;
                filterProducts('psu'); // Filter for psu products
            } else {
                filterProducts(''); // Show all products
            }
        });
    }
    
    if (kasaCheckbox) {
        kasaCheckbox.addEventListener('change', function() {
            if (this.checked) {
                resetCheckboxes();
                this.checked = true;
                filterProducts('kasa'); // Filter for kasa products
            } else {
                filterProducts(''); // Show all products
            }
        });
    }
    
    if (fanCheckbox) {
        fanCheckbox.addEventListener('change', function() {
            if (this.checked) {
                resetCheckboxes();
                this.checked = true;
                filterProducts('fan'); // Filter for fan products
            } else {
                filterProducts(''); // Show all products
            }
        });
    }
    
    // Add "EKRANKARTI" text next to the first checkbox
    if (ekrankartiCheckbox && ekrankartiCheckbox.parentNode) {
        const label = document.createElement('span');
        label.textContent = ' EKRANKARTI';
        label.style.cursor = 'pointer';
        label.onclick = function() {
            ekrankartiCheckbox.checked = !ekrankartiCheckbox.checked;
            ekrankartiCheckbox.dispatchEvent(new Event('change'));
        };
        ekrankartiCheckbox.parentNode.insertBefore(label, ekrankartiCheckbox.nextSibling);
    }
});