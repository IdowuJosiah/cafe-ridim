"use client"
import "./Hero.css";
import { BsInstagram, BsFacebook, BsTwitterX } from "react-icons/bs";
const bgImage = "https://www.figma.com/api/mcp/asset/93633085-5b25-4fa6-be23-e4e326b55db2";
const cafeRiddimLogo = "/canva.png";
const cafeRidimLogoBlack = "/canvablack.png"
import Release from "../components/release";
const artistImage = "/artist.png";
const submitImage = "/footerimage.jpg"
import Playlist from "../components/playlists";
import Link from "next/link";
import {useState} from "react";
export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<{ file?: File }>({});

    return (
        <div>
            {showModal && (
                <div className="modal__overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
                        <h2 className="modal__title">Send us music for collaboration and release consideration.</h2>
                        <p className="modal__subtitle"> If it fits the world we’re building, we’ll be in touch.</p>

                        <div className="modal__form">
                            <div className="modal__field">
                                <label>TRACK TITLE</label>
                                <input type="text" placeholder="Name of your track" />
                            </div>
                            <div className="modal__field">
                                <label>ARTIST NAME(S)</label>
                                <input type="text" placeholder="Your name or alias" />
                            </div>
                            <div className="modal__field">
                                <label>PRIMARY CONTACT EMAIL</label>
                                <input type="email" placeholder="your@email.com" />
                            </div>
                            <div className="modal__field">
                                <label>SPOTIFY (if applicable)</label>
                                <input type="url" placeholder="https://..." />
                            </div>
                            <div className="modal__field">
                                <label>ADDITIONAL NOTES (optional)</label>
                                <textarea placeholder="Who you are, where you’re from, the sound, and what you’re building" rows={4} />
                            </div>
                            <div className="modal__field">
                                <label>Upload Track</label>
                                <div className="modal__upload">
                                    <input
                                        type="file"
                                        id="track-upload"
                                        accept=".mp3,.wav,.aiff,.flac"
                                        onChange={(e) => setForm({ ...form, file: e.target.files?.[0] })}
                                    />
                                    <label htmlFor="track-upload" className="modal__upload-label">
                                        {form?.file ? form.file.name : "Click to upload or drag and drop"}
                                        <span>.MP3, .WAV, .AIFF, .FLAC</span>
                                    </label>
                                </div>
                            </div>
                            <button className="modal__submit">SUBMIT</button>
                        </div>
                    </div>
                </div>
            )}
            <section className="hero" id="hero">
                <div className="hero__overlay" />

                <nav className="hero__nav">
                    {[
                        { label: "SUBMIT MUSIC", href: "#submit" },
                        { label: "RELEASES", href: "#releases" },
                        { label: "ARTISTES", href: "#artists" },
                        { label: "PLAYLISTS", href: "#playlists" },
                        { label: "EVENTS", href: "#events" },
                        { label: "ABOUT US", href: "#about" },
                    ].map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="hero__nav-link"
                            onClick={
                                item.label === "SUBMIT MUSIC"
                                    ? (e) => {
                                        e.preventDefault();
                                        setShowModal(true);
                                    }
                                    : undefined
                            }
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="hero__tagline">
                    <svg width="550" height="230">
                        <path id="curve" d="M 50,300 A 200,200 0 0,1 550,250">
                        </path>
                        <text fill="#1a0a02" className="text" textAnchor={"middle"}>
                            <textPath fill="#1a0a02" className="text__path" href="#curve" startOffset="50%" textAnchor="middle">
                                THE SOUND OF GOLDEN HOURS
                            </textPath>
                        </text>
                    </svg>
                </div>

                <div className="hero__logo">
                    <img src={cafeRiddimLogo} alt="Cafe Riddim" />
                </div>

                <div className="hero__description">
                    <p>
                        Cafe Riddim is a collective dedicated to melodic African electronic and house music.
                        <br />
                        We curate soulful records, collaborate with artists who truly connect, and
                        <br />
                        create meaningful real-world experiences around the sound.
                    </p>
                </div>

            </section>
            <section className="release__section" id="releases">
                <div className="release-header">
                    <p>
                        RELEASES
                    </p>
                </div>
                <div className="music-cards">
                    <Release>
                    </Release>
                </div>
            </section>
            <section className="featured__section" id="artists">
                <div className="featured__header">
                    <p>
                        Featured Artists
                    </p>
                </div>
                <div className="featured__description">
                    <div className="artist__list">
                        {["LOYE", "IFEME C.S", "COZY CTRL"].map((item) => (
                            <p key={item} className="artists__list">
                                {item}
                            </p>
                        ))}
                    </div>
                    <div className="artist__image">
                        <div className="artist__image__container">
                            <img src={artistImage} alt="Artist" />
                        </div>
                    </div>

                </div>
            </section>
            <section className="playlists__section" id="playlists">
                <div>
                    <Playlist/>
                </div>
            </section>
            <section className="gallery__section" id="events">
                <div className="gallery__header">
                    <p>
                        CAFE RIDDIM LIVE
                    </p>
                </div>
                <div className="gallery__grid__section">
                    <div className="grid__top__half">
                        <div className="image__one gt">
                            1
                        </div>
                        <div className="image__one gt" >
                            2
                        </div>
                        <div className="image__one gt">
                            3
                        </div>
                        <div className="image__four__section">
                            <div className="image__four gt">
                                4
                            </div>
                            <div className="image__four gt">
                                5
                            </div>
                            <div className="image__four gt">
                                6
                            </div>
                            <div className="image__four gt">
                                7
                            </div>
                        </div>
                    </div>
                    <div className="grid__bottom__half">
                        <div className="image__nine">
                            9
                        </div>
                        <div className="image__ten">
                           10
                        </div>
                        <div className="image__ten">
                            11
                        </div>
                        <div className="image__ten__section">
                            <div className="ten__section__div">
                                12
                            </div>
                            <div className="ten__section__div">
                                13
                            </div>
                            <div className="ten__section__div">
                                14
                            </div>
                        </div>
                        <div className="image__ten">
                            16
                        </div>
                        <div className="image__nine">
                            17
                        </div>
                    </div>
                </div>
            </section>
            <footer className="footer__section" id="about">
                <div className="footer__image">
                        <img src={submitImage}/>
                </div>
                <div className="socials__section">
                    <p>
                        Follow us on Socials
                    </p>
                    <div className="socials__base">
                        <BsTwitterX />
                    </div>
                    <div className="socials__base">
                        <BsInstagram />
                    </div>
                    <div className="socials__base">
                        <BsFacebook />
                    </div>
                </div>
                <div className="footer__wts">
                    <p>
                        A @WeTalkSound Project
                    </p>
                </div>
                <div className="footer__log">
                    <img src={cafeRidimLogoBlack} alt="Cafe Riddim" />

                </div>
            </footer>
        </div>


    );
}