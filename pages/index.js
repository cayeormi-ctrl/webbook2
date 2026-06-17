import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const pageWidth = 1464;
const pageHeight = 1080;
const pages = [
  { type: "cover", src: "/cover.svg" },
  { type: "page", src: "/png/page_01.png" },
  { type: "page", src: "/png/page_02.png" },
  { type: "page", src: "/png/page_03.png" },
  { type: "page", src: "/png/page_04.png" },
  { type: "page", src: "/png/page_05.png" },
  { type: "page", src: "/png/page_06.png" },
  { type: "page", src: "/png/page_07.png" },
  { type: "page", src: "/png/page_08.png" },
  { type: "page", src: "/png/page_09.png" },
  { type: "page", src: "/png/page_10.png" },
  { type: "page", src: "/png/page_11.png" },
  { type: "page", src: "/png/page_12.png" },
  { type: "page", src: "/png/page_13.png" },
  { type: "page", src: "/png/page_14.png" },
  { type: "page", src: "/png/page_15.png" },
  { type: "page", src: "/png/page_16.png" },
  { type: "page", src: "/png/page_17.png" },
  { type: "page", src: "/png/page_18.png" },
  { type: "page", src: "/png/page_19.png" },
  { type: "page", src: "/png/page_20.png" },
  { type: "page", src: "/png/page_21.png" },
  { type: "page", src: "/png/page_22.png" },
  { type: "page", src: "/png/page_23.png" },
  { type: "page", src: "/png/page_24.png" },
  { type: "page", src: "/png/page_25.png" },
  { type: "page", src: "/png/page_26.png" },
  { type: "page", src: "/png/page_27.png" },
  { type: "page", src: "/png/page_28.png" },
  { type: "page", src: "/png/page_29.png" },
  { type: "page", src: "/png/page_30.png" },
  { type: "page", src: "/png/page_11-1.png" },
  { type: "page", src: "/png/page_12-1.png" },
  { type: "page", src: "/png/page-31.png" },
  { type: "page", src: "/png/page-32.png" },
  { type: "page", src: "/png/page_33.png" },
  { type: "page", src: "/png/page_34.png" },
  { type: "page", src: "/png/page-35.png" },
  { type: "page", src: "/png/page_36.png", video: "/finalmotion.mp4" },
  { type: "page", src: "/png/page_37.png" },
  { type: "page", src: "/png/page_38.png" },
  { type: "page", src: "/png/page_39.png" },
  { type: "page", src: "/png/page_40.png" },
  { type: "back", src: "/Back.svg" }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const bookRef = useRef(null);
  const pageFlipRef = useRef(null);
  const turningRef = useRef(false);

  useEffect(() => {
    if (document.body) {
      document.body.dataset.atCover = currentIndex === 0 ? "true" : "false";
      document.body.dataset.atBack = currentIndex === pages.length - 1 ? "true" : "false";
      if (pageFlipRef.current) {
        try {
          document.body.dataset.orientation = pageFlipRef.current.getOrientation();
        } catch (e) {
          // Ignore if render not initialized
        }
      }
    }
  }, [currentIndex]);

  const initBook = (startPage = 0) => {
    if (pageFlipRef.current) {
      pageFlipRef.current.turnToPage(startPage);
      return;
    }

    if (!bookRef.current || !window.St || !window.St.PageFlip) {
      return;
    }

    const book = bookRef.current;
    book.innerHTML = '';
    
    pages.forEach((page, index) => {
      const pageEl = document.createElement("div");
      pageEl.className = "page";
      pageEl.dataset.page = String(index + 1);
      
      pageEl.innerHTML = `<img src="${page.src}" alt="${page.type === "back" ? "Back cover" : page.type === "cover" ? "Cover" : `Page ${index}`}" />`;
      
      if (page.video) {
        pageEl.insertAdjacentHTML("beforeend", `
          <video class="laptop-video" src="${page.video}" autoplay muted loop playsinline preload="metadata"></video>
        `);
      }
      book.appendChild(pageEl);
    });

    const pageFlip = new window.St.PageFlip(book, {
      width: pageWidth / 2,
      height: pageHeight / 2,
      size: "stretch",
      minWidth: 300,
      maxWidth: pageWidth / 2,
      minHeight: 222,
      maxHeight: pageHeight / 2,
      maxShadowOpacity: 0.19,
      showCover: true,
      startPage,
      mobileScrollSupport: false,
      useMouseEvents: true,
      swipeDistance: 18,
      flippingTime: 760,
      drawShadow: true,
      showPageCorners: false
    });

    pageFlipRef.current = pageFlip;
    window.webbook = pageFlip;

    pageFlip.on("flip", event => setUi(event.data));
    pageFlip.on("init", event => setUi(event.data.page));
    pageFlip.on("changeOrientation", event => {
      try {
        document.body.dataset.orientation = event.data || pageFlip.getOrientation();
      } catch (e) {
        console.warn(e);
      }
    });

    pageFlip.loadFromHTML(book.querySelectorAll(".page"));

    if (document.body) {
      try {
        document.body.dataset.orientation = pageFlip.getOrientation();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const setUi = (index) => {
    setCurrentIndex(index);
    if (document.body) {
      document.body.dataset.atCover = index === 0 ? "true" : "false";
      document.body.dataset.atBack = index === pages.length - 1 ? "true" : "false";
      if (pageFlipRef.current) {
        try {
          document.body.dataset.orientation = pageFlipRef.current.getOrientation();
        } catch (e) {
          // Ignore if render is not yet initialized
        }
      }
    }
  };

  useEffect(() => {
    if (window.St && window.St.PageFlip) {
      initBook(0);
    }
  }, []);

  const goPrev = () => {
    if (turningRef.current) return;
    if (!pageFlipRef.current) return;
    turningRef.current = true;
    pageFlipRef.current.flipPrev("top");
    window.setTimeout(() => { turningRef.current = false; }, 760);
  };

  const goNext = () => {
    if (turningRef.current) return;
    if (!pageFlipRef.current) return;
    turningRef.current = true;
    pageFlipRef.current.flipNext("top");
    window.setTimeout(() => { turningRef.current = false; }, 760);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight" || event.key === " ") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  const pageDisplay = currentIndex + 1;
  const progressPercent = (pageDisplay / pages.length) * 100;

  return (
    <>
      <Head>
        <title>UX Research Webbook</title>
        <meta name="description" content="UX Research web flipbook" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Script 
        src="/page-flip.browser.js" 
        strategy="afterInteractive" 
        onLoad={() => initBook(0)}
      />

      <span className="corner-mark a"></span>
      <span className="corner-mark b"></span>
      <span className="corner-mark c"></span>
      <span className="corner-mark d"></span>

      <main className="stage" aria-label="UX Research webbook">
        <section className="book-shell">
          <div id="book" className="book" ref={bookRef}></div>
          <button 
            className="arrow prev" 
            id="prevPage"
            onClick={goPrev} 
            disabled={currentIndex === 0}
            aria-label="Previous page"
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 9 13 24l15 15" />
              <path d="M14 24h25" />
            </svg>
          </button>
          <button 
            className="arrow next" 
            id="nextPage"
            onClick={goNext} 
            disabled={currentIndex >= pages.length - 1}
            aria-label="Next page"
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M20 9 35 24 20 39" />
              <path d="M34 24H9" />
            </svg>
          </button>

          <footer className="toolbar">
            <div className="progress" aria-live="polite">
              <span id="pageNow">{String(pageDisplay).padStart(2, "0")}</span>
              <div className="progress-line" aria-hidden="true">
                <span id="progressBar" style={{ width: `${progressPercent}%` }}></span>
              </div>
              <span id="pageTotal">{String(pages.length).padStart(2, "0")}</span>
            </div>
          </footer>
        </section>
      </main>
    </>
  )
}
