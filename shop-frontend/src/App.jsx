import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ChatBot from "./components/ChatBot.jsx";
import ProductCard from "./components/ProductCard.jsx";
import { api, apiUrl, isAuthenticated, logout } from "./lib/api.js";

function Layout({ children, categories, cart, setCart, query, setQuery }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notice, setNotice] = useState("");
  useEffect(() => { const h = e => { setNotice(e.detail || ""); setTimeout(() => setNotice(""), 3000); }; window.addEventListener("lava-toast", h); return () => window.removeEventListener("lava-toast", h); }, []);

  async function loadCart() {
    if (!isAuthenticated()) { setCart({items:[], total_price:0}); return; }
    try { setCart(await api.cart()); } catch { setCart({items:[], total_price:0}); }
  }
  useEffect(() => { loadCart(); }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  async function addToCart(product) {
    if (!isAuthenticated()) {
      setNotice("برای افزودن کالا ابتدا وارد حساب کاربری شوید.");
      setTimeout(()=>setNotice(""),3000);
      navigate("/login?next="+encodeURIComponent(location.pathname));
      return;
    }
    try {
      const data = await api.addToCart(product.id, 1);
      setCart(data);
      setNotice("✓ محصول به سبد خرید اضافه شد.");
    } catch(e) { setNotice(e.message || "افزودن به سبد ناموفق بود."); }
    setTimeout(()=>setNotice(""),3000);
  }

  function signOut() {
    logout();
    setCart({items:[],total_price:0});
    navigate("/");
  }

  return <div className="lava-app" dir="rtl">
    <Navbar categories={categories} query={query} setQuery={setQuery} cart={cart}
      onLogout={signOut} />
    {notice && <div className="toast">{notice}</div>}
    {children}
    <ChatBot />
  </div>;
}

function Home({categories, products, query, setQuery, setCategory}) {
  const navigate=useNavigate();
  const visible = useMemo(() => {
    const q=query.trim().toLowerCase();
    return products.filter(p=>!q || `${p.name} ${p.brand||""}`.toLowerCase().includes(q)).slice(0,8);
  },[products,query]);
  return <main>
    <section className="hero-v2" id="top">
      <div className="hero-orb hero-orb-a"/><div className="hero-orb hero-orb-b"/><div className="hero-grid"/>
      <div className="container hero-layout"><div className="hero-copy">
        <div className="live-pill"><span/> لاوا گیم / فروشگاه تخصصی گیمینگ</div>
        <h1>بازی را شروع کن.<br/><em>سیستم را ارتقا بده.</em></h1>
        <p>سخت‌افزار و تجهیزات گیمینگ را با یک تجربه خرید سریع، مدرن و واقعی پیدا کن.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={()=>navigate("/products")}>مشاهده همه محصولات <b>←</b></button>
          <button className="btn-secondary" onClick={()=>document.getElementById("categories")?.scrollIntoView({behavior:"smooth"})}>دسته‌بندی‌ها</button>
        </div>
        <div className="hero-metrics"><div><strong>{products.length}+</strong><span>محصول فعال</span></div><div><strong>{categories.length}</strong><span>دسته‌بندی</span></div><div><strong>24/7</strong><span>پشتیبانی آنلاین</span></div></div>
      </div><div className="hero-console" aria-hidden="true"><div className="console-glow"/><div className="console-card">
        <div className="console-top"><span>LAVA / PERFORMANCE</span><span className="status">● ONLINE</span></div>
        <div className="core-ring"><div><b>98</b><small>%</small><span>POWER READY</span></div></div>
        <div className="telemetry"><div><span>FRAME RATE</span><b>240 FPS</b></div><div><span>THERMAL</span><b>61°C</b></div><div><span>VRAM</span><b>16 GB</b></div></div>
        <div className="console-bars">{Array.from({length:10},(_,i)=><i key={i}/>)}</div>
      </div><span className="float-tag tag-one">RTX / READY</span><span className="float-tag tag-two">NVMe ×2</span></div></div>
    </section>
    <div className="marquee-strip"><div>LAVAGAME <span>●</span> GAMING HARDWARE <span>●</span> PERFORMANCE <span>●</span> POWER YOUR PLAY <span>●</span> LAVAGAME</div></div>

    <section className="section" id="categories"><div className="container">
      <SectionTitle eyebrow="01 / CATEGORIES" title="دسته‌بندی‌های لاوا گیم" text="روی هر دسته بزن تا صفحه اختصاصی محصولات همان دسته باز شود."/>
      <div className="category-bento">{categories.map((cat,i)=><button key={cat.id} className={`cat-tile tile-${i%4}`} onClick={()=>{setCategory(cat.slug);navigate(`/products?category=${encodeURIComponent(cat.slug)}`)}}>
        <span className="tile-index">{String(i+1).padStart(2,"0")}</span><span className="cat-icon">{cat.icon||"◈"}</span><span className="cat-name">{cat.name}</span><span className="cat-arrow">↗</span>
      </button>)}</div>
    </div></section>

    <section className="section products-section"><div className="container">
      <div className="section-head-row"><SectionTitle eyebrow="02 / STORE" title="محصولات منتخب" text="کالاها مستقیم از API بک‌اند خوانده می‌شوند."/>
      <button className="btn-secondary" onClick={()=>navigate("/products")}>مشاهده همه ←</button></div>
      <div className="product-grid">{visible.map(p=><ProductCard key={p.id} product={{...p,image:apiUrl(p.main_image),fallbackImage:`/products/${p.id}.svg`}} onAddToCart={window.__lavaAddToCart}/>)}</div>
    </div></section>
    <section className="visual-stage"><div className="container stage-grid"><div className="stage-copy"><span className="eyebrow">03 / LAVA GAME</span><h2>هر فریم مهم است.</h2><p>محصولات واقعی، دسته‌بندی واقعی و سبد خرید متصل به Django.</p><div className="stage-list"><div><b>01</b><span>ورود و ثبت‌نام واقعی</span></div><div><b>02</b><span>سبد خرید با افزایش و کاهش تعداد</span></div><div><b>03</b><span>دسته‌بندی‌های جداگانه</span></div></div></div><div className="stage-art"><div className="gpu-shape"><span>LG</span></div><div className="stage-line line-a"/><div className="stage-line line-b"/><div className="stage-line line-c"/></div></div></section>
  </main>;
}

function SectionTitle({eyebrow,title,text}) { return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text&&<p>{text}</p>}</div>; }

function ProductsPage({categories, products, query, setQuery, setCategory}) {
  const navigate=useNavigate(), params=new URLSearchParams(useLocation().search);
  const selected=params.get("category")||"";
  const [loading,setLoading]=useState(false);
  const filtered=products.filter(p=>(!selected || p.category===selected) && (!query || `${p.name} ${p.brand||""}`.toLowerCase().includes(query.toLowerCase())));
  return <main className="page"><div className="container">
    <div className="page-heading"><span className="eyebrow">LAVA STORE</span><h1>محصولات</h1><p>دسته‌بندی موردنظر را انتخاب کن؛ هر دسته حداقل ۵ محصول دارد.</p></div>
    <div className="category-menu-page"><button className={!selected?"active":""} onClick={()=>navigate("/products")}>همه</button>{categories.map(c=><button key={c.id} className={selected===c.slug?"active":""} onClick={()=>{setCategory(c.slug);navigate(`/products?category=${encodeURIComponent(c.slug)}`)}}>{c.icon} {c.name}</button>)}</div>
    {loading?<div className="loading-grid">{[1,2,3,4].map(i=><div className="skeleton" key={i}/>)}</div>:<div className="product-grid">{filtered.map(p=><ProductCard key={p.id} product={{...p,image:apiUrl(p.main_image),fallbackImage:`/products/${p.id}.svg`}} onAddToCart={window.__lavaAddToCart}/>)}</div>}
    {!filtered.length&&<div className="empty-state">محصولی در این دسته پیدا نشد.</div>}
  </div></main>;
}

function AuthPage({mode="login", onAuth}) {
  const navigate=useNavigate();
  const [register,setRegister]=useState(mode==="register");
  const [form,setForm]=useState({username:"",phone_number:"",email:"",password:""});
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setError("");setBusy(true);
    try {
      if(register) { await api.register(form); await api.login({username:form.username,password:form.password}); }
      else await api.login({username:form.username,password:form.password});
      onAuth(); navigate("/");
    } catch(err){setError(err.message||"اطلاعات واردشده صحیح نیست.");} finally{setBusy(false);}
  }
  return <main className="auth-page"><div className="auth-card">
    <div className="auth-brand">لاوا<span>گیم</span><i>.</i></div>
    <h1>{register?"ساخت حساب کاربری":"ورود به حساب"}</h1>
    <p>{register?"حساب خودت را بساز تا سبد خرید و سفارش‌هایت ذخیره شوند.":"برای ادامه خرید وارد حساب کاربری شو."}</p>
    <form onSubmit={submit}>
      <label>نام کاربری<input required value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></label>
      {register&&<><label>شماره موبایل<input required value={form.phone_number} onChange={e=>setForm({...form,phone_number:e.target.value})} placeholder="09123456789"/></label><label>ایمیل<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label></>}
      <label>رمز عبور<input required type="password" minLength="8" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
      {error&&<div className="form-error">{error}</div>}
      <button className="auth-submit" disabled={busy}>{busy?"در حال پردازش...":register?"ثبت نام":"ورود"}</button>
    </form>
    <div className="auth-switch">{register?"حساب داری؟ ":"حساب نداری؟ "}<button onClick={()=>{setRegister(!register);setError("")}}>{register?"ورود":"ثبت نام"}</button></div>
  </div></main>;
}

function CartPage({cart,setCart}) {
  const [error,setError]=useState("");
  const update=async(item,qty)=>{try{const c=await api.updateCartItem(item.id,qty);setCart(c)}catch(e){setError(e.message)}};
  const remove=async(item)=>{try{const c=await api.removeCartItem(item.id);setCart(c)}catch(e){setError(e.message)}};
  if(!isAuthenticated()) return <main className="page"><div className="container"><div className="empty-state"><h2>ابتدا وارد حساب شوید</h2><Link className="auth-submit inline" to="/login">ورود / ثبت نام</Link></div></div></main>;
  return <main className="page"><div className="container"><div className="page-heading"><span className="eyebrow">YOUR CART</span><h1>سبد خرید</h1></div>
    {error&&<div className="form-error">{error}</div>}
    {!cart.items?.length?<div className="empty-state">سبد خرید خالی است.</div>:<div className="cart-layout"><div className="cart-items">{cart.items.map(item=><article className="cart-item" key={item.id}><div><b>{item.product_name}</b><span>{Number(item.price).toLocaleString("fa-IR")} تومان</span></div><div className="qty"><button onClick={()=>update(item,item.quantity-1)}>−</button><strong>{item.quantity}</strong><button onClick={()=>update(item,item.quantity+1)}>+</button></div><strong>{Number(item.subtotal).toLocaleString("fa-IR")} تومان</strong><button className="remove-btn" onClick={()=>remove(item)}>حذف</button></article>)}</div><aside className="cart-summary"><h2>خلاصه سفارش</h2><div><span>مجموع</span><strong>{Number(cart.total_price||0).toLocaleString("fa-IR")} تومان</strong></div><button className="auth-submit">ادامه و ثبت سفارش</button></aside></div>}
  </div></main>;
}

function AppInner(){
  const [categories,setCategories]=useState([]),[products,setProducts]=useState([]),[cart,setCart]=useState({items:[],total_price:0}),[query,setQuery]=useState(""),[category,setCategory]=useState("");
  useEffect(()=>{Promise.all([api.categories().catch(()=>[]),api.products("page_size=50&ordering=-id").catch(()=>({results:[]}))]).then(([c,p])=>{setCategories(c.results||c||[]);setProducts(p.results||p||[]);});},[]);
  window.__lavaAddToCart = async product => {
    if(!isAuthenticated()){ window.location.href="/login"; return; }
    try{const c=await api.addToCart(product.id,1);setCart(c);window.dispatchEvent(new CustomEvent("lava-toast",{detail:"محصول به سبد خرید اضافه شد."}));}catch(e){window.dispatchEvent(new CustomEvent("lava-toast",{detail:e.message}));}
  };
  return <Layout categories={categories} cart={cart} setCart={setCart} query={query} setQuery={setQuery}>
    <Routes>
      <Route path="/" element={<Home categories={categories} products={products} query={query} setQuery={setQuery} setCategory={setCategory}/>}/>
      <Route path="/products" element={<ProductsPage categories={categories} products={products} query={query} setQuery={setQuery} setCategory={setCategory}/>}/>
      <Route path="/login" element={<AuthPage mode="login" onAuth={()=>api.cart().then(setCart).catch(()=>{})}/>}/>
      <Route path="/register" element={<AuthPage mode="register" onAuth={()=>api.cart().then(setCart).catch(()=>{})}/>}/>
      <Route path="/cart" element={<CartPage cart={cart} setCart={setCart}/>}/>
      <Route path="/contact" element={<main className="page"><div className="container"><div className="page-heading"><span className="eyebrow">CONTACT</span><h1>ارتباط با لاوا گیم</h1><p>برای پشتیبانی و مشاوره خرید با ما در تماس باشید.</p></div><div className="contact-card"><b>پشتیبانی آنلاین</b><span>هر روز، ۲۴ ساعت</span><b>تلفن</b><span>۰۲۱-۱۲۳۴۵۶۷۸</span><b>ایمیل</b><span>support@lavagame.local</span></div></div></main>}/>
      <Route path="*" element={<Home categories={categories} products={products} query={query} setQuery={setQuery} setCategory={setCategory}/>}/>
    </Routes>
  </Layout>;
}
export default function App(){ return <BrowserRouter><AppInner/></BrowserRouter>; }
