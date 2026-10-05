import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { isAuthenticated } from "../lib/api.js";

export default function Navbar({categories=[],query,setQuery,cart,onLogout}) {
  const [open,setOpen]=useState(false), [catOpen,setCatOpen]=useState(false);
  const navigate=useNavigate();
  const count=(cart?.items||[]).reduce((s,i)=>s+Number(i.quantity||0),0);
  return <header className="nav">
    <div className="container nav__inner">
      <Link to="/" className="nav__logo" onClick={()=>setOpen(false)}>لاوا<span>گیم</span><i>.</i></Link>
      <button className="nav__mobile" onClick={()=>setOpen(v=>!v)} aria-label="منو">☰</button>
      <nav className={`nav__links ${open?"is-open":""}`}>
        <Link to="/">خانه</Link>
        <div className="nav__products-wrap" onMouseEnter={()=>setCatOpen(true)} onMouseLeave={()=>setCatOpen(false)}>
          <button className="nav__products-btn" onClick={()=>setCatOpen(v=>!v)}>محصولات⌄</button>
          {catOpen&&<div className="category-dropdown">
            <Link to="/products" onClick={()=>setCatOpen(false)}>همه محصولات</Link>
            {categories.map(c=><Link key={c.id} to={`/products?category=${encodeURIComponent(c.slug)}`} onClick={()=>setCatOpen(false)}>{c.icon||"◈"} {c.name}</Link>)}
          </div>}
        </div>
        <Link to="/contact">تماس با ما</Link>
        <Link to="/#categories">دسته‌بندی‌ها</Link>
      </nav>
      <div className="nav__actions">
        <label className="nav__search"><span>⌕</span><input value={query||""} onChange={e=>setQuery(e.target.value)} placeholder="جستجوی محصول..."/></label>
        <Link className="nav__cart" to="/cart" aria-label="سبد خرید">🛒{count>0&&<b className="nav__cart-badge">{count}</b>}</Link>
        {isAuthenticated()?<button className="nav__account" onClick={onLogout}>خروج</button>:<div className="auth-links"><Link className="nav__account" to="/login">ورود</Link><Link className="nav__register" to="/register">ثبت نام</Link></div>}
      </div>
    </div>
  </header>;
}
