import { useEffect, useState } from "react";
import "./ProductCard.css";
import { realProductImage } from "../data/realProductImages.js";
function format(n){return Number(n||0).toLocaleString("fa-IR")}
export default function ProductCard({product,onAddToCart}) {
 const [busy,setBusy]=useState(false);
 const realImage = realProductImage(product);
 const fallback = product.fallbackImage || `/products/${product.id}.svg`;
 const [src,setSrc]=useState(realImage || product.image || fallback);
 useEffect(()=>{setSrc(realProductImage(product) || product.image || fallback)},[product.image, product.id, product.category]);
 async function add(){setBusy(true);try{await onAddToCart?.(product)}finally{setBusy(false)}}
 return <article className="pcard">
  <div className="pcard__media">{src?<img src={src} alt={product.name} className="pcard__image" onError={()=>{if(src!==product.image && src!==fallback)setSrc(product.image || fallback); else if(src!==fallback)setSrc(fallback);}}/>:<span className="pcard__glyph">{product.category==="laptop"?"💻":"◈"}</span>}<span className="pcard__scan">LAVA / GAME</span></div>
  <div className="pcard__body"><span className="pcard__brand">{product.brand||"LAVAGAME"}</span><h3>{product.name}</h3>
   <div className="pcard__rating"><span>★</span> {format(product.rating||0)} <small>({format(product.review_count||0)})</small></div>
   <div className="pcard__footer"><div><b>{format(product.price)}</b><small> تومان</small>{product.old_price&&<del>{format(product.old_price)}</del>}</div><button onClick={add} disabled={busy}>{busy?"...":"افزودن به سبد"}</button></div>
  </div>
 </article>
}
