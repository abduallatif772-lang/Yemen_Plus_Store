const WHATSAPP_NUMBER = "967772459459";
const products = [
 {id:1,name:"سماعات بلوتوث لاسلكية",category:"الإلكترونيات",price:5500,emoji:"🎧",badge:"الأكثر طلباً",badgeType:"hot"},
 {id:2,name:"ساعة ذكية متعددة الاستخدامات",category:"مستلزمات شخصية",price:12500,emoji:"⌚",badge:"جديد",badgeType:"new"},
 {id:3,name:"سماعة بلوتوث محمولة",category:"الإلكترونيات",price:7800,emoji:"🔊",badge:"اختيار مميز",badgeType:""},
 {id:4,name:"قلاية هوائية منزلية",category:"المنزل والمطبخ",price:28500,emoji:"🍟",badge:"عرض خاص",badgeType:"hot"},
 {id:5,name:"خلاط كهربائي للمطبخ",category:"المنزل والمطبخ",price:14500,emoji:"🥤",badge:"",badgeType:""},
 {id:6,name:"هاتف ذكي",category:"الإلكترونيات",price:95000,emoji:"📱",badge:"منتج مميز",badgeType:"hot"},
 {id:7,name:"حامل هاتف للمكتب",category:"إكسسوارات",price:2500,emoji:"📱",badge:"",badgeType:""},
 {id:8,name:"مجموعة أدوات منزلية",category:"الأدوات والمعدات",price:6500,emoji:"🧰",badge:"عملي",badgeType:"new"},
 {id:9,name:"حقيبة ظهر يومية",category:"إكسسوارات",price:8500,emoji:"🎒",badge:"جديد",badgeType:"new"},
 {id:10,name:"وحدة تحكم للألعاب",category:"الألعاب والترفيه",price:18000,emoji:"🎮",badge:"",badgeType:""},
 {id:11,name:"مصباح مكتبي LED",category:"المنزل والمطبخ",price:4200,emoji:"💡",badge:"",badgeType:""},
 {id:12,name:"شاحن سريع متعدد المنافذ",category:"الإلكترونيات",price:3900,emoji:"🔌",badge:"سريع",badgeType:"new"}
];
const state = {category:"الكل",query:"",sort:"featured",cart:loadCart()};
const $ = id => document.getElementById(id);
function loadCart(){try{return JSON.parse(localStorage.getItem("yemenPlusCart")||"{}")}catch(e){return {}}}
function saveCart(){try{localStorage.setItem("yemenPlusCart",JSON.stringify(state.cart))}catch(e){}}
function money(value){return new Intl.NumberFormat("en-US").format(value)+" ر.ي"}
function filteredProducts(){
 let list=products.filter(p=>(state.category==="الكل"||p.category===state.category)&&(`${p.name} ${p.category}`).toLowerCase().includes(state.query.toLowerCase()));
 if(state.sort==="price-asc")list.sort((a,b)=>a.price-b.price);
 if(state.sort==="price-desc")list.sort((a,b)=>b.price-a.price);
 if(state.sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"ar"));
 return list;
}
function renderProducts(){
 const list=filteredProducts(), grid=$("productsGrid");
 grid.innerHTML=list.map(p=>`<article class="product-card">
  <div class="product-image"><span class="product-emoji">${p.emoji}</span>${p.badge?`<span class="product-badge ${p.badgeType}">${p.badge}</span>`:""}</div>
  <div class="product-info"><span class="product-category">${p.category}</span><h3 class="product-name">${p.name}</h3>
  <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-cart" data-add="${p.id}">＋ أضف إلى السلة</button></div></div></article>`).join("");
 $("emptyState").hidden=list.length>0;
 grid.hidden=list.length===0;
 $("productsTitle").textContent=state.category==="الكل"?"منتجات مختارة لك":state.category;
 $("activeFilter").hidden=state.category==="الكل"&&!state.query;
 $("activeFilter").textContent=[state.category!=="الكل"?`القسم: ${state.category}`:"",state.query?`البحث: ${state.query}`:""].filter(Boolean).join(" • ");
 document.querySelectorAll(".category-card").forEach(b=>b.classList.toggle("selected",b.dataset.category===state.category));
}
function cartCount(){return Object.values(state.cart).reduce((sum,n)=>sum+n,0)}
function renderCart(){
 const entries=Object.entries(state.cart).filter(([id,q])=>q>0).map(([id,q])=>({product:products.find(p=>p.id===Number(id)),qty:q})).filter(x=>x.product);
 $("cartCount").textContent=cartCount();
 $("cartEmpty").hidden=entries.length>0;
 $("cartFooter").hidden=entries.length===0;
 $("cartItems").innerHTML=entries.map(({product:p,qty})=>`<div class="cart-item"><div class="cart-item-emoji">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)} للقطعة</small><div class="qty-controls"><button data-qty="-1" data-id="${p.id}" aria-label="تقليل الكمية">−</button><span>${qty}</span><button data-qty="1" data-id="${p.id}" aria-label="زيادة الكمية">＋</button><button data-remove="${p.id}" aria-label="حذف المنتج" title="حذف">×</button></div></div><div class="cart-item-price">${money(p.price*qty)}</div></div>`).join("");
 const total=entries.reduce((sum,x)=>sum+x.product.price*x.qty,0);
 $("cartTotal").textContent=money(total);
 saveCart();
}
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2400)}
function setCategory(category){state.category=category;renderProducts();$("products").scrollIntoView({behavior:"smooth",block:"start"})}
function openCart(){ $("cartDrawer").classList.add("open");$("cartBackdrop").classList.add("open");$("cartDrawer").setAttribute("aria-hidden","false");document.body.classList.add("cart-open")}
function closeCart(){ $("cartDrawer").classList.remove("open");$("cartBackdrop").classList.remove("open");$("cartDrawer").setAttribute("aria-hidden","true");document.body.classList.remove("cart-open")}
$("categoryGrid").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b)setCategory(b.dataset.category)});
$("productsGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=b.dataset.add;state.cart[id]=(state.cart[id]||0)+1;renderCart();toast("تمت إضافة المنتج إلى السلة")});
$("cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const id=q.dataset.id;state.cart[id]=(state.cart[id]||0)+Number(q.dataset.qty);if(state.cart[id]<=0)delete state.cart[id];renderCart()}if(r){delete state.cart[r.dataset.remove];renderCart()}});
$("searchForm").addEventListener("submit",e=>{e.preventDefault();state.query=$("searchInput").value.trim();renderProducts();$("products").scrollIntoView({behavior:"smooth"})});
$("searchInput").addEventListener("input",()=>{state.query=$("searchInput").value.trim();renderProducts()});
$("sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderProducts()});
$("resetFilters").addEventListener("click",()=>{state.category="الكل";state.query="";$("searchInput").value="";renderProducts()});
$("openCart").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("cartBackdrop").addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
$("clearCart").addEventListener("click",()=>{state.cart={};renderCart();toast("تم إفراغ السلة")});
$("checkoutBtn").addEventListener("click",()=>{
 const entries=Object.entries(state.cart).filter(([id,q])=>q>0).map(([id,q])=>({p:products.find(p=>p.id===Number(id)),q})).filter(x=>x.p);
 if(!entries.length){toast("السلة فارغة");return}
 const total=entries.reduce((sum,x)=>sum+x.p.price*x.q,0);
 const lines=entries.map(x=>`• ${x.p.name} × ${x.q} = ${money(x.p.price*x.q)}`);
 const message=`مرحباً متجر يمن بلس، أرغب في طلب المنتجات التالية:\n\n${lines.join("\n")}\n\nالإجمالي التقديري: ${money(total)}\n\nالرجاء تأكيد التوفر والتكلفة النهائية والتوصيل.`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
document.querySelectorAll("[data-footer-category]").forEach(a=>a.addEventListener("click",()=>{state.category=a.dataset.footerCategory;renderProducts()}));
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
