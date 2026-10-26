const products = [
  {id:1,name:"Studio Wireless Headphones",category:"Electronics",price:79.99,originalPrice:99.99,rating:4.8,reviews:124,tag:"BESTSELLER",isNew:false,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Minimal Smart Watch",category:"Electronics",price:129.99,originalPrice:159.99,rating:4.6,reviews:89,tag:"POPULAR",isNew:true,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Everyday Runner Sneakers",category:"Fashion",price:64.99,originalPrice:84.99,rating:4.7,reviews:203,tag:"-24%",isNew:false,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Urban Daypack",category:"Accessories",price:49.99,originalPrice:64.99,rating:4.5,reviews:72,tag:"EVERYDAY",isNew:false,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Everyday Laptop",category:"Electronics",price:699.99,originalPrice:799.99,rating:4.7,reviews:56,tag:"TOP PICK",isNew:true,image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Pocket Smartphone",category:"Electronics",price:499.99,originalPrice:549.99,rating:4.4,reviews:148,tag:"JUST IN",isNew:true,image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Classic Frame Sunglasses",category:"Fashion",price:29.99,originalPrice:39.99,rating:4.3,reviews:94,tag:"SUMMER FAV",isNew:false,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Active Fitness Band",category:"Electronics",price:39.99,originalPrice:49.99,rating:4.2,reviews:61,tag:"GOOD VALUE",isNew:false,image:"https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=700&q=80"},
  {id:9,name:"Soft Knit Throw",category:"Home",price:44.99,originalPrice:54.99,rating:4.8,reviews:115,tag:"COZY PICK",isNew:false,image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80"},
  {id:10,name:"Ceramic Coffee Set",category:"Home",price:34.99,originalPrice:42.99,rating:4.6,reviews:83,tag:"HAND FINISH",isNew:true,image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80"},
  {id:11,name:"Leather Everyday Wallet",category:"Accessories",price:24.99,originalPrice:32.99,rating:4.4,reviews:67,tag:"GIFT IDEA",isNew:false,image:"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80"},
  {id:12,name:"Portable Bluetooth Speaker",category:"Electronics",price:89.99,originalPrice:109.99,rating:4.7,reviews:132,tag:"BESTSELLER",isNew:true,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"}
];

const state = {category:"All",maxPrice:1000,minRating:0,query:"",sort:"featured",cart:[],wishlist:new Set()};
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const productGrid = $("#productGrid");
const money = value => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(value);

function getFilteredProducts(){
  let list = products.filter(product => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const searchText = `${product.name} ${product.category} ${product.tag}`.toLowerCase();
    return matchesCategory && product.price <= state.maxPrice && product.rating >= state.minRating && searchText.includes(state.query.toLowerCase());
  });
  switch(state.sort){
    case "newest": list.sort((a,b) => Number(b.isNew)-Number(a.isNew) || b.id-a.id); break;
    case "price-low": list.sort((a,b) => a.price-b.price); break;
    case "price-high": list.sort((a,b) => b.price-a.price); break;
    case "rating": list.sort((a,b) => b.rating-a.rating); break;
  }
  return list;
}
function productCard(product){
  const saved = state.wishlist.has(product.id);
  const badge = product.isNew ? "NEW" : product.tag;
  const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5-Math.round(product.rating));
  return `<article class="product-card">
    <div class="product-image-wrap">
      <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x500/172033/e7e9f5?text=ShopZone'">
      <span class="product-badge">${badge}</span>
      <button class="wishlist-button ${saved?"saved":""}" data-wishlist="${product.id}" aria-label="${saved?"Remove from":"Add to"} wishlist" title="Wishlist">${saved?"♥":"♡"}</button>
    </div>
    <div class="product-info">
      <span class="product-category">${product.category}</span>
      <h3 class="product-name" title="${product.name}">${product.name}</h3>
      <div class="rating-row"><span class="stars" aria-label="${product.rating} out of 5 stars">${stars}</span><span>${product.rating.toFixed(1)} (${product.reviews})</span></div>
      <div class="product-price-row"><span class="product-price">${money(product.price)}</span><span class="old-price">${money(product.originalPrice)}</span></div>
      <button class="add-cart" data-add="${product.id}">Add to bag <span aria-hidden="true">＋</span></button>
    </div>
  </article>`;
}
function renderProducts(){
  const list = getFilteredProducts();
  productGrid.innerHTML = list.map(productCard).join("");
  $("#emptyState").hidden = list.length !== 0;
  productGrid.hidden = list.length === 0;
  $("#resultCount").textContent = `Showing ${list.length} of ${products.length} products`;
  renderActiveFilters();
}
function renderActiveFilters(){
  const chips = [];
  if(state.category !== "All") chips.push(["category",state.category]);
  if(state.maxPrice < 1000) chips.push(["price",`Up to ${money(state.maxPrice)}`]);
  if(state.minRating > 0) chips.push(["rating",`${state.minRating}★ & up`]);
  if(state.query) chips.push(["query",`Search: ${state.query}`]);
  $("#activeFilters").innerHTML = chips.map(([key,label])=>`<span class="filter-chip">${label}<button data-remove-filter="${key}" aria-label="Remove ${label} filter">×</button></span>`).join("");
}
function clearFilters(){
  state.category="All";state.maxPrice=1000;state.minRating=0;state.query="";state.sort="featured";
  $$('input[name="category"]').forEach(input=>input.checked=input.value==="All");
  $("#priceRange").value=1000;$("#priceValue").textContent="$0 – $1,000";
  $("#ratingFilter").value="0";$("#searchInput").value="";$("#sortSelect").value="featured";
  renderProducts();
}
function showToast(message){
  const toast=$("#toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function updateCart(){
  const count=state.cart.reduce((sum,item)=>sum+item.qty,0);
  const subtotal=state.cart.reduce((sum,item)=>sum+item.qty*products.find(p=>p.id===item.id).price,0);
  $("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;$("#cartSubtotal").textContent=money(subtotal);
  $("#cartEmpty").hidden=state.cart.length>0;$("#cartFooter").hidden=state.cart.length===0;
  $("#cartItems").innerHTML=state.cart.map(item=>{
    const p=products.find(product=>product.id===item.id);
    return `<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><span class="cart-item-price">${money(p.price)}</span><div class="qty-control"><button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">＋</button></div></div><button class="remove-item" data-remove-item="${p.id}" aria-label="Remove ${p.name}">Remove</button></div>`;
  }).join("");
}
function openCart(){
  $("#cartDrawer").classList.add("open");$("#cartBackdrop").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";$("#closeCart").focus();
}
function closeCart(){
  $("#cartDrawer").classList.remove("open");$("#cartBackdrop").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow="";
}
function addToCart(id){
  const item=state.cart.find(item=>item.id===id);
  if(item)item.qty++;else state.cart.push({id,qty:1});
  updateCart();showToast(`${products.find(p=>p.id===id).name} added to your bag.`);
}
productGrid.addEventListener("click",event=>{
  const add=event.target.closest("[data-add]");
  const wish=event.target.closest("[data-wishlist]");
  if(add)addToCart(Number(add.dataset.add));
  if(wish){const id=Number(wish.dataset.wishlist);state.wishlist.has(id)?state.wishlist.delete(id):state.wishlist.add(id);renderProducts();showToast(state.wishlist.has(id)?"Added to wishlist ♥":"Removed from wishlist");}
});
$("#activeFilters").addEventListener("click",event=>{
  const button=event.target.closest("[data-remove-filter]");if(!button)return;
  const key=button.dataset.removeFilter;
  if(key==="category"){state.category="All";$('input[name="category"][value="All"]').checked=true;}
  if(key==="price"){state.maxPrice=1000;$("#priceRange").value=1000;$("#priceValue").textContent="$0 – $1,000";}
  if(key==="rating"){state.minRating=0;$("#ratingFilter").value="0";}
  if(key==="query"){state.query="";$("#searchInput").value="";}
  renderProducts();
});
$$('input[name="category"]').forEach(input=>input.addEventListener("change",()=>{state.category=input.value;renderProducts();}));
$("#priceRange").addEventListener("input",event=>{state.maxPrice=Number(event.target.value);$("#priceValue").textContent=`$0 – ${Number(state.maxPrice).toLocaleString("en-US")}`;renderProducts();});
$("#ratingFilter").addEventListener("change",event=>{state.minRating=Number(event.target.value);renderProducts();});
$("#sortSelect").addEventListener("change",event=>{state.sort=event.target.value;renderProducts();});
$("#searchInput").addEventListener("input",event=>{state.query=event.target.value.trim();renderProducts();});
$("#clearFilters").addEventListener("click",clearFilters);$("#emptyClear").addEventListener("click",clearFilters);
$("#cartButton").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#cartBackdrop").addEventListener("click",closeCart);
$("#cartItems").addEventListener("click",event=>{
  const qty=event.target.closest("[data-qty]"),remove=event.target.closest("[data-remove-item]");
  if(qty){const id=Number(qty.dataset.qty),item=state.cart.find(i=>i.id===id);item.qty+=Number(qty.dataset.change);if(item.qty<=0)state.cart=state.cart.filter(i=>i.id!==id);updateCart();}
  if(remove){const id=Number(remove.dataset.removeItem);state.cart=state.cart.filter(i=>i.id!==id);updateCart();}
});
$("#checkoutButton").addEventListener("click",()=>showToast("Checkout is a demo. Connect a backend to accept real orders."));
$("#themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("light-theme");
  const light=document.body.classList.contains("light-theme");
  $("#themeToggle").textContent=light?"☾":"☼";
  $("#themeToggle").setAttribute("aria-label",light?"Switch to dark theme":"Switch to light theme");
});
$("#menuToggle").addEventListener("click",()=>{
  const open=$("#mainNav").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded",String(open));$("#menuToggle").setAttribute("aria-label",open?"Close navigation":"Open navigation");
});
$("#mainNav").addEventListener("click",event=>{if(event.target.closest("a")){$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}});
$$("[data-footer-category]").forEach(link=>link.addEventListener("click",()=>{state.category=link.dataset.footerCategory;$(`input[name="category"][value="${state.category}"]`).checked=true;renderProducts();}));
$("#newsletterForm").addEventListener("submit",event=>{
  event.preventDefault();const email=$("#emailInput").value.trim();
  if(!email)return;$("#newsletterMessage").textContent=`Thanks! ${email} has been added to this demo list.`;$("#emailInput").value="";showToast("Thanks for subscribing!");
});
document.addEventListener("keydown",event=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();$("#searchInput").focus();}
  if(event.key==="Escape"){closeCart();$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}
});
$("#year").textContent=new Date().getFullYear();
renderProducts();updateCart();
