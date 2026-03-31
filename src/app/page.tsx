"use client"
import "./Hero.css";
import { BsInstagram, BsFacebook, BsTwitterX } from "react-icons/bs";
const bgImage = "https://www.figma.com/api/mcp/asset/93633085-5b25-4fa6-be23-e4e326b55db2";
const cafeRiddimLogo = "/canva.png";
const cafeRidimLogoBlack = "/canvablack.png"
import Release from "../components/release";
const artistImage = "/artist.png";
const submitImage = "/houn3.png";
const heroSubmitImage = "/hountop.png"
import Playlist from "../components/playlists";
import Link from "next/link";
import {useState, useEffect} from "react";
import Image from "next/image";
import { getSpotifyToken, getArtist, Artist } from "../lib/spotify";



const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const url = (id: string) =>
    `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto/${id}`;

const g = {
    one: url("image-one_lrcgy0"),
    two: url("image-two_f1oqsy"),
    three: url("image-three_ivxxcc"),
    four: url("image-four_smpwob"),
    five: url("image-fiver_daz5ua"),
    six: url("image-six_sch9bt"),
    seven: url("image-seven_wvs3g6"),
    nine: url("image-nine_fizpux"),
    ten: url("image-ten_nds4s9"),
    eleven: url("image-eleven_cmet6d"),
    twelve: url("image-twelve_jk2xtp"),
    thirteen: url("image-thirteen_r25pql"),
    fourteen: url("image-fourteen_xsqwya"),
    sixteen: url("image-sixteen_dqu1wo"),
    seventeen: url("image-seventeen_vcggep"),
};

const ARTISTS = [
    {
        name: "LOYE",
        image: "/Ifeme.png",
    },
    {
        name: "IFEME C.S",
        image: "/Loye.png",
    },
    {
        name: "COZY CTRL",
        image: "/cozyctrl.png",
    },
];
export default function Home() {





    const [activeArtist, setActiveArtist] = useState(ARTISTS[0]);




    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<{
        artistName?: string;
        email?: string;
        trackTitle?: string;
        link?: string;
        message?: string;
        file?: File;
    }>({});

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

        const [fieldErrors, setFieldErrors] = useState<{
            trackTitle?: string;
            artistName?: string;
            email?: string;
            link?: string;
            file?: string;
        }>({});
        const validate = () => {
            const errors: typeof fieldErrors = {};
            if (!form.trackTitle) errors.trackTitle = "Track title is required";
            if (!form.artistName) errors.artistName = "Artist name is required";
            if (!form.email) {
                errors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                errors.email = "Please enter a valid email";
            }
            if (form.link && !/^https?:\/\/.+/.test(form.link)) {
                errors.link = "Please enter a valid URL starting with https://";
            }
            if (!form.file) errors.file = "Please upload a track";
            return errors;
        };
        const handleSubmit = async () => {
            const errors = validate();
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                return;
            }

            setFieldErrors({});
            setLoading(true);
            setError("");

            try {
                let fileUrl = null;

                if (form.file) {
                    const fileData = new FormData();
                    fileData.append("file", form.file);
                    fileData.append("upload_preset", "cafe_riddim_unsigned"); // your preset name
                    fileData.append("folder", "cafe-riddim/submissions");

                    const uploadRes = await fetch(
                        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
                        { method: "POST", body: fileData }
                    );
                    const uploadData = await uploadRes.json();
                    console.log("Cloudinary response:", uploadData);
                    fileUrl = uploadData.secure_url;
                }

                const res = await fetch("/api/submit-music", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        artistName: form.artistName,
                        email: form.email,
                        trackTitle: form.trackTitle,
                        link: form.link,
                        message: form.message,
                        fileUrl,
                    }),
                });

                if (!res.ok) throw new Error("Failed");
                setSuccess(true);
            } catch {
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };





        return (
        <div>
            {showModal && (
                <div className="modal__overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
                        <h2 className="modal__title">Send us music for collaboration and release consideration.</h2>
                        <p className="modal__subtitle"> If it fits the world we’re building, we’ll be in touch.</p>

                        {success ? (
                            <div className="modal__success">
                                <p>🎵 Submission received! Well be in touch.</p>
                            </div>
                        ) : (
                            <div className="modal__form">
                                <div className="modal__field">
                                    <label>TRACK TITLE</label>
                                    <input
                                        type="text"
                                        placeholder="Name of your track"
                                        onChange={(e) => setForm({ ...form, trackTitle: e.target.value })}
                                    />
                                    {fieldErrors.trackTitle && <span className="field__error">{fieldErrors.trackTitle}</span>}
                                </div>

                                <div className="modal__field">
                                    <label>ARTIST NAME(S)</label>
                                    <input
                                        type="text"
                                        placeholder="Your name or alias"
                                        onChange={(e) => setForm({ ...form, artistName: e.target.value })}
                                    />
                                    {fieldErrors.artistName && <span className="field__error">{fieldErrors.artistName}</span>}
                                </div>

                                <div className="modal__field">
                                    <label>PRIMARY CONTACT EMAIL</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                    {fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}
                                </div>

                                <div className="modal__field">
                                    <label>SPOTIFY (if applicable)</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    />
                                    {fieldErrors.link && <span className="field__error">{fieldErrors.link}</span>}
                                </div>
                                <div className="modal__field">
                                    <label>ADDITIONAL NOTES (optional)</label>
                                    <textarea
                                        placeholder="Who you are, where you're from, the sound, and what you're building"
                                        rows={4}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    />
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
                                    {fieldErrors.file && <span className="field__error">{fieldErrors.file}</span>}
                                </div>
                                {error && <p className="modal__error">{error}</p>}
                                <button
                                    className="modal__submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? "SENDING..." : "SUBMIT"}
                                </button>
                            </div>
                        )}
                        <div>

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
                <div className="hero__genres">
                    <h2 className="hero__genres-title">Genres We Play In</h2>
                    <p className="hero__genres-list">Afrohouse · 3-Step · Mara · GQOM · Melodic House · Afro Tech · Tribal House</p>
                </div>
                <div className="hero__submit">
                    <img
                        src={heroSubmitImage}
                        className="spin"
                        alt="logo"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModal(true);
                        }}
                    />
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
            {/*<section className="featured__section" id="artists">*/}
            {/*    <div className="featured__header">*/}
            {/*        <p>FEATURED ARTIST</p>*/}
            {/*    </div>*/}
            {/*    <div className="featured__description">*/}
            {/*        <div className="artist__list">*/}
            {/*            {ARTISTS.map((artist, i) => (*/}
            {/*                <p*/}
            {/*                    key={i}*/}
            {/*                    className={`artists__list ${activeArtist.name === artist.name ? "active" : ""}`}*/}
            {/*                    onClick={() => setActiveArtist(artist)}*/}
            {/*                >*/}
            {/*                    {artist.name}*/}
            {/*                </p>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*        <div className="artist__image">*/}
            {/*            <div className="artist__image__container">*/}
            {/*                <img*/}
            {/*                    src={activeArtist.image}*/}
            {/*                    alt={activeArtist.name}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section> */}

            <section className="playlists__section" id="playlists">
                    <Playlist/>
            </section>
            <section className="video__section" id="events">
                <div className="video__container">
                    <iframe
                        src="https://www.youtube.com/embed/KSob0FVsKIQ"
                        title="Cafe Riddim Live"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
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
                            <img src={g.one} alt={"image"} loading="lazy" />
                        </div>
                        <div className="image__one gt" >
                            <img src={g.two} alt={"image"} loading="lazy" />
                        </div>
                        <div className="image__one gt">
                            <img src={g.seventeen} alt={"image"} loading="lazy" />
                        </div>
                        <div className="image__four__section">
                            <div className="image__four gt">
                                <img src={g.four} alt={"image"} loading="lazy" />
                            </div>
                            <div className="image__four gt">
                                <img src={g.five} alt={"image"} loading="lazy" />
                            </div>
                            <div className="image__four gt">
                                <img src={g.six} alt={"image"} loading="lazy" />
                            </div>
                            <div className="image__four gt">
                                <img src={g.seven} alt={"image"} loading="lazy" />
                            </div>
                        </div>
                    </div>
                    <div className="grid__bottom__half">
                        <div className="image__nine">
                            <img src={g.seven} alt={"image"} loading="lazy" />
                        </div>
                        <div className="image__ten">
                            <img src={g.nine} alt={"image"} loading="lazy" />
                        </div>
                        <div className="image__ten">
                            <img src={g.sixteen} alt={"image"} loading="lazy" />
                        </div>
                        <div className="image__ten__section">
                            <div className="ten__section__div">
                                <img src={g.thirteen} alt={"image"} loading="lazy" />
                            </div>
                            <div className="ten__section__div">
                                <img src={g.fourteen} alt={"image"} loading="lazy" />
                            </div>
                            <div className="ten__section__div">
                                <img src={g.five} alt={"image"} loading="lazy" />
                            </div>
                        </div>
                        <div className="image__ten">
                            <img src={g.sixteen} alt={"image"} loading="lazy" />
                        </div>
                        <div className="image__nine">
                            <img src={g.three} alt={"image"} loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>
            <footer className="footer__section" id="about">
                <div className="footer__image">
                    <img
                        src={submitImage}
                        className="spin"
                        alt="logo"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModal(true);
                        }}
                    />                </div>
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