import{r as a}from"./vendor-react-core-DwizjWfE.js";import{j as K,_ as Q,u as q,k as B,s as z,l as J,m as $}from"./vendor-misc-B8G184xh.js";var W="right-scroll-bar-position",x="width-before-scroll-bar",_="with-scroll-bars-hidden",ee="--removed-body-scroll-bar-size",Z=K(),D=function(){},A=a.forwardRef(function(e,t){var o=a.useRef(null),r=a.useState({onScrollCapture:D,onWheelCapture:D,onTouchMoveCapture:D}),i=r[0],u=r[1],v=e.forwardProps,c=e.children,m=e.className,b=e.removeScrollBar,w=e.enabled,C=e.shards,E=e.sideCar,y=e.noRelative,R=e.noIsolation,n=e.inert,l=e.allowPinchZoom,f=e.as,s=f===void 0?"div":f,h=e.gapMode,g=Q(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),d=E,k=q([o,t]),S=B(B({},g),i);return a.createElement(a.Fragment,null,w&&a.createElement(d,{sideCar:Z,removeScrollBar:b,shards:C,noRelative:y,noIsolation:R,inert:n,setCallbacks:u,allowPinchZoom:!!l,lockRef:o,gapMode:h}),v?a.cloneElement(a.Children.only(c),B(B({},S),{ref:k})):a.createElement(s,B({},S,{className:m,ref:k}),c))});A.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};A.classNames={fullWidth:x,zeroRight:W};var te={left:0,top:0,right:0,gap:0},I=function(e){return parseInt(e||"",10)||0},re=function(e){var t=window.getComputedStyle(document.body),o=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],i=t[e==="padding"?"paddingRight":"marginRight"];return[I(o),I(r),I(i)]},ne=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return te;var t=re(e),o=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-o+t[2]-t[0])}},ae=z(),L="data-scroll-locked",oe=function(e,t,o,r){var i=e.left,u=e.top,v=e.right,c=e.gap;return o===void 0&&(o="margin"),`
  .`.concat(_,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(c,"px ").concat(r,`;
  }
  body[`).concat(L,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),o==="margin"&&`
    padding-left: `.concat(i,`px;
    padding-top: `).concat(u,`px;
    padding-right: `).concat(v,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(c,"px ").concat(r,`;
    `),o==="padding"&&"padding-right: ".concat(c,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(W,` {
    right: `).concat(c,"px ").concat(r,`;
  }
  
  .`).concat(x,` {
    margin-right: `).concat(c,"px ").concat(r,`;
  }
  
  .`).concat(W," .").concat(W,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(x," .").concat(x,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(L,`] {
    `).concat(ee,": ").concat(c,`px;
  }
`)},F=function(){var e=parseInt(document.body.getAttribute(L)||"0",10);return isFinite(e)?e:0},ce=function(){a.useEffect(function(){return document.body.setAttribute(L,(F()+1).toString()),function(){var e=F()-1;e<=0?document.body.removeAttribute(L):document.body.setAttribute(L,e.toString())}},[])},le=function(e){var t=e.noRelative,o=e.noImportant,r=e.gapMode,i=r===void 0?"margin":r;ce();var u=a.useMemo(function(){return ne(i)},[i]);return a.createElement(ae,{styles:oe(u,!t,i,o?"":"!important")})},X=!1;if(typeof window<"u")try{var T=Object.defineProperty({},"passive",{get:function(){return X=!0,!0}});window.addEventListener("test",T,T),window.removeEventListener("test",T,T)}catch{X=!1}var p=X?{passive:!1}:!1,ie=function(e){return e.tagName==="TEXTAREA"},j=function(e,t){if(!(e instanceof Element))return!1;var o=window.getComputedStyle(e);return o[t]!=="hidden"&&!(o.overflowY===o.overflowX&&!ie(e)&&o[t]==="visible")},ue=function(e){return j(e,"overflowY")},se=function(e){return j(e,"overflowX")},H=function(e,t){var o=t.ownerDocument,r=t;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var i=G(e,r);if(i){var u=U(e,r),v=u[1],c=u[2];if(v>c)return!0}r=r.parentNode}while(r&&r!==o.body);return!1},de=function(e){var t=e.scrollTop,o=e.scrollHeight,r=e.clientHeight;return[t,o,r]},fe=function(e){var t=e.scrollLeft,o=e.scrollWidth,r=e.clientWidth;return[t,o,r]},G=function(e,t){return e==="v"?ue(t):se(t)},U=function(e,t){return e==="v"?de(t):fe(t)},ve=function(e,t){return e==="h"&&t==="rtl"?-1:1},he=function(e,t,o,r,i){var u=ve(e,window.getComputedStyle(t).direction),v=u*r,c=o.target,m=t.contains(c),b=!1,w=v>0,C=0,E=0;do{if(!c)break;var y=U(e,c),R=y[0],n=y[1],l=y[2],f=n-l-u*R;(R||f)&&G(e,c)&&(C+=f,E+=R);var s=c.parentNode;c=s&&s.nodeType===Node.DOCUMENT_FRAGMENT_NODE?s.host:s}while(!m&&c!==document.body||m&&(t.contains(c)||t===c));return(w&&Math.abs(C)<1||!w&&Math.abs(E)<1)&&(b=!0),b},M=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},O=function(e){return[e.deltaX,e.deltaY]},V=function(e){return e&&"current"in e?e.current:e},me=function(e,t){return e[0]===t[0]&&e[1]===t[1]},ge=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},be=0,P=[];function Se(e){var t=a.useRef([]),o=a.useRef([0,0]),r=a.useRef(),i=a.useState(be++)[0],u=a.useState(z)[0],v=a.useRef(e);a.useEffect(function(){v.current=e},[e]),a.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(i));var n=J([e.lockRef.current],(e.shards||[]).map(V),!0).filter(Boolean);return n.forEach(function(l){return l.classList.add("allow-interactivity-".concat(i))}),function(){document.body.classList.remove("block-interactivity-".concat(i)),n.forEach(function(l){return l.classList.remove("allow-interactivity-".concat(i))})}}},[e.inert,e.lockRef.current,e.shards]);var c=a.useCallback(function(n,l){if("touches"in n&&n.touches.length===2||n.type==="wheel"&&n.ctrlKey)return!v.current.allowPinchZoom;var f=M(n),s=o.current,h="deltaX"in n?n.deltaX:s[0]-f[0],g="deltaY"in n?n.deltaY:s[1]-f[1],d,k=n.target,S=Math.abs(h)>Math.abs(g)?"h":"v";if("touches"in n&&S==="h"&&k.type==="range")return!1;var N=H(S,k);if(!N)return!0;if(N?d=S:(d=S==="v"?"h":"v",N=H(S,k)),!N)return!1;if(!r.current&&"changedTouches"in n&&(h||g)&&(r.current=d),!d)return!0;var Y=r.current||d;return he(Y,l,n,Y==="h"?h:g)},[]),m=a.useCallback(function(n){var l=n;if(!(!P.length||P[P.length-1]!==u)){var f="deltaY"in l?O(l):M(l),s=t.current.filter(function(d){return d.name===l.type&&(d.target===l.target||l.target===d.shadowParent)&&me(d.delta,f)})[0];if(s&&s.should){l.cancelable&&l.preventDefault();return}if(!s){var h=(v.current.shards||[]).map(V).filter(Boolean).filter(function(d){return d.contains(l.target)}),g=h.length>0?c(l,h[0]):!v.current.noIsolation;g&&l.cancelable&&l.preventDefault()}}},[]),b=a.useCallback(function(n,l,f,s){var h={name:n,delta:l,target:f,should:s,shadowParent:we(f)};t.current.push(h),setTimeout(function(){t.current=t.current.filter(function(g){return g!==h})},1)},[]),w=a.useCallback(function(n){o.current=M(n),r.current=void 0},[]),C=a.useCallback(function(n){b(n.type,O(n),n.target,c(n,e.lockRef.current))},[]),E=a.useCallback(function(n){b(n.type,M(n),n.target,c(n,e.lockRef.current))},[]);a.useEffect(function(){return P.push(u),e.setCallbacks({onScrollCapture:C,onWheelCapture:C,onTouchMoveCapture:E}),document.addEventListener("wheel",m,p),document.addEventListener("touchmove",m,p),document.addEventListener("touchstart",w,p),function(){P=P.filter(function(n){return n!==u}),document.removeEventListener("wheel",m,p),document.removeEventListener("touchmove",m,p),document.removeEventListener("touchstart",w,p)}},[]);var y=e.removeScrollBar,R=e.inert;return a.createElement(a.Fragment,null,R?a.createElement(u,{styles:ge(i)}):null,y?a.createElement(le,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function we(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const Ce=$(Z,Se);var ye=a.forwardRef(function(e,t){return a.createElement(A,B({},e,{ref:t,sideCar:Ce}))});ye.classNames=A.classNames;export{ye as R};
