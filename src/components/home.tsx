"use client"
import "../app/Hero.css";
import { BsInstagram, BsFacebook, BsTwitterX } from "react-icons/bs";
const cafeRiddimLogo = "/canva.webp";
const cafeRidimLogoBlack = "/canvablack.webp"
import Release from "./release";
const artistImage = "/artist.png";
const submitImage = "/houn3.webp";
const heroSubmitImage = "/hountop.webp"
import Playlist from "./playlists";
import {useState} from "react";
import type { Track } from "../lib/spotify";
import type { Playlist as PlaylistLink } from "../lib/links";



const g = {
    one: "/gallery/one.webp",
    two: "/gallery/two.webp",
    three: "/gallery/three.webp",
    four: "/gallery/four.webp",
    five: "/gallery/five.webp",
    six: "/gallery/six.webp",
    seven: "/gallery/seven.webp",
    nine: "/gallery/nine.webp",
    ten: "/gallery/ten.webp",
    eleven: "/gallery/eleven.webp",
    twelve: "/gallery/twelve.webp",
    thirteen: "/gallery/thirteen.webp",
    fourteen: "/gallery/fourteen.webp",
    sixteen: "/gallery/sixteen.webp",
    seventeen: "/gallery/seventeen.webp",
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
export default function Home({ releases, playlists }: { releases: Track[]; playlists: PlaylistLink[] }) {





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
        const closeModal = () => {
            setShowModal(false);
            setForm({});
            setFieldErrors({});
            setError("");
            setSuccess(false);
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
                    if (!uploadRes.ok || !uploadData.secure_url) {
                        throw new Error("Upload failed");
                    }
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
                <div className="modal__overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal__close" onClick={closeModal}>✕</button>
                        <h2 className="modal__title">Send us music for collaboration and release consideration.</h2>
                        <p className="modal__subtitle"> If it fits the world we’re building, we’ll be in touch.</p>

                        {success ? (
                            <div className="modal__success">
                                <p>🎵 Submission received! We’ll be in touch.</p>
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
                    <img src={cafeRiddimLogo} alt="Cafe Riddim" fetchPriority="high" />
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
                    <Release releases={releases} />
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
                    <Playlist playlists={playlists} />
            </section>
            <section className="video__section" id="events">
                <div className="video__container">
                    <iframe
                        src="https://www.youtube.com/embed/KSob0FVsKIQ"
                        title="Cafe Riddim Live"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div className="hero__genres__video">
                    <a href="https://www.youtube.com/channel/UCiZMqKD0K1Iu3yUwGocBR5A"> CLICK HERE TO GET MORE OF OUR SETS HERE </a>
                </div>
            </section>
            <section className="gallery__section" id="gallery">
                <div className="gallery__header">
                    <p>
                        CAFE RIDDIM LIVE
                    </p>
                </div>
                <div className="gallery__grid">
                    <div className="gallery__item"><img src={g.one} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.two} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.three} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.four} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.five} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.six} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.seven} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.nine} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.ten} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.eleven} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.twelve} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.thirteen} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.fourteen} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.sixteen} alt="gallery" loading="lazy" /></div>
                    <div className="gallery__item"><img src={g.seventeen} alt="gallery" loading="lazy" /></div>
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

                </div>
                <div className="footer__log">
                    <img src={cafeRidimLogoBlack} alt="Cafe Riddim" />

                </div>
            </footer>
        </div>


    );
}